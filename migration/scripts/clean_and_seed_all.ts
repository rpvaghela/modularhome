import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_ARTICLES = [
  {
    id: "art-1",
    slug: "modular-vs-traditional-homes",
    title: "Modular Homes vs. Traditional Stick-Built: Cost, Timeline & Quality Breakdown",
    category: "Modular Basics",
    readTime: "7 min read",
    author: "ModularHome Engineering Team",
    excerpt: "Discover why precision-engineered steel modular homes are replacing traditional stick-built construction with 50% faster timelines, tighter tolerances, and up to 30% cost savings.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    date: "Jan 15, 2026",
    published_at: "2026-01-15T09:00:00.000Z",
    status: "PUBLISHED",
    tags: ["Modular Homes", "Construction Cost", "Stick-Built vs Modular", "Steel Framing"],
    keyTakeaways: [
      "Modular homes are built indoors under climate-controlled conditions, eliminating weather delays and material warping.",
      "Commercial-grade light-gauge steel framing offers superior structural integrity against 150 MPH winds and seismic activity.",
      "Average modular build timelines are 3 to 6 months compared to 12 to 18 months for traditional stick builds.",
      "Turnkey cost savings range from 15% to 30% due to bulk factory purchasing and standardized manufacturing."
    ],
    content: [
      "When embarking on building a new residential home, one of the most critical decisions is selecting the construction methodology. Traditional site-built ('stick-built') construction has dominated American homebuilding for over a century, but factory-built modular homes are rapidly transforming the industry.",
      "Unlike mobile or manufactured homes (HUD-code), modular homes are built to the exact same International Residential Code (IRC) and local state building codes as traditional stick-built houses. In fact, because modular modules must endure highway transit and crane placement, their structural framing is often 20% to 30% stronger than site-framed structures.",
      "By utilizing precision roll-formed light-gauge galvanized steel framing, every stud, joist, and truss is manufactured to millimeter tolerances without the warping, crowning, or rot vulnerability inherent in wood studs.",
      "Financial savings occur not just in materials and labor efficiency, but also in loan interest carrying costs: reducing construction duration from 14 months to 4 months saves thousands in construction loan interest."
    ]
  },
  {
    id: "art-2",
    slug: "how-steel-modular-homes-are-built",
    title: "Inside the Factory: How Light-Gauge Precision Steel Modular Homes are Built",
    category: "Timeline & Process",
    readTime: "8 min read",
    author: "Chief Architect Marcus Vance",
    excerpt: "Step inside our state-of-the-art manufacturing facility to see how BIM modeling, automated roll-forming, and robotic assembly deliver structural perfection.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    date: "Feb 02, 2026",
    published_at: "2026-02-02T10:30:00.000Z",
    status: "PUBLISHED",
    tags: ["Factory Tour", "Light Gauge Steel", "BIM Modeling", "Prefab Architecture"],
    keyTakeaways: [
      "Building Information Modeling (BIM) generates 3D digital twins before a single piece of steel is cut.",
      "Automated CNC roll-forming machines print structural steel studs with pre-punched service holes for plumbing and wiring.",
      "Structural Insulated Panels (SIPs) provide an airtight, thermal-bridge-free building envelope with R-30+ insulation ratings.",
      "Factory quality control inspections verify electrical, plumbing, and structural engineering before modules ship."
    ],
    content: [
      "Modular home construction represents the convergence of advanced software engineering and industrial robotics with modern architecture.",
      "Phase 1 begins in our digital design center, where architectural drafts are converted into 3D Building Information Models (BIM). Every conduit path, electrical junction, and mechanical duct is collision-checked before fabrication.",
      "In Phase 2, structural light-gauge steel coils (G90 galvanized) are fed into automated CNC roll-formers. The machines cut, dimple, and punch service knockouts with sub-millimeter precision.",
      "Phase 3 integrates floor decks, walls, and roof trusses into monolithic volumetric modules. High-performance closed-cell insulation and thermal breaks ensure energy efficiency unmatched by conventional framing."
    ]
  },
  {
    id: "art-3",
    slug: "financing-modular-home-guide",
    title: "Complete Guide to Modular Home Financing, Construction Loans & Land Costs",
    category: "Financing",
    readTime: "6 min read",
    author: "Elena Rostova, Mortgage Specialist",
    excerpt: "Everything you need to know about securing a construction-to-permanent loan, land equity rollover, and FHA/VA modular financing.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    date: "Feb 18, 2026",
    published_at: "2026-02-18T14:15:00.000Z",
    status: "PUBLISHED",
    tags: ["Financing", "Construction Loans", "Mortgage", "Land Equity"],
    keyTakeaways: [
      "Modular homes qualify for the exact same conventional, FHA, VA, and USDA mortgages as stick-built homes.",
      "A Single-Close Construction-to-Permanent loan rolls land purchase, factory module build, and site completion into one closing.",
      "If you already own land, your land equity can count directly towards the down payment requirement.",
      "Modular homes appraise and appreciate at identical rates to custom architect-designed site-built homes."
    ],
    content: [
      "One common myth is that modular homes are difficult to finance. In reality, because modular homes are permanent real property permanently affixed to a foundation, all major mortgage lenders treat them identically to traditional homes.",
      "The most popular financing tool is the Construction-to-Permanent Loan (often called an 'All-in-One' or 'Single-Close' loan). With this loan, you pay only interest on funds disbursed during factory fabrication and site installation.",
      "Once the home receives its Certificate of Occupancy (CO), the construction loan automatically transitions into a standard 15-year or 30-year fixed-rate mortgage with no secondary closing fees.",
      "Our team provides verified floor plan packages, manufacturer spec sheets, and foundation engineering stamps that mortgage underwriters require for swift approval."
    ]
  },
  {
    id: "art-4",
    slug: "permits-zoning-modular-homes",
    title: "Navigating Modular Home Permits, Foundation Specs & Local Zoning in 2026",
    category: "Land Preparation",
    readTime: "9 min read",
    author: "David Chen, Senior Permitting Consultant",
    excerpt: "A practical roadmap for soil testing, septic approvals, foundation engineering, and working with local municipal building departments.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    date: "Mar 01, 2026",
    published_at: "2026-03-01T11:00:00.000Z",
    status: "PUBLISHED",
    tags: ["Permits", "Zoning", "Foundations", "Building Codes"],
    keyTakeaways: [
      "State modular certification programs mean local building inspectors inspect the foundation and utility connections, not the closed walls.",
      "Modular homes can be installed on crawlspaces, full basements, monolithic concrete slabs, or helical pier foundations.",
      "Standard site preparation includes perc tests for septic, utility tie-in trenching, and crane pad clearance.",
      "Our engineering team supplies state-stamped architectural drawings ready for municipal submission."
    ],
    content: [
      "Securing building permits for a modular home is frequently faster than site-built homes because modular homes carry pre-approved state certification stamps.",
      "Under state industrialized building programs, state inspectors inspect plumbing, wiring, and framing inside the factory before sheetrock is applied. When modules arrive on site, local municipal inspectors focus on the foundation, site drainage, and utility hookups.",
      "Foundation design is customized to your property's topography and soil conditions. Whether you choose a daylight basement for extra square footage or an engineered monolithic slab, our structural team coordinates engineering loads.",
      "We recommend starting your site utility feasibility and perc test simultaneously with finalizing your floor plan selection to minimize overall project duration."
    ]
  },
  {
    id: "art-5",
    slug: "barndominium-steel-kit-guide",
    title: "The Ultimate Barndominium & Steel Building Kit Buyer's Guide",
    category: "Home Styles",
    readTime: "7 min read",
    author: "ModularHome Engineering Team",
    excerpt: "Explore the growing trend of modern steel barndominiums—combining open-concept living, massive workshop spaces, and unmatched structural durability.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    date: "Mar 10, 2026",
    published_at: "2026-03-10T16:00:00.000Z",
    status: "PUBLISHED",
    tags: ["Barndominiums", "Steel Kits", "Open Concept", "Workshop Homes"],
    keyTakeaways: [
      "Steel clear-span engineering eliminates the need for load-bearing interior walls, allowing 100% customizable floor layouts.",
      "Commercial-grade steel structures provide maximum resistance against termites, rot, fire, and heavy snow loads.",
      "Barndominiums allow integrated living quarters and garage/shop spaces under a single unified roofline.",
      "Steel house kits are delivered ready for rapid bolting with pre-welded clips and color-coded structural components."
    ],
    content: [
      "Barndominiums have evolved from rural metal buildings into luxury modern residences featuring high vaulted ceilings, expansive open floor plans, and industrial-chic aesthetics.",
      "Because steel frames utilize clear-span trusses, the entire interior square footage is free of load-bearing walls. This gives homeowners complete flexibility to place bedrooms, expansive chef kitchens, and double-height lofts anywhere.",
      "Steel building kits arrive with all columns, rafters, purlins, wall panels, and fasteners pre-cut and numbered for straightforward erection.",
      "Maintenance is virtually zero compared to wood siding: galvanized steel resists fading, chipping, rot, and pest infestations for 50+ years."
    ]
  },
  {
    id: "art-6",
    slug: "energy-efficiency-sip-panels",
    title: "Energy Efficiency & Insulation: How SIP Panels & Thermal Breaks Cut Utility Costs by 60%",
    category: "Design & Customization",
    readTime: "6 min read",
    author: "Sarah Jenkins, LEED AP",
    excerpt: "Learn how continuous insulation, thermal break engineering, and airtight building envelopes create net-zero-ready modular homes.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    date: "Mar 20, 2026",
    published_at: "2026-03-20T12:00:00.000Z",
    status: "PUBLISHED",
    tags: ["Energy Efficiency", "SIP Panels", "Thermal Envelope", "Net Zero"],
    keyTakeaways: [
      "Thermal bridge breaks prevent steel framing from conducting outside temperatures into interior living spaces.",
      "Closed-cell spray foam and graphite-infused EPS insulation create continuous R-30 wall and R-50 roof envelopes.",
      "Factory-installed triple-pane low-E windows and magnetic weather sealing drastically reduce HVAC loads.",
      "Modular precision ensures airtight blower door test ratings below 1.5 ACH50, qualifying for Energy Star and DOE Zero Energy Ready standards."
    ],
    content: [
      "Heating and cooling account for more than 50% of the average homeowner's monthly utility expenses. In traditional construction, thermal bridging across wood studs and irregular site caulking create energy loss.",
      "Our steel modular homes utilize exterior continuous thermal breaks and structural insulated panels that eliminate cold transfer through steel flanges.",
      "Because factory modules are assembled in dry indoor environments, insulation materials never suffer rain moisture degradation during installation.",
      "Every model is designed solar-ready, allowing homeowners to achieve net-zero electrical bills when paired with rooftop photovoltaic systems."
    ]
  }
];

async function cleanAndSeedAll() {
  console.log("Starting comprehensive cleanup and seed sync...");

  // 1. Clean junk products from Supabase
  console.log("Cleaning junk / non-home products from database...");
  const { data: allProds } = await supabase.from("products").select("id, handle, title, starting_price, product_type");
  
  const junkIds: string[] = [];
  if (allProds) {
    for (const p of allProds) {
      const text = `${p.title} ${p.handle} ${p.product_type || ""}`.toLowerCase();
      if (
        text.includes("greeting card") ||
        text.includes("candle") ||
        text.includes("jewelry") ||
        text.includes("cash money") ||
        text.includes("bath bomb") ||
        (Number(p.starting_price) < 500 && !text.includes("floor plan") && !text.includes("how-our-steel"))
      ) {
        junkIds.push(p.id);
      }
    }
  }

  if (junkIds.length > 0) {
    console.log(`Deleting ${junkIds.length} junk products...`);
    await supabase.from("product_collections").delete().in("product_id", junkIds);
    await supabase.from("product_media").delete().in("product_id", junkIds);
    await supabase.from("product_variants").delete().in("product_id", junkIds);
    await supabase.from("products").delete().in("id", junkIds);
    console.log("Junk products deleted successfully.");
  } else {
    console.log("No junk products found.");
  }

  // 2. Ensure Admin User in admin_users table
  console.log("Verifying admin_users table...");
  const defaultAdminEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@modularhome.com").toLowerCase().trim();
  const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin@26";
  const passwordHash = await bcrypt.hash(defaultAdminPassword, 10);

  const { data: existingAdmin } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("email", defaultAdminEmail)
    .maybeSingle();

  if (!existingAdmin) {
    console.log("Creating default super admin user in Supabase...");
    await supabase.from("admin_users").insert({
      email: defaultAdminEmail,
      password_hash: passwordHash,
      name: "Admin Superuser",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    });
  } else {
    console.log("Updating default super admin password and status...");
    await supabase
      .from("admin_users")
      .update({
        password_hash: passwordHash,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
      })
      .eq("email", defaultAdminEmail);
  }

  // 3. Seed Blog Posts / Articles in Supabase blog_posts table
  console.log("Seeding blog posts in Supabase...");
  for (const art of SEED_ARTICLES) {
    const { data: existingPost } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", art.slug)
      .maybeSingle();

    const postPayload = {
      title: art.title,
      slug: art.slug,
      category: art.category,
      author: art.author,
      excerpt: art.excerpt,
      content: Array.isArray(art.content) ? art.content.join("\n\n") : art.content,
      body_html: Array.isArray(art.content) ? art.content.map(p => `<p>${p}</p>`).join("") : `<p>${art.content}</p>`,
      featured_image: art.image,
      image_url: art.image,
      status: art.status,
      published_at: art.published_at,
      tags: art.tags,
      key_takeaways: art.keyTakeaways,
    };

    if (existingPost) {
      await supabase.from("blog_posts").update(postPayload).eq("id", existingPost.id);
    } else {
      await supabase.from("blog_posts").insert(postPayload);
    }
  }

  // 4. Save custom_blogs.json for local store fallback
  const customBlogsPath = path.join(process.cwd(), "src", "data", "custom_blogs.json");
  fs.writeFileSync(customBlogsPath, JSON.stringify(SEED_ARTICLES, null, 2), "utf-8");
  console.log("Saved local custom_blogs.json");

  // 5. Update src/data/resources.ts
  const resourcesTsPath = path.join(process.cwd(), "src", "data", "resources.ts");
  const resourcesTsContent = `export interface ResourceArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string[];
  image: string;
  date: string;
  author?: string;
  tags?: string[];
  keyTakeaways?: string[];
  embeddedVideoUrl?: string;
  seoTitle?: string;
  metaDescription?: string;
}

export const RESOURCE_CATEGORIES = [
  "All",
  "Modular Basics",
  "Comparison",
  "Pricing & Budget",
  "Timeline & Process",
  "Design & Customization",
  "Home Styles",
  "Financing",
  "Floor Plans",
  "Land Preparation",
  "Delivery & Setup",
] as const;

export const RESOURCE_ARTICLES: ResourceArticle[] = ${JSON.stringify(SEED_ARTICLES, null, 2)};
`;
  fs.writeFileSync(resourcesTsPath, resourcesTsContent, "utf-8");
  console.log("Updated src/data/resources.ts");

  // 6. Verify collections in Supabase
  console.log("Checking collections in Supabase...");
  const { data: cols, count: colCount } = await supabase.from("collections").select("*", { count: "exact" });
  console.log(`Found ${colCount} collections in Supabase.`);

  // 7. Verify floor plans in Supabase
  console.log("Checking floor plans in Supabase...");
  const { data: fps, count: fpCount } = await supabase.from("floor_plans").select("*", { count: "exact" });
  console.log(`Found ${fpCount} floor plans in Supabase.`);

  console.log("Database clean & seed completed successfully!");
}

cleanAndSeedAll().catch(console.error);
