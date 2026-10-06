import fs from "fs";
import path from "path";
import { CmsPage, PageSection } from "./publicData";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const PAGES_FILE = path.join(DATA_DIR, "custom_pages.json");
const SECTIONS_FILE = path.join(DATA_DIR, "custom_sections.json");

export function isUuidString(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

const SEED_PAGES: CmsPage[] = [
  {
    id: "page-new-home",
    title: "New Home",
    slug: "new-home",
    subtitle: "Discover our newest modular and prefabricated custom homes",
    content: `<h2>Welcome to Our New Modular Home Designs</h2>
<p>Explore cutting-edge floor plans, energy-efficient steel framing, and precision manufacturing engineered for modern living.</p>
<h3>Key Features</h3>
<ul>
  <li><strong>Precision Steel Framing:</strong> Zero warping, mold-proof, and engineered for high wind zones.</li>
  <li><strong>Turnkey Rapid Delivery:</strong> Factory-built in 4-8 weeks and assembled on your foundation.</li>
  <li><strong>Customizable Layouts:</strong> Choose your bedrooms, bathrooms, exterior siding, and luxury finishes.</li>
</ul>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "New Home | ModularHome.com",
    metaDescription: "Explore our newest modular home designs, modern floor plans, and rapid prefab delivery.",
    sections: [
      {
        id: "sec-new-home-trust",
        pageId: "page-new-home",
        type: "TRUST",
        title: "Why Choose Our New Home Series",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: "sec-new-home-cta",
        pageId: "page-new-home",
        type: "CTA",
        title: "Ready to Build Your New Home?",
        subtitle: "Get a free itemized quote or consult with our architectural design team.",
        displayOrder: 2,
        isVisible: true,
      }
    ]
  },
  {
    id: "page-warranty",
    title: "Warranty Information & Engineering Certifications",
    slug: "warranty",
    subtitle: "Comprehensive 50-Year Structural Steel & 10-Year Weatherproofing Guarantee",
    content: `<h2>50-Year Structural Warranty</h2>
<p>Every ModularHome structure is built with precision cold-formed galvanized steel trusses and framing members engineered to withstand hurricane winds (up to 150 MPH) and extreme snow loads (up to 50 PSF). Our structural frames are guaranteed against rust-through, rot, warping, and seismic failure for 50 full years.</p>

<h3>What Is Covered</h3>
<ul>
  <li><strong>Structural Steel Frame:</strong> 50-year non-prorated structural integrity warranty.</li>
  <li><strong>Roofing & Thermal Envelope:</strong> 25-year manufacturer standing seam roof & weather barrier warranty.</li>
  <li><strong>Plumbing & Electrical:</strong> 10-year comprehensive factory-installed systems warranty.</li>
  <li><strong>Interior Fixtures & Appliances:</strong> Full manufacturer warranties passed directly to the homeowner.</li>
  <li><strong>Cosmetic Workmanship:</strong> 1-year comprehensive factory finish and fitment guarantee.</li>
</ul>

<h3>IBC & State Modular Certifications</h3>
<p>All modular plans and finished modules carry stamped state engineering approvals and comply with all applicable International Building Codes (IBC) and International Residential Codes (IRC). Each home receives factory quality control stamps and state modular insignia before shipment.</p>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Warranty Information & Engineering Certifications | ModularHome.com",
    metaDescription: "Learn about ModularHome.com's 50-year structural warranty, IBC engineering certifications, and quality standards.",
    sections: [
      {
        id: "sec-trust-warranty",
        pageId: "page-warranty",
        type: "TRUST",
        title: "Built For Generations",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: "sec-how-warranty",
        pageId: "page-warranty",
        type: "HOW_IT_WORKS",
        title: "Our Precision Build Quality",
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: "sec-cta-warranty",
        pageId: "page-warranty",
        type: "CTA",
        title: "Ready to Build Your Certified Modular Home?",
        subtitle: "Speak with an architectural housing advisor today or get an instant engineering estimate.",
        displayOrder: 3,
        isVisible: true,
      }
    ]
  },
  {
    id: "page-warranty-certifications",
    title: "Warranty & Engineering Certifications",
    slug: "warranty-certifications",
    subtitle: "50-Year Structural Steel & 10-Year Systems Guarantee",
    content: `<h2>50-Year Structural Warranty</h2>
<p>Every ModularHome structure is built with precision cold-formed galvanized steel trusses and framing members engineered to withstand hurricane winds (up to 150 MPH) and extreme snow loads (up to 50 PSF). Our structural frames are guaranteed against rust-through, rot, warping, and seismic failure for 50 full years.</p>

<h3>What Is Covered</h3>
<ul>
  <li><strong>Structural Steel Frame:</strong> 50-year non-prorated structural integrity warranty.</li>
  <li><strong>Roofing & Thermal Envelope:</strong> 25-year manufacturer standing seam roof & weather barrier warranty.</li>
  <li><strong>Plumbing & Electrical:</strong> 10-year comprehensive factory installed systems warranty.</li>
  <li><strong>Interior Fixtures & Appliances:</strong> Full manufacturer warranties passed directly to the homeowner.</li>
</ul>

<h3>IBC & State Modular Certifications</h3>
<p>All plans and builds carry stamped state engineering approvals and comply with all applicable International Building Codes (IBC) and International Residential Codes (IRC).</p>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Warranty & Engineering Certifications | ModularHome.com",
    metaDescription: "Learn about ModularHome.com's 50-year structural warranty, IBC engineering certifications, and quality standards.",
  },
  {
    id: "page-privacy",
    title: "Privacy Policy",
    slug: "privacy-policy",
    subtitle: "How ModularHome.com collects, uses, and protects your personal information",
    content: `<h2>Your Privacy Matters</h2>
<p>At ModularHome.com, we respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, store, and process information when you browse our catalog, use our quotation tools, submit floor plans, or contact our customer team.</p>

<h3>Information We Collect</h3>
<ul>
  <li><strong>Contact Information:</strong> Your name, email address, phone number, and delivery location/ZIP code.</li>
  <li><strong>Project Details:</strong> Preferred home styles, bedrooms, square footage requirements, budget range, and custom blueprint uploads.</li>
  <li><strong>Usage Data:</strong> Pages visited, device type, approximate geographic location, and interaction logs to improve site performance.</li>
</ul>

<h3>How We Use Your Information</h3>
<ul>
  <li>To generate accurate regional housing quotations and freight delivery estimates.</li>
  <li>To connect you with certified local modular builders, site crews, and logistics partners.</li>
  <li>To process floor plan licensing purchases and provide customer support.</li>
  <li>To send project updates, newsletters, and promotional announcements when opted in.</li>
</ul>

<h3>Data Security & No Third-Party Sales</h3>
<p>We implement 256-bit SSL encryption and strict access controls to safeguard your data. We never sell or rent your personal information to third-party marketing companies.</p>

<h3>Contact Our Privacy Officer</h3>
<p>If you have any questions regarding your data or wish to request data deletion, please contact us at <strong>privacy@modularhome.com</strong> or call <strong>+1 (812) 595-4033</strong>.</p>`,
    status: "PUBLISHED",
    seoTitle: "Privacy Policy | ModularHome.com",
    metaDescription: "Read the ModularHome.com privacy policy to understand how we safeguard your personal and project information.",
  },
  {
    id: "page-terms",
    title: "Terms of Service",
    slug: "terms-of-service",
    subtitle: "Terms and conditions governing the use of ModularHome.com services and marketplace",
    content: `<h2>Terms of Service</h2>
<p>By accessing or using ModularHome.com, you agree to comply with and be bound by these terms of service.</p>

<h3>1. Modular Home Quotes & Estimates</h3>
<p>All preliminary pricing estimates provided by our online calculators, quotation wizards, and catalog listings are approximations based on standard site conditions. Binding turnkey contracts are subject to localized site inspection, foundation engineering, soil testing, and local municipal zoning requirements.</p>

<h3>2. Architectural Plans & CAD Licensing</h3>
<p>Purchased floor plans and blueprints are licensed for single-structure construction unless a multi-use developer license is explicitly issued. Digital downloads may not be resold, redistributed, or sublicensed without prior written consent.</p>

<h3>3. Factory Manufacturing & Delivery</h3>
<p>Manufacturing schedules and transit timetables are provided in good faith. Actual delivery dates may depend on state transportation permit approvals, severe weather events, and site foundation readiness.</p>

<h3>4. Governing Law</h3>
<p>These terms and any disputes arising out of your use of the website or services shall be governed by and construed in accordance with the laws of the State of Indiana, United States.</p>`,
    status: "PUBLISHED",
    seoTitle: "Terms of Service | ModularHome.com",
    metaDescription: "Terms of service and customer agreements for ModularHome.com.",
  },
  {
    id: "page-refund",
    title: "Refund & Cancellation Policy",
    slug: "refund-cancellation-policy",
    subtitle: "Clear policies on digital floor plan licensing, design deposits, and factory order cancellations",
    content: `<h2>Refund & Cancellation Policy</h2>
<p>At ModularHome.com, we strive for total transparency in all customer transactions. Please review our policies for digital products, custom architectural services, and factory build orders below.</p>

<h3>1. Digital Floor Plans & CAD Blueprints</h3>
<p>Due to the instant delivery nature of digital goods, floor plan PDF downloads and CAD file packages are non-refundable once downloaded. If you encounter any technical difficulty accessing your files, our support team will provide replacement downloads immediately.</p>

<h3>2. Custom Architectural & Engineering Retainers</h3>
<p>Initial design drafting retainers are 100% refundable within 48 hours of initial payment if drafting work has not yet commenced. Once structural engineering reviews or stamped blueprint drafting has begun, retainers are non-refundable but applicable as a credit toward your home order.</p>

<h3>3. Factory Module Manufacturing Orders</h3>
<ul>
  <li><strong>Prior to Steel Framing Fabrication:</strong> Cancellation is subject to a 10% administrative and engineering fee, with the balance of your factory deposit refunded in full.</li>
  <li><strong>After Factory Fabrication Commences:</strong> Because modular homes are built to custom state and client specifications, in-progress factory orders cannot be refunded.</li>
</ul>

<h3>How to Request a Cancellation</h3>
<p>Please submit written cancellation requests to <strong>support@modularhome.com</strong> with your order reference number and project address.</p>`,
    status: "PUBLISHED",
    seoTitle: "Refund & Cancellation Policy | ModularHome.com",
    metaDescription: "Understand the ModularHome.com refund and cancellation terms for floor plans, design retainers, and factory build orders.",
  },
  {
    id: "page-shipping",
    title: "Shipping & Delivery Policy",
    slug: "shipping-delivery-policy",
    subtitle: "Nationwide freight logistics, oversized transport permits, and crane set coordination",
    content: `<h2>Shipping & Delivery Policy</h2>
<p>ModularHome.com coordinates turnkey freight logistics for modular sections, steel barndominium kits, and prefab cabins across all 48 contiguous United States and Alaska.</p>

<h3>1. Logistics & Oversized Transport</h3>
<p>Modular units are transported via specialized heavy-duty lowboy trailers and escort vehicles. All oversized state department of transportation (DOT) permits, route surveys, and bridge clearances are managed by our logistics dispatch team.</p>

<h3>2. Site Readiness & Delivery Requirements</h3>
<ul>
  <li><strong>Road Accessibility:</strong> Delivery access roads must accommodate 53-foot tractor-trailers with a minimum 14-foot overhead clearance (free of low tree branches and power lines).</li>
  <li><strong>Foundation Readiness:</strong> Permanent concrete foundation (crawlspace, basement, or engineered slab) must be fully cured and certified before delivery day.</li>
  <li><strong>Crane Set Zone:</strong> An unobstructed level zone of at least 30x40 feet is required for mobile crane placement and module offloading.</li>
</ul>

<h3>3. Delivery Inspection & Sign-off</h3>
<p>A certified project manager or homeowner must be present during delivery and crane setting to perform the initial arrival walkthrough and sign the delivery verification bill of lading.</p>`,
    status: "PUBLISHED",
    seoTitle: "Shipping & Delivery Policy | ModularHome.com",
    metaDescription: "Read the ModularHome.com shipping and delivery guidelines for nationwide modular home freight and crane installation.",
  },
  {
    id: "page-accessibility",
    title: "Accessibility Statement",
    slug: "accessibility",
    subtitle: "Our commitment to digital accessibility for all home buyers and visitors",
    content: `<h2>Accessibility Statement</h2>
<p>ModularHome.com is dedicated to ensuring digital accessibility for people with disabilities. We continuously enhance the user experience for everyone and apply the relevant accessibility standards to our website and web applications.</p>

<h3>Conformance Status</h3>
<p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. ModularHome.com strives to conform with <strong>WCAG 2.1 Level AA</strong> standards.</p>

<h3>Key Accessibility Features</h3>
<ul>
  <li><strong>High Color Contrast:</strong> Designed with clean typography and high contrast ratios for readability.</li>
  <li><strong>Keyboard Navigation:</strong> Full keyboard navigability across search filters, mega menus, and checkout wizards.</li>
  <li><strong>Alt Text & ARIA Labels:</strong> Meaningful alternative text on architectural imagery and descriptive ARIA attributes for screen readers.</li>
  <li><strong>Responsive Scalability:</strong> Seamless zoom and font enlargement without losing page layout or content clarity.</li>
</ul>

<h3>Feedback & Assistance</h3>
<p>We welcome your feedback on the accessibility of ModularHome.com. If you encounter accessibility barriers, please contact our support team at <strong>accessibility@modularhome.com</strong> or call <strong>+1 (812) 595-4033</strong>. We will work with you to provide the information or service you require through an accessible communication method.</p>`,
    status: "PUBLISHED",
    seoTitle: "Accessibility Statement | ModularHome.com",
    metaDescription: "ModularHome.com is committed to WCAG 2.1 Level AA accessibility. Learn about our accessibility standards and support.",
  },
  {
    id: "page-pricing",
    title: "Pricing & Packages",
    slug: "pricing",
    subtitle: "Transparent, itemized modular home pricing, shell kits, and turnkey build packages",
    content: `<h2>Transparent Modular Home Pricing</h2>
<p>At ModularHome.com, we believe you deserve straightforward pricing without hidden contractor markups. Because modular homes are built in climate-controlled factories with zero material waste, you save an average of 15% to 25% compared to traditional stick-built construction.</p>

<h3>Package Comparison</h3>
<table style="width:100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 2rem;">
  <thead>
    <tr style="background-color: #f3f4f6; text-align: left;">
      <th style="padding: 12px; border: 1px solid #e5e7eb;">Package Level</th>
      <th style="padding: 12px; border: 1px solid #e5e7eb;">Est. Price / Sq. Ft.</th>
      <th style="padding: 12px; border: 1px solid #e5e7eb;">What's Included</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Structural Shell Kit</strong></td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">$65 – $95 / sq.ft</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">Engineered steel frame, exterior sheathing, roof trusses, standing seam metal roof, and stamped plans.</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Dry-In Lockup Package</strong></td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">$110 – $155 / sq.ft</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">Shell kit + Low-E windows, exterior doors, weather barrier wrap, and rough-in plumbing & electrical chases.</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Turnkey Move-In Ready</strong></td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">$165 – $260 / sq.ft</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">Fully finished interior, custom cabinetry, quartz countertops, luxury vinyl plank, appliances, HVAC, and crane installation.</td>
    </tr>
  </tbody>
</table>

<h3>What Influences Total Project Cost?</h3>
<ul>
  <li><strong>Site Preparation:</strong> Grading, tree clearing, driveway access, and soil engineering.</li>
  <li><strong>Foundation Type:</strong> Concrete slab, stem wall crawlspace, or full conditioned basement.</li>
  <li><strong>Utility Connections:</strong> Well & septic installation or municipal water, power, and sewer tie-ins.</li>
  <li><strong>Interior Finishes:</strong> Standard vs premium architectural upgrades, appliances, and fixtures.</li>
</ul>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Pricing & Packages | ModularHome.com",
    metaDescription: "Explore transparent modular home pricing, cost per square foot, shell kits, and turnkey move-in ready packages.",
    sections: [
      {
        id: "sec-pricing-trust",
        pageId: "page-pricing",
        type: "TRUST",
        title: "The Modular Cost Advantage",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: "sec-pricing-cta",
        pageId: "page-pricing",
        type: "CTA",
        title: "Get an Itemized Quote for Your Land",
        subtitle: "Use our interactive pricing wizard to get a customized estimate in under 2 minutes.",
        displayOrder: 2,
        isVisible: true,
      }
    ]
  },
  {
    id: "page-financing",
    title: "Modular Home Financing Guide",
    slug: "financing",
    subtitle: "Construction-to-permanent loans, preferred modular lenders, and low-down-payment options",
    content: `<h2>How Modular Home Financing Works</h2>
<p>Financing a factory-built modular home is virtually identical to financing a traditional custom site-built home. Because modular homes are built to local IBC building codes and permanently attached to real estate foundations, they qualify for standard residential mortgages and appraisal values.</p>

<h3>Popular Financing Programs</h3>
<ul>
  <li><strong>Construction-to-Permanent Loans (One-Time Close):</strong> The most popular modular loan option. Combines land purchase, factory manufacturing draws, and site work into a single loan with only one set of closing costs. Automatically converts into a permanent 15- or 30-year fixed mortgage upon move-in.</li>
  <li><strong>FHA Construction Loans:</strong> Low down payment options (as low as 3.5%) for eligible borrowers building their primary modular residence.</li>
  <li><strong>VA Construction Loans:</strong> 0% down payment financing for eligible military veterans and active-duty service members.</li>
  <li><strong>USDA Rural Development Loans:</strong> 100% financing for modular home construction in designated rural and suburban areas.</li>
  <li><strong>Land Equity Rollover:</strong> If you already own your build site free and clear, your land value can count directly toward your construction loan down payment.</li>
</ul>

<h3>Step-by-Step Financing Process</h3>
<ol>
  <li><strong>Pre-Qualification:</strong> Review your credit score and determine your total purchasing power.</li>
  <li><strong>Model & Plan Selection:</strong> Choose your floor plan and receive an itemized manufacturing quote from ModularHome.com.</li>
  <li><strong>Lender Underwriting & Appraisal:</strong> Your lender orders an appraisal based on your blueprints and comparable modular homes in your county.</li>
  <li><strong>Construction Draws:</strong> The lender releases milestone disbursements as the factory completes framing, roofing, and delivery.</li>
  <li><strong>Permanent Conversion:</strong> Final walkthrough is completed, and your loan converts to your fixed monthly mortgage.</li>
</ol>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Modular Home Financing & Construction Loans | ModularHome.com",
    metaDescription: "Learn how to finance your modular home with construction-to-permanent loans, FHA/VA options, and preferred lenders.",
    sections: [
      {
        id: "sec-financing-trust",
        pageId: "page-financing",
        type: "TRUST",
        title: "Trusted by National Lenders",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: "sec-financing-cta",
        pageId: "page-financing",
        type: "CTA",
        title: "Connect with a Modular Lending Specialist",
        subtitle: "Speak with our network of approved construction loan officers for pre-qualification.",
        displayOrder: 2,
        isVisible: true,
      }
    ]
  },
  {
    id: "page-delivery",
    title: "Delivery & Installation",
    slug: "delivery",
    subtitle: "From factory transport to crane set day: How your precision modular home is installed",
    content: `<h2>The Modular Delivery & Installation Journey</h2>
<p>Modular home construction is up to 50% faster than traditional building because site preparation and factory manufacturing occur simultaneously. While your foundation is being poured and cured, your home is engineered in our climate-controlled facility.</p>

<h3>The 4-Stage Installation Process</h3>
<div style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <h4>1. Site Foundation & Utility Pre-Work</h4>
  <p>Your local general contractor or foundation specialist pours the engineered concrete slab, crawlspace, or basement according to our certified anchor bolt plans. Plumbing and electrical utility trenches are brought to the foundation perimeter.</p>

  <h4>2. Nationwide Transport & Staging</h4>
  <p>Completed home modules are wrapped in protective weather-tight transport membranes and delivered to your site via specialized carriers accompanied by certified escort drivers.</p>

  <h4>3. Crane Set Day (The Big Reveal!)</h4>
  <p>A high-capacity mobile crane lifts each volumetric module from the trailer and sets it onto the permanent foundation with millimeter precision. Structural steel anchor plates are welded and bolted together. Most homes are fully dried-in and under roof in a single day!</p>

  <h4>4. Button-Up, Utility Hookup & Trim</h4>
  <p>Our set crew completes the module marry-wall connections, installs exterior ridge caps and siding seams, connects plumbing and electrical runs, and conducts final cosmetic touchups.</p>
</div>

<h3>Site Access Checklist</h3>
<ul>
  <li>Minimum 14-foot vertical clearance for delivery trailers.</li>
  <li>All-weather gravel or paved access road capable of supporting 60,000+ lb trucks.</li>
  <li>Permits obtained for crane staging on local roadways if required by your municipality.</li>
</ul>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Modular Home Delivery & Installation Guide | ModularHome.com",
    metaDescription: "Discover how modular homes are shipped nationwide, crane-set onto foundations in 1 day, and finished for move-in.",
    sections: [
      {
        id: "sec-delivery-how",
        pageId: "page-delivery",
        type: "HOW_IT_WORKS",
        title: "Precision Modular Installation",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: "sec-delivery-cta",
        pageId: "page-delivery",
        type: "CTA",
        title: "Check Delivery Availability in Your ZIP Code",
        subtitle: "Our logistics team verifies delivery route feasibility and local set crew availability nationwide.",
        displayOrder: 2,
        isVisible: true,
      }
    ]
  },
  {
    id: "page-how-it-works",
    title: "How It Works: The Modular Building Process",
    slug: "how-it-works",
    subtitle: "5 simple steps from selecting your floor plan to moving into your custom modular home",
    content: `<h2>A Smarter, Faster Way to Build</h2>
<p>Building a custom home should be exciting, not stressful. ModularHome.com transforms the traditional construction nightmare into a streamlined 5-step process backed by steel engineering and precision factory automation.</p>

<h3>The 5-Step Process</h3>
<div style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <h4>Step 1: Explore & Customize Your Design</h4>
  <p>Browse our catalog of 2026 modular homes, barndominiums, house kits, and cabins. Customize floor plans, bedroom layouts, finishes, and exterior architectural aesthetics to match your land and lifestyle.</p>

  <h4>Step 2: Instant Itemized Quotation & Engineering</h4>
  <p>Receive a clear, transparent price breakdown including factory manufacturing, freight logistics, and optional turnkey installation packages. Our architectural team produces state-stamped engineering plans for your local permit office.</p>

  <h4>Step 3: Permitting & Simultaneous Site Preparation</h4>
  <p>While your local building department approves permits and your foundation is excavated and poured, your home begins assembly inside our state-of-the-art facility. No weather delays, no mold exposure, and zero material damage.</p>

  <h4>Step 4: Precision Factory Manufacturing (4–8 Weeks)</h4>
  <p>Skilled craftsmen and laser-guided framing tools assemble cold-formed steel frames, electrical wiring, plumbing, insulation, drywall, cabinetry, and fixtures in a climate-controlled environment with rigorous 120-point quality inspections.</p>

  <h4>Step 5: Rapid Delivery, Crane Assembly & Move-In</h4>
  <p>Your modules arrive on-site and are crane-lifted onto your foundation. The button-up crew seals marriage lines, connects utilities, and finishes trim work. Receive your keys in a fraction of the time of standard stick-building!</p>
</div>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "How It Works: Modular Home Building Process | ModularHome.com",
    metaDescription: "Learn how the 5-step modular home building process works: from design selection and engineering to rapid factory build and move-in.",
    sections: [
      {
        id: "sec-how-works-steps",
        pageId: "page-how-it-works",
        type: "HOW_IT_WORKS",
        title: "The 5-Stage Construction Timeline",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: "sec-how-works-trust",
        pageId: "page-how-it-works",
        type: "TRUST",
        title: "Engineered to Higher Standards",
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: "sec-how-works-cta",
        pageId: "page-how-it-works",
        type: "CTA",
        title: "Ready to Start Your Build?",
        subtitle: "Speak with a dedicated housing consultant today or start designing your home online.",
        displayOrder: 3,
        isVisible: true,
      }
    ]
  },
  {
    id: "page-faqs",
    title: "Frequently Asked Questions (FAQs)",
    slug: "faqs",
    subtitle: "Answers to top questions about modular home building, costs, customization, and permits",
    content: `<h2>Frequently Asked Questions</h2>
<p>Have questions about modular and prefab construction? Below are answers to the most common questions we receive from home buyers across the United States.</p>

<h3>General & Construction FAQs</h3>
<div style="margin-top: 1.5rem; margin-bottom: 2rem;">
  <h4>Are modular homes the same as manufactured or mobile homes?</h4>
  <p><strong>No.</strong> Modular homes are built to the exact same local state and International Residential Codes (IRC/IBC) as custom site-built houses. They are permanently attached to concrete foundations and appreciate in value identically to stick-built homes. Mobile/manufactured homes are built to federal HUD code on non-removable steel chassis.</p>

  <h4>How long does the entire modular building process take?</h4>
  <p>From initial contract and permitting to final key handover, modular homes typically take <strong>3 to 6 months</strong>—compared to 10 to 16 months for traditional stick-built homes.</p>

  <h4>Can I customize the floor plan and interior finishes?</h4>
  <p><strong>Yes!</strong> Every plan in our catalog can be customized. You can move interior walls, add bedrooms, expand porches, upgrade to vaulted ceilings, and select custom siding, flooring, and kitchen finishes.</p>

  <h4>How do modular homes handle extreme weather and high winds?</h4>
  <p>Because modular homes must be built to withstand highway transportation and crane lifting, they are structurally stronger than stick-built homes. Our steel-framed modular models are rated for hurricane-force winds up to 150 MPH and extreme snow loads up to 50 PSF.</p>

  <h4>Who handles local building permits?</h4>
  <p>ModularHome.com provides full state-stamped architectural and structural engineering blueprint packages for your local building department. Your local general contractor or our turnkey build partner will submit these plans to your county permitting office.</p>
</div>`,
    status: "PUBLISHED",
    featuredImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80",
    seoTitle: "Frequently Asked Questions (FAQs) | ModularHome.com",
    metaDescription: "Find answers to top questions about modular homes vs manufactured homes, construction timelines, costs, and customization.",
    sections: [
      {
        id: "sec-faqs-trust",
        pageId: "page-faqs",
        type: "TRUST",
        title: "Clear Answers. No Surprises.",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: "sec-faqs-cta",
        pageId: "page-faqs",
        type: "CTA",
        title: "Still Have Questions?",
        subtitle: "Our modular building specialists are available to answer your specific project questions.",
        displayOrder: 2,
        isVisible: true,
      }
    ]
  }
];

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

export function readPagesFromStore(): CmsPage[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(PAGES_FILE)) {
      fs.writeFileSync(PAGES_FILE, JSON.stringify(SEED_PAGES, null, 2), "utf-8");
      return SEED_PAGES;
    }
    const data = fs.readFileSync(PAGES_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(PAGES_FILE, JSON.stringify(SEED_PAGES, null, 2), "utf-8");
      return SEED_PAGES;
    }
    
    // Ensure all seed pages exist in parsed so no critical policy/guide page is missing
    const existingSlugs = new Set(parsed.map((p: any) => (p.slug || "").toLowerCase()));
    let added = false;
    for (const seed of SEED_PAGES) {
      if (!existingSlugs.has(seed.slug.toLowerCase())) {
        parsed.push(seed);
        added = true;
      }
    }
    if (added) {
      fs.writeFileSync(PAGES_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }

    return parsed;
  } catch (error) {
    console.error("Error reading custom_pages.json:", error);
    return SEED_PAGES;
  }
}

export function writePagesToStore(pages: CmsPage[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_pages.json:", error);
  }
}

export function saveCustomPage(page: Partial<CmsPage> & { title: string; slug: string }): CmsPage {
  const pages = readPagesFromStore();
  const cleanSlug = page.slug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-");
  const existingIdx = pages.findIndex(
    (p) => (page.id && p.id === page.id) || p.slug.toLowerCase() === cleanSlug
  );

  const now = new Date().toISOString();
  const fullPage: CmsPage = {
    id: page.id || (existingIdx >= 0 ? pages[existingIdx].id : `page_${Date.now()}`),
    title: page.title,
    slug: cleanSlug,
    subtitle: page.subtitle || "",
    content: page.content || "",
    status: page.status || "PUBLISHED",
    featuredImage: page.featuredImage || "",
    imageAlt: page.imageAlt || `${page.title} banner`,
    seoTitle: page.seoTitle || `${page.title} | ModularHome.com`,
    metaDescription: page.metaDescription || page.subtitle || "",
    canonicalUrl: page.canonicalUrl || "",
    ogTitle: page.ogTitle || page.seoTitle || `${page.title} | ModularHome.com`,
    ogDescription: page.ogDescription || page.metaDescription || page.subtitle || "",
    ogImage: page.ogImage || page.featuredImage || "/newmodularlogo.png",
    robots: page.robots || "index, follow",
    publishedAt: page.publishedAt || (existingIdx >= 0 ? pages[existingIdx].publishedAt : now),
    createdAt: page.createdAt || (existingIdx >= 0 ? pages[existingIdx].createdAt : now),
    updatedAt: now,
    sections: page.sections || (existingIdx >= 0 ? pages[existingIdx].sections : []),
  };

  if (existingIdx >= 0) {
    pages[existingIdx] = { ...pages[existingIdx], ...fullPage };
  } else {
    pages.unshift(fullPage);
  }

  writePagesToStore(pages);
  return fullPage;
}

export function deleteCustomPage(idOrSlug: string): boolean {
  if (!idOrSlug) return false;
  const clean = idOrSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const pages = readPagesFromStore();
  const filtered = pages.filter((p) => {
    const pId = (p.id || "").toLowerCase().trim();
    const pSlug = (p.slug || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    return pId !== clean && pSlug !== clean && p.id !== idOrSlug && p.slug !== idOrSlug;
  });

  if (filtered.length !== pages.length) {
    writePagesToStore(filtered);
    
    // Also delete associated sections
    const sections = readSectionsFromStore();
    const remainingSections = sections.filter((s) => {
      const sPageId = (s.pageId || "").toLowerCase().trim();
      return sPageId !== clean && sPageId !== `page-${clean}` && s.pageId !== idOrSlug;
    });
    if (remainingSections.length !== sections.length) {
      writeSectionsToStore(remainingSections);
    }
    
    return true;
  }
  return false;
}

export function getCustomPageBySlug(slug: string): CmsPage | null {
  const clean = slug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const pages = readPagesFromStore();
  let found = pages.find(
    (p) =>
      p.slug.toLowerCase() === clean ||
      p.id === clean ||
      p.slug.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "")
  );

  if (!found) {
    found = SEED_PAGES.find(
      (p) =>
        p.slug.toLowerCase() === clean ||
        p.id === clean ||
        p.slug.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "")
    );
  }

  if (!found) return null;

  // Attach sections from sections store or inline
  const sections = getPageSections(found.id || found.slug);
  found.sections = sections && sections.length > 0 ? sections : found.sections || [];

  return found;
}

export function readSectionsFromStore(): PageSection[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(SECTIONS_FILE)) {
      // Seed sections from initial pages if any
      const pages = readPagesFromStore();
      const initialSections: PageSection[] = [];
      for (const p of pages) {
        if (p.sections && Array.isArray(p.sections)) {
          for (const s of p.sections) {
            initialSections.push({
              ...s,
              pageId: s.pageId || p.id,
            });
          }
        }
      }
      fs.writeFileSync(SECTIONS_FILE, JSON.stringify(initialSections, null, 2), "utf-8");
      return initialSections;
    }
    const data = fs.readFileSync(SECTIONS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function writeSectionsToStore(sections: PageSection[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(SECTIONS_FILE, JSON.stringify(sections, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_sections.json:", error);
  }
}

export function getPageSections(pageIdOrSlug: string): PageSection[] {
  if (!pageIdOrSlug) return [];
  const cleanKey = String(pageIdOrSlug).toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const allSections = readSectionsFromStore();
  const pages = readPagesFromStore();

  const matchedPage = pages.find(
    (p) =>
      p.id?.toLowerCase() === cleanKey ||
      p.slug?.toLowerCase() === cleanKey ||
      p.slug?.replace(/[^a-z0-9]/g, "") === cleanKey.replace(/[^a-z0-9]/g, "")
  );

  const targetKeys = new Set<string>();
  targetKeys.add(cleanKey);
  if (matchedPage) {
    if (matchedPage.id) targetKeys.add(matchedPage.id.toLowerCase());
    if (matchedPage.slug) targetKeys.add(matchedPage.slug.toLowerCase());
  }

  // Find matching sections from sections store
  const matchedSections: PageSection[] = allSections.filter((s) => {
    if (!s.pageId) return false;
    const sPageId = String(s.pageId).toLowerCase();
    return targetKeys.has(sPageId);
  });

  // Also include any inline sections from matched page if not already in store
  if (matchedPage?.sections && Array.isArray(matchedPage.sections)) {
    const existingIds = new Set(matchedSections.map((s) => s.id));
    for (const inSec of matchedPage.sections) {
      if (!existingIds.has(inSec.id)) {
        matchedSections.push({ ...inSec, pageId: matchedPage.id });
        existingIds.add(inSec.id);
      }
    }
  }

  return matchedSections.map((s, idx) => ({
    ...s,
    displayOrder: s.displayOrder !== undefined ? s.displayOrder : idx + 1,
    order: s.displayOrder !== undefined ? s.displayOrder : idx + 1,
    isVisible: s.isVisible !== false,
  })).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

export function getPageSectionCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  const pages = readPagesFromStore();
  const allSections = readSectionsFromStore();

  for (const p of pages) {
    const pageId = p.id;
    const slug = p.slug;
    const targetKeys = new Set<string>();
    if (pageId) targetKeys.add(pageId.toLowerCase());
    if (slug) targetKeys.add(slug.toLowerCase());

    const inStoreCount = allSections.filter(
      (s) => s.pageId && targetKeys.has(String(s.pageId).toLowerCase())
    ).length;

    const inPageCount = p.sections && Array.isArray(p.sections) ? p.sections.length : 0;
    const count = Math.max(inStoreCount, inPageCount);

    if (pageId) counts[pageId] = count;
    if (slug) counts[slug] = count;
  }

  return counts;
}

export function saveSection(section: Partial<PageSection> & { pageId: string; type: string }): PageSection {
  const sections = readSectionsFromStore();
  const now = new Date().toISOString();
  
  const existingIdx = sections.findIndex((s) => section.id && s.id === section.id);
  
  const newSection: PageSection = {
    id: section.id || `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    pageId: section.pageId,
    type: section.type.toUpperCase(),
    title: section.title || "",
    subtitle: section.subtitle || "",
    content: typeof section.content === "object" ? JSON.stringify(section.content) : section.content || "",
    displayOrder: section.displayOrder ?? (existingIdx >= 0 ? sections[existingIdx].displayOrder : sections.length + 1),
    isVisible: section.isVisible !== false,
  };

  if (existingIdx >= 0) {
    sections[existingIdx] = { ...sections[existingIdx], ...newSection };
  } else {
    sections.push(newSection);
  }

  writeSectionsToStore(sections);

  // Also sync with page in custom_pages.json if applicable
  const pages = readPagesFromStore();
  const targetKeys = new Set([section.pageId.toLowerCase()]);
  const pageIdx = pages.findIndex(
    (p) => (p.id && targetKeys.has(p.id.toLowerCase())) || (p.slug && targetKeys.has(p.slug.toLowerCase()))
  );

  if (pageIdx >= 0) {
    const pageSections = pages[pageIdx].sections || [];
    const inIdx = pageSections.findIndex((s) => s.id === newSection.id);
    if (inIdx >= 0) {
      pageSections[inIdx] = newSection;
    } else {
      pageSections.push(newSection);
    }
    pages[pageIdx].sections = pageSections;
    pages[pageIdx].updatedAt = now;
    writePagesToStore(pages);
  }

  return newSection;
}

export function updateSection(id: string, updates: Partial<PageSection>): PageSection | null {
  const sections = readSectionsFromStore();
  const idx = sections.findIndex((s) => s.id === id);
  if (idx < 0) return null;

  const updated: PageSection = {
    ...sections[idx],
    ...updates,
    type: updates.type ? updates.type.toUpperCase() : sections[idx].type,
    content: typeof updates.content === "object" ? JSON.stringify(updates.content) : (updates.content !== undefined ? updates.content : sections[idx].content),
    isVisible: updates.isVisible !== undefined ? updates.isVisible : sections[idx].isVisible,
  };

  sections[idx] = updated;
  writeSectionsToStore(sections);

  // Sync to page
  if (updated.pageId) {
    const pages = readPagesFromStore();
    const pageIdx = pages.findIndex((p) => p.id === updated.pageId || p.slug === updated.pageId);
    if (pageIdx >= 0 && pages[pageIdx].sections) {
      const sIdx = pages[pageIdx].sections!.findIndex((s) => s.id === id);
      if (sIdx >= 0) {
        pages[pageIdx].sections![sIdx] = updated;
        writePagesToStore(pages);
      }
    }
  }

  return updated;
}

export function deleteSection(id: string): boolean {
  const sections = readSectionsFromStore();
  const filtered = sections.filter((s) => s.id !== id);
  if (filtered.length !== sections.length) {
    writeSectionsToStore(filtered);

    // Also remove from any inline page sections
    const pages = readPagesFromStore();
    let pagesChanged = false;
    for (const p of pages) {
      if (p.sections && Array.isArray(p.sections)) {
        const pFiltered = p.sections.filter((s) => s.id !== id);
        if (pFiltered.length !== p.sections.length) {
          p.sections = pFiltered;
          pagesChanged = true;
        }
      }
    }
    if (pagesChanged) {
      writePagesToStore(pages);
    }

    return true;
  }
  return false;
}

export function reorderSections(items: { id: string; order: number }[]): boolean {
  const sections = readSectionsFromStore();
  const orderMap = new Map(items.map((it) => [it.id, it.order]));

  let changed = false;
  for (const s of sections) {
    if (orderMap.has(s.id)) {
      s.displayOrder = orderMap.get(s.id)!;
      changed = true;
    }
  }

  if (changed) {
    sections.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    writeSectionsToStore(sections);
    return true;
  }
  return false;
}

export function toggleSectionVisibility(id: string, isVisible: boolean): boolean {
  const sections = readSectionsFromStore();
  const target = sections.find((s) => s.id === id);
  if (target) {
    target.isVisible = isVisible;
    writeSectionsToStore(sections);

    // Sync to page
    if (target.pageId) {
      const pages = readPagesFromStore();
      const pageIdx = pages.findIndex((p) => p.id === target.pageId || p.slug === target.pageId);
      if (pageIdx >= 0 && pages[pageIdx].sections) {
        const s = pages[pageIdx].sections!.find((sec) => sec.id === id);
        if (s) {
          s.isVisible = isVisible;
          writePagesToStore(pages);
        }
      }
    }

    return true;
  }
  return false;
}
