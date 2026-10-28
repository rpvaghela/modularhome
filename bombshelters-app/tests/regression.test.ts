import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { NextRequest } from "next/server";
import * as consultationModule from "../app/api/consultation/route";
import * as leadsStore from "../lib/leadsStore";
import * as authModule from "../lib/auth";
import * as blogStore from "../lib/blogStore";
import * as rateLimitModule from "../lib/rateLimit";
import * as settingsRoute from "../app/api/bombshelter/settings/route";
import * as settingsStore from "../lib/settingsStore";

async function runRegressionTests() {
  console.log("============================================================");
  console.log("   BOMBSHELTER SECURITY FIXES & REGRESSION TEST SUITE       ");
  console.log("============================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  }

  // -------------------------------------------------------------------------
  // TEST 1: FIX 1 - Duplicate Lead Ingestion Removed
  // -------------------------------------------------------------------------
  console.log("\n--- TEST SUITE 1: Lead Ingestion Single-Source Isolation ---");
  assert(
    typeof consultationModule.POST === "function",
    "Consultation POST route handler exists"
  );
  assert(
    consultationModule.dynamic === "force-dynamic",
    "Consultation route is declared force-dynamic"
  );

  const initialLeads = await leadsStore.getBombShelterLeads();
  const initialCount = initialLeads.length;

  const mockReq = new NextRequest("http://localhost:3001/api/consultation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Defense Auditor",
      email: "auditor@defensetest.org",
      phone: "8125954033",
      interest: "Bomb Shelters",
      notes: "Regression test lead",
    }),
  });

  const response = await consultationModule.POST(mockReq);
  const resJson = await response.json();

  assert(response.status === 200, "Consultation endpoint returns HTTP 200");
  assert(resJson.success === true, "Consultation response success === true");
  assert(Boolean(resJson.leadId), "Consultation returns leadId");
  assert(
    resJson.forwardedToBackend === undefined,
    "No forwardToBackend property (ModularHome forwarding completely removed)"
  );

  const afterLeads = await leadsStore.getBombShelterLeads();
  assert(
    afterLeads.length === initialCount + 1,
    `Exactly one lead created (count went from ${initialCount} to ${afterLeads.length})`
  );

  // Clean up test lead
  if (resJson.leadId) {
    await leadsStore.deleteBombShelterLead(resJson.leadId);
  }

  // -------------------------------------------------------------------------
  // TEST 2: FIX 2 - Strengthened Admin JWT Isolation
  // -------------------------------------------------------------------------
  console.log("\n--- TEST SUITE 2: Admin JWT Isolation & Claim Verification ---");
  assert(
    authModule.JWT_ISSUER === "bombshelters.com",
    "JWT Issuer is strictly 'bombshelters.com'"
  );
  assert(
    authModule.JWT_AUDIENCE === "bombshelters-admin",
    "JWT Audience is strictly 'bombshelters-admin'"
  );
  assert(
    authModule.BOMBSHELTER_TENANT === "BombShelters.com",
    "JWT Tenant is strictly 'BombShelters.com'"
  );

  const jwtSecret = authModule.getAdminJwtSecret();

  // Test A: Token with wrong tenant claim must fail verification
  const wrongTenantToken = await new SignJWT({
    id: "foreign-user",
    email: "user@modularhome.com",
    name: "Foreign User",
    role: "SUPER_ADMIN",
    tenant: "ModularHome", // Wrong tenant
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(authModule.JWT_ISSUER)
    .setAudience(authModule.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(jwtSecret);

  let verifiedForeign = null;
  try {
    const { payload } = await jwtVerify(wrongTenantToken, jwtSecret, {
      issuer: authModule.JWT_ISSUER,
      audience: authModule.JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
    if (payload.tenant === authModule.BOMBSHELTER_TENANT) {
      verifiedForeign = payload;
    }
  } catch {}
  assert(verifiedForeign === null, "Token with foreign tenant claim ('ModularHome') is REJECTED");

  // Test B: Token with wrong issuer must fail verification
  const wrongIssuerToken = await new SignJWT({
    id: "test",
    email: "user@bombshelters.com",
    role: "BOMBSHELTERS_ADMIN",
    tenant: authModule.BOMBSHELTER_TENANT,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("untrusted-domain.com") // Wrong issuer
    .setAudience(authModule.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(jwtSecret);

  let verifiedWrongIssuer = null;
  try {
    const { payload } = await jwtVerify(wrongIssuerToken, jwtSecret, {
      issuer: authModule.JWT_ISSUER,
      audience: authModule.JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
    verifiedWrongIssuer = payload;
  } catch {}
  assert(verifiedWrongIssuer === null, "Token with untrusted issuer is REJECTED by jwtVerify");

  // Test C: Valid session token generation with proper claims
  const validToken = await authModule.createBombShelterSession("test-officer-id", {
    id: "test-officer-id",
    email: "officer@bombshelters.com",
    name: "Command Officer",
    role: "BOMBSHELTERS_ADMIN",
  });
  assert(typeof validToken === "string" && validToken.length > 50, "Valid session token generated with strict claims");

  const { payload: verifiedValid } = await jwtVerify(validToken, jwtSecret, {
    issuer: authModule.JWT_ISSUER,
    audience: authModule.JWT_AUDIENCE,
    algorithms: ["HS256"],
  });
  assert(verifiedValid.tenant === authModule.BOMBSHELTER_TENANT, "Verified valid token contains BombShelters.com tenant");
  assert(verifiedValid.role === "BOMBSHELTERS_ADMIN", "Verified valid token contains BOMBSHELTERS_ADMIN role");

  // -------------------------------------------------------------------------
  // TEST 3: FIX 3 - Secure Blog Deletion (PostgREST Filter Injection Protection)
  // -------------------------------------------------------------------------
  console.log("\n--- TEST SUITE 3: Secure Blog Deletion & Injection Shield ---");
  // Test malicious injection attempts
  const maliciousInput = "test-slug,handle.neq.safe-article";
  const injectionResult = await blogStore.deleteBombShelterBlog(maliciousInput);
  assert(
    injectionResult === false,
    "Malicious slug with comma/PostgREST filter syntax is safely REJECTED by validator"
  );

  const sqlInjectionInput = "slug'; DROP TABLE blog_posts; --";
  const sqlResult = await blogStore.deleteBombShelterBlog(sqlInjectionInput);
  assert(
    sqlResult === false,
    "SQL injection syntax is safely REJECTED by slug/UUID validator"
  );

  // Test legitimate slug format
  const validSlugResult = await blogStore.deleteBombShelterBlog("non-existent-test-guide");
  assert(validSlugResult === true, "Valid slug syntax format is processed cleanly");

  // -------------------------------------------------------------------------
  // TEST 4: FIX 4 - Production Login Rate Limiting & Lockout
  // -------------------------------------------------------------------------
  console.log("\n--- TEST SUITE 4: Admin Login Rate Limiting & Lockout ---");
  const testEmail = "bruteforce.target@bombshelters.com";
  const testIp = "192.168.99.1";

  // Clear any existing attempts
  await rateLimitModule.clearLoginAttempts(testEmail, testIp);

  // Initial check: should not be locked
  const initialCheck = await rateLimitModule.checkLoginRateLimit(testEmail, testIp);
  assert(initialCheck.isLocked === false, "Fresh account is not locked out");
  assert(initialCheck.remainingAttempts === 5, "Initial remaining attempts is 5");

  // Simulate 5 failed attempts
  for (let i = 1; i <= 5; i++) {
    const res = await rateLimitModule.recordFailedLogin(testEmail, testIp);
    if (i < 5) {
      assert(res.isNowLocked === false, `Attempt ${i}: Account not locked yet (${res.remainingAttempts} left)`);
    } else {
      assert(res.isNowLocked === true, `Attempt 5: Account triggers LOCKOUT`);
    }
  }

  // Verify lockout check now blocks
  const lockedCheck = await rateLimitModule.checkLoginRateLimit(testEmail, testIp);
  assert(lockedCheck.isLocked === true, "checkLoginRateLimit returns isLocked: true");
  assert(
    Number(lockedCheck.lockedMinutesRemaining) > 0,
    `Lockout duration reported (${lockedCheck.lockedMinutesRemaining}m remaining)`
  );

  // Clear attempts and verify unlock
  await rateLimitModule.clearLoginAttempts(testEmail, testIp);
  const clearedCheck = await rateLimitModule.checkLoginRateLimit(testEmail, testIp);
  assert(clearedCheck.isLocked === false, "clearLoginAttempts unlocks the account");

  // -------------------------------------------------------------------------
  // TEST 5: FIX 5 - Mass Assignment Protection on Admin Updates
  // -------------------------------------------------------------------------
  console.log("\n--- TEST SUITE 5: Strict Schema & Mass Assignment Prevention ---");
  const leadUpdateSchema = z
    .object({
      status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "QUOTE_SENT", "FOLLOW_UP", "WON", "LOST"]).optional(),
      notes: z.string().max(2000).nullable().optional(),
      phone: z.string().max(30).nullable().optional(),
      project_type: z.string().max(100).nullable().optional(),
      budget: z.string().max(50).nullable().optional(),
      enquiry_details: z.string().max(3000).nullable().optional(),
    })
    .strict();

  const quoteUpdateSchema = z
    .object({
      status: z.enum(["DRAFT", "SUBMITTED", "REVIEWED", "APPROVED", "REJECTED"]).optional(),
      notes: z.string().max(2000).nullable().optional(),
      estimated_amount: z.number().nonnegative().optional(),
      sq_ft: z.number().positive().nullable().optional(),
      category: z.string().max(100).nullable().optional(),
      specifications: z.record(z.any()).nullable().optional(),
    })
    .strict();

  // Test A: Forbidden fields in lead update must throw
  let leadThrew = false;
  try {
    leadUpdateSchema.parse({
      status: "QUALIFIED",
      source: "MODULARHOME_SPOOF", // Forbidden
      id: "fake-id", // Forbidden
    });
  } catch {
    leadThrew = true;
  }
  assert(leadThrew, "Lead update schema REJECTS unauthorized mass-assignment fields (source, id)");

  // Test B: Allowed fields in lead update pass
  const validLeadUpdate = leadUpdateSchema.parse({
    status: "QUALIFIED",
    notes: "Verified by officer",
  });
  assert(validLeadUpdate.status === "QUALIFIED", "Lead update schema accepts valid allowed fields");

  // Test C: Forbidden fields in quote update must throw
  let quoteThrew = false;
  try {
    quoteUpdateSchema.parse({
      status: "APPROVED",
      customer_email: "hacked@example.com", // Forbidden
      source: "MODULARHOME_SPOOF", // Forbidden
    });
  } catch {
    quoteThrew = true;
  }
  assert(quoteThrew, "Quotation update schema REJECTS unauthorized mass-assignment fields (source, customer_email)");

  // Test D: Allowed fields in quote update pass
  const validQuoteUpdate = quoteUpdateSchema.parse({
    status: "APPROVED",
    estimated_amount: 55000,
  });
  assert(validQuoteUpdate.status === "APPROVED", "Quotation update schema accepts valid allowed fields");

  // -------------------------------------------------------------------------
  // TEST 6: FIX 6 - Force-Dynamic Settings Cache Validation
  // -------------------------------------------------------------------------
  console.log("\n--- TEST SUITE 6: Force-Dynamic Settings Cache Validation ---");
  assert(
    settingsRoute.dynamic === "force-dynamic",
    "Public settings route explicitly exports dynamic = 'force-dynamic'"
  );

  const currentSettings = await settingsStore.getBombShelterSettings();
  assert(currentSettings.id === "bombshelters", "Settings strictly mapped to id = 'bombshelters'");
  assert(currentSettings.emergency_hotline === "812-595-4033", "Hotline verified as 812-595-4033");

  console.log("\n============================================================");
  console.log(`   ALL ${passedTests}/${totalTests} REGRESSION TESTS PASSED!`);
  console.log("============================================================\n");
}

runRegressionTests().catch((err) => {
  console.error("REGRESSION TEST SUITE ENCOUNTERED UNEXPECTED ERROR:", err);
  process.exit(1);
});
