import "dotenv/config";
import { query } from "../../src/lib/db";
import crypto from "crypto";

interface PageSeed {
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  featured_image: string;
  image_alt: string;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  status: "PUBLISHED" | "DRAFT";
}

const PUBLIC_PAGES_TO_SEED: PageSeed[] = [
  {
    slug: "home",
    title: "Precision Engineered Modular Homes",
    subtitle: "MODERN. AFFORDABLE. BUILT FOR LIFE.",
    content: "Explore precision steel modular homes, downloadable construction floor plans, and turnkey prefab models designed around your lifestyle, location and budget.",
    featured_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1900&q=85",
    image_alt: "Modern Modular Precision Engineered Home",
    seo_title: "Modern Modular Homes & Turnkey Prefab Housing | ModularHome.com",
    meta_description: "ModularHome.com offers precision engineered steel modular homes, customizable floor plans, and instant turnkey quotes nationwide.",
    canonical_url: "https://modularhome.com",
    og_title: "Modern Modular Homes & Turnkey Prefab Housing | ModularHome.com",
    og_description: "Explore precision steel modular homes, downloadable construction floor plans, and turnkey prefab models designed around your lifestyle.",
    og_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "about",
    title: "About ModularHome.com",
    subtitle: "Building A Better Way To Live — Factory Precision Meets Modern Architecture",
    content: "ModularHome.com is a leading marketplace for modular and prefabricated housing solutions, combining factory precision engineering with modern architectural design and transparent pricing.",
    featured_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    image_alt: "ModularHome Factory Assembly and Craftsmanship",
    seo_title: "About Us | ModularHome.com",
    meta_description: "Learn about ModularHome.com's manufacturing network, customizable floor plans, quality standards, and factory-built housing solutions.",
    canonical_url: "https://modularhome.com/about",
    og_title: "About ModularHome.com | Modern Housing Marketplace",
    og_description: "Learn about ModularHome.com's manufacturing network, customizable floor plans, and factory-built housing solutions.",
    og_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "contact",
    title: "Contact ModularHome.com",
    subtitle: "Connect with our certified project estimators and engineering specialists",
    content: "Have questions about floor plans, local zoning, modular construction timelines, or turnkey pricing? Our housing advisors are ready to help.",
    featured_image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Contact ModularHome Customer Support",
    seo_title: "Contact Our Team | ModularHome.com",
    meta_description: "Connect with ModularHome.com housing specialists, project estimators, and designers. Request a quote or schedule a design consultation.",
    canonical_url: "https://modularhome.com/contact",
    og_title: "Contact Our Team | ModularHome.com",
    og_description: "Connect with ModularHome.com housing specialists, project estimators, and designers.",
    og_image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "buildings",
    title: "Commercial & Residential Modular Buildings",
    subtitle: "Engineered steel modular buildings, duplexes, multi-family, and residential structures",
    content: "Browse our complete catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and commercial building solutions.",
    featured_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Commercial and Residential Modular Buildings",
    seo_title: "Commercial & Residential Homes | ModularHome.com",
    meta_description: "Explore our full catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and commercial building solutions.",
    canonical_url: "https://modularhome.com/buildings",
    og_title: "Commercial & Residential Homes | ModularHome.com",
    og_description: "Explore our full catalog of modular homes, prefabs, barndominiums, cabins, and commercial building solutions.",
    og_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "models",
    title: "Modular Home Models Catalog",
    subtitle: "Discover, compare, and customize modern prefab home models with transparent pricing",
    content: "Explore certified modular home models from compact studio cabins to spacious multi-story barndominiums and custom luxury residential homes.",
    featured_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Modular Home Models Catalog",
    seo_title: "Floor Plans & Home Catalog | ModularHome.com",
    meta_description: "Browse our complete catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and custom floor plans with transparent pricing.",
    canonical_url: "https://modularhome.com/models",
    og_title: "Floor Plans & Home Catalog | ModularHome.com",
    og_description: "Browse our complete catalog of modular homes, prefabs, barndominiums, cabins, ADUs, and custom floor plans.",
    og_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "floor-plans",
    title: "Builder-Grade Floor Plans & Engineering Kits",
    subtitle: "Download stamped architectural blueprints, clear-span steel framing calculations, and CAD drawings",
    content: "Download stamped architectural blueprints, clear-span steel framing calculations, and CAD drawings ready for municipal permit submittals.",
    featured_image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Architectural Floor Plans and Blueprints",
    seo_title: "Architectural Floor Plans & Construction Blueprints | ModularHome.com",
    meta_description: "Download builder-grade floor plans, structural framing plans, and CAD drawings for modular homes, cabins, ADUs, and barndominiums.",
    canonical_url: "https://modularhome.com/floor-plans",
    og_title: "Architectural Floor Plans & Construction Blueprints | ModularHome.com",
    og_description: "Download builder-grade floor plans, structural framing plans, and CAD drawings ready for permit submittal.",
    og_image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "resources",
    title: "Modular Home Educational Resources & Guides",
    subtitle: "In-depth engineering guides, permitting advice, foundation tips, and modular cost breakdowns",
    content: "Comprehensive educational guides on modular home construction, pricing, financing, land preparation, delivery, and custom floor plans.",
    featured_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Modular Home Educational Resources and Articles",
    seo_title: "Modular Home Educational Resources & Guides | ModularHome.com",
    meta_description: "Comprehensive educational guides on modular home construction, pricing, financing, land preparation, delivery, and custom floor plans.",
    canonical_url: "https://modularhome.com/resources",
    og_title: "Modular Home Educational Resources & Guides | ModularHome.com",
    og_description: "Comprehensive educational guides on modular home construction, pricing, financing, land preparation, and delivery.",
    og_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "videos",
    title: "Video Gallery & Home Tours",
    subtitle: "Watch factory walkthroughs, crane assembly days, and customer build walkthroughs",
    content: "Watch in-depth walkthroughs of our modular homes, prefabs, barndominiums, cabins, and customer project stories.",
    featured_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Modular Home Video Walkthroughs and Tours",
    seo_title: "Video Gallery & Home Tours | ModularHome.com",
    meta_description: "Watch in-depth walkthroughs of our modular homes, prefabs, barndominiums, cabins, and customer project stories.",
    canonical_url: "https://modularhome.com/videos",
    og_title: "Video Gallery & Home Tours | ModularHome.com",
    og_description: "Watch in-depth walkthroughs of our modular homes, prefabs, barndominiums, cabins, and customer project stories.",
    og_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "quote",
    title: "Instant Building Quote Calculator",
    subtitle: "Configure your home model, square footage, and turnkey options in under 2 minutes",
    content: "Calculate custom estimates for your modular home, prefab, tiny home, barndominium, or cabin. Customize square footage and options for transparent pricing.",
    featured_image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Instant Modular Home Estimator and Quote Wizard",
    seo_title: "Instant Building Quote Calculator | ModularHome.com",
    meta_description: "Calculate custom estimates for your modular home, prefab, tiny home, barndominium, or cabin. Customize square footage and options for transparent pricing.",
    canonical_url: "https://modularhome.com/quote",
    og_title: "Instant Building Quote Calculator | ModularHome.com",
    og_description: "Calculate custom estimates for your modular home, prefab, tiny home, barndominium, or cabin with transparent pricing.",
    og_image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "upload-floor-plan",
    title: "Upload Your Custom Floor Plan",
    subtitle: "Complimentary modular conversion analysis and stamped engineering quote",
    content: "Upload your floor plan and let our engineering team provide a detailed custom quote. We accept sketches, architect PDFs, and CAD drawings.",
    featured_image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Upload Custom Floor Plan for Engineering Review",
    seo_title: "Upload Your Floor Plan | ModularHome.com",
    meta_description: "Already have a blueprint or architectural drawing? Upload your plan for a complimentary modular home engineering breakdown and custom bid package.",
    canonical_url: "https://modularhome.com/upload-floor-plan",
    og_title: "Upload Your Floor Plan | ModularHome.com",
    og_description: "Upload your architectural drawings for a complimentary modular engineering bid package.",
    og_image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "warranty-certifications",
    title: "Warranty & Engineering Certifications",
    subtitle: "Structural integrity backed by 20-year limited framing warranties and IBC stamps",
    content: "All ModularHome structures are engineered to rigorous International Building Code (IBC) standards and built with certified high-tensile steel framing backed by industry-leading warranties.",
    featured_image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80",
    image_alt: "ModularHome Warranty and Engineering Certifications",
    seo_title: "Warranty & Engineering Certifications | ModularHome.com",
    meta_description: "Discover our 20-year structural framing warranties, licensed engineer calculation seals, and climate-resistant construction certifications.",
    canonical_url: "https://modularhome.com/warranty-certifications",
    og_title: "Warranty & Engineering Certifications | ModularHome.com",
    og_description: "Structural integrity backed by 20-year limited framing warranties and IBC certified engineering.",
    og_image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    subtitle: "How ModularHome.com protects and respects your personal information",
    content: "ModularHome.com is committed to protecting your privacy. This policy explains how we collect, use, and safeguard the information you provide when using our website and services.",
    featured_image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Privacy Policy and Security Standards",
    seo_title: "Privacy Policy | ModularHome.com",
    meta_description: "Read the ModularHome.com privacy policy to understand how we protect your personal and project information.",
    canonical_url: "https://modularhome.com/privacy-policy",
    og_title: "Privacy Policy | ModularHome.com",
    og_description: "Read the ModularHome.com privacy policy to understand how we protect your personal information.",
    og_image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    subtitle: "User agreement and guidelines for ModularHome.com architectural marketplace",
    content: "These terms of service govern your access to and use of ModularHome.com, including our online estimators, floor plan downloads, and modular manufacturing services.",
    featured_image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Terms of Service Agreement",
    seo_title: "Terms of Service | ModularHome.com",
    meta_description: "Review the terms and conditions governing the use of ModularHome.com architectural blueprints and modular housing services.",
    canonical_url: "https://modularhome.com/terms-of-service",
    og_title: "Terms of Service | ModularHome.com",
    og_description: "Review the terms and conditions governing ModularHome.com housing services.",
    og_image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    status: "PUBLISHED",
  },
];

async function seedAllPages() {
  console.log("=== SEEDING ALL PUBLIC PAGES INTO POSTGRESQL PAGES TABLE ===");

  for (const page of PUBLIC_PAGES_TO_SEED) {
    const checkRes = await query(
      `SELECT id, slug, title FROM pages WHERE LOWER(slug) = LOWER($1) OR LOWER(handle) = LOWER($1) LIMIT 1;`,
      [page.slug]
    );

    const now = new Date().toISOString();

    if (checkRes && checkRes.rows && checkRes.rows.length > 0) {
      const existing = checkRes.rows[0];
      console.log(`[EXISTING] Updating page: "${page.title}" (slug: ${page.slug}, ID: ${existing.id})`);
      await query(
        `UPDATE pages SET
          title = $1,
          subtitle = $2,
          body_html = $3,
          featured_image = $4,
          image_alt = $5,
          seo_title = $6,
          seo_description = $7,
          canonical_url = $8,
          og_title = $9,
          og_description = $10,
          og_image = $11,
          status = $12,
          published = true,
          updated_at = $13
        WHERE id = $14;`,
        [
          page.title,
          page.subtitle,
          page.content,
          page.featured_image,
          page.image_alt,
          page.seo_title,
          page.meta_description,
          page.canonical_url,
          page.og_title,
          page.og_description,
          page.og_image,
          page.status,
          now,
          existing.id,
        ]
      );
    } else {
      const newId = crypto.randomUUID();
      console.log(`[INSERTING] Creating new page: "${page.title}" (slug: ${page.slug}, ID: ${newId})`);
      await query(
        `INSERT INTO pages (
          id, handle, slug, title, subtitle, body_html, featured_image, image_alt,
          seo_title, seo_description, canonical_url, og_title, og_description, og_image,
          status, published, created_at, updated_at, published_at, robots
        ) VALUES (
          $1, $2, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13,
          $14, true, $15, $15, $15, 'index, follow'
        );`,
        [
          newId,
          page.slug,
          page.title,
          page.subtitle,
          page.content,
          page.featured_image,
          page.image_alt,
          page.seo_title,
          page.meta_description,
          page.canonical_url,
          page.og_title,
          page.og_description,
          page.og_image,
          page.status,
          now,
        ]
      );
    }
  }

  // Count total pages in DB
  const countRes = await query(`SELECT COUNT(*) as cnt FROM pages;`);
  console.log(`\n Total pages in PostgreSQL DB: ${countRes?.rows[0]?.cnt}`);
  console.log("Seeding completed successfully!");
  process.exit(0);
}

seedAllPages().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
