import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { INITIAL_FLOOR_PLANS, FloorPlan } from "@/data/floorPlans";
import { readFloorPlansFromStore } from "@/lib/floorPlanStore";
import { getCanonicalUrl, getRobotsMetadata } from "@/lib/seo";
import FloorPlanDetailClient from "./FloorPlanDetailClient";

export const dynamic = "force-dynamic";

interface FloorPlanPageProps {
  params: Promise<{ slug: string }>;
}

async function getFloorPlan(slug: string): Promise<FloorPlan | null> {
  const customPlans = readFloorPlansFromStore();
  const foundCustom = customPlans.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug
  );

  if (foundCustom) {
    return {
      id: foundCustom.id,
      title: foundCustom.title,
      slug: foundCustom.slug,
      tagline: foundCustom.tagline || "",
      description: foundCustom.description || "",
      price: Number(foundCustom.price) || 495,
      salePrice: foundCustom.salePrice || foundCustom.sale_price,
      currency: foundCustom.currency || "USD",
      previewImage: foundCustom.previewImage || foundCustom.preview_image || "/newmodularlogo.png",
      gallery: foundCustom.gallery || [],
      filePath: foundCustom.filePath || foundCustom.file_path,
      fileFormat: foundCustom.fileFormat || foundCustom.file_format || "PDF + CAD (DWG)",
      category: (foundCustom.category as FloorPlan["category"]) || "Cabins",
      bedrooms: Number(foundCustom.bedrooms) || 2,
      bathrooms: Number(foundCustom.bathrooms) || 1,
      squareFeet: Number(foundCustom.squareFeet || foundCustom.square_feet) || 800,
      dimensions: foundCustom.dimensions || "24x36 ft",
      stories: Number(foundCustom.stories) || 1,
      includedItems: foundCustom.includedItems || foundCustom.included_items || [
        "Full Construction Blueprints",
        "Structural Steel Framing & Truss Layouts",
        "Electrical & Plumbing Schematics",
      ],
      features: foundCustom.features || [],
      specs: foundCustom.specs || {},
      status: (foundCustom.status as FloorPlan["status"]) || "PUBLISHED",
      isFeatured: !!(foundCustom.isFeatured || foundCustom.is_featured),
      displayOrder: Number(foundCustom.displayOrder || foundCustom.display_order) || 0,
    };
  }

  const foundInitial = INITIAL_FLOOR_PLANS.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug
  );

  return foundInitial || null;
}

export async function generateMetadata({
  params,
}: FloorPlanPageProps): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getFloorPlan(slug);

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  if (!plan) {
    return {
      title: "Floor Plan Not Found | ModularHome.com",
      robots: { index: false, follow: false },
    };
  }

  const title = `${plan.title} - Architectural Floor Plan & Blueprints | ModularHome.com`;
  const description =
    plan.tagline ||
    plan.description ||
    `Download complete CAD & PDF architectural blueprints and engineering layouts for ${plan.title} (${plan.squareFeet} sq ft, ${plan.bedrooms} Bed, ${plan.bathrooms} Bath).`;
  const canonical = getCanonicalUrl(`/floor-plans/${plan.slug}`);

  return {
    title,
    description,
    robots,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ModularHome.com",
      images: [
        {
          url: plan.previewImage || "/newmodularlogo.png",
          alt: plan.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [plan.previewImage || "/newmodularlogo.png"],
    },
  };
}

export default async function FloorPlanDetailPage({ params }: FloorPlanPageProps) {
  const { slug } = await params;
  const plan = await getFloorPlan(slug);

  if (!plan) {
    notFound();
  }

  return <FloorPlanDetailClient initialPlan={plan} slug={slug} />;
}
