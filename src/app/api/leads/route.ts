import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { saveLead } from "@/lib/leadsStore";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerByEmail } from "@/lib/customerStore";
import { sendLeadNotification, UserAccountContext } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      location,
      zip,
      city,
      projectType,
      interest,
      budget,
      enquiryDetails,
      source,
      notes,
    } = body;

    const leadName = (name || body.fullName || body.customerName || "Website Visitor").trim();
    const leadEmail = (email || body.customerEmail || "").toLowerCase().trim();
    const leadPhone = phone || body.customerPhone || null;
    const leadZip = zip || body.customerZip || null;
    const leadCity = city || body.customerCity || null;
    const leadLocation = location || leadCity || (leadZip ? `ZIP: ${leadZip}` : null);
    const leadEnquiry = enquiryDetails || body.message || body.requirements || body.details || null;
    const leadSource = source || body.leadSource || "CONTACT_FORM";
    const leadProjectType = projectType || interest || (leadEnquiry?.match(/\[Interest:\s*([^\]]+)\]/i)?.[1]) || "Modular Homes";
    const leadBudget = budget || body.budgetRange || null;

    if (!leadEmail) {
      return NextResponse.json(
        { success: false, error: { message: "Email is required to submit an inquiry.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // 1. Resolve logged-in customer session context
    let userContext: UserAccountContext = {
      userId: null,
      accountEmail: null,
      accountName: null,
      isAuthenticated: false,
    };
    let customerNote = "";

    try {
      const session = await getCustomerSession();
      if (session) {
        userContext = {
          userId: session.id,
          accountEmail: session.email,
          accountName: session.name,
          isAuthenticated: true,
        };
        customerNote = `[Registered Customer: ${session.name} (${session.id})] `;
      } else {
        const existing = await getCustomerByEmail(leadEmail);
        if (existing) {
          userContext = {
            userId: existing.id,
            accountEmail: existing.email,
            accountName: existing.name,
            isAuthenticated: false,
          };
          customerNote = `[Existing Customer: ${existing.name} (${existing.id})] `;
        }
      }
    } catch {}

    const leadData = {
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      location: leadLocation,
      zip: leadZip,
      enquiry_details: leadEnquiry,
      source: leadSource,
      status: "NEW" as const,
      notes: customerNote ? `${customerNote}${notes || ""}`.trim() : notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 2. PRIMARY OPERATION: Save to database first
    let savedRecord: any = null;
    let databaseSuccess = false;

    // Immediately save to persistent store (guarantees persistence)
    try {
      savedRecord = saveLead(leadData);
      if (savedRecord && savedRecord.id) {
        databaseSuccess = true;
        console.log(`[Database Save]: SUCCESS leadId=${savedRecord.id}`);
      }
    } catch (saveErr) {
      console.error("[Database Save]: FAILED in local store:", saveErr);
    }

    // Also persist to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from("leads")
          .insert(leadData)
          .select()
          .single();

        if (!error && data) {
          savedRecord = data;
          databaseSuccess = true;
          console.log(`[Database Save]: SUCCESS Supabase leadId=${data.id}`);
        }
      } catch (sbErr) {
        console.warn("Supabase lead insert warning, captured locally:", sbErr);
      }
    }

    if (!databaseSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Failed to record inquiry into database. Please try again.",
            code: "DATABASE_ERROR",
          },
        },
        { status: 500 }
      );
    }

    // 3. SECONDARY OPERATION: Dispatch Admin Email Notification
    // If newsletter subscription, skip full contact lead email unless required
    if (leadSource !== "NEWSLETTER") {
      try {
        await sendLeadNotification({
          leadId: savedRecord?.id,
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          city: leadCity,
          zip: leadZip,
          location: leadLocation,
          projectType: leadProjectType,
          budget: leadBudget,
          message: leadEnquiry,
          submissionDate: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
          source: leadSource,
          userContext,
        });
      } catch (emailErr: any) {
        console.warn("[Admin Notification]: FAILED for leadId=", savedRecord?.id, emailErr?.message || emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: savedRecord,
      message: "Your inquiry has been received. Our team will contact you shortly.",
    });
  } catch (error: any) {
    console.error("Public lead submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || "Failed to submit inquiry. Please try again.",
          code: "LEAD_SUBMISSION_ERROR",
        },
      },
      { status: 500 }
    );
  }
}
