import { notFound, permanentRedirect } from "next/navigation";
import { getPublicProductBySlug } from "@/lib/publicData";
import { getProductUrl, resolveSimilarCategoryPath } from "@/utils/productUrls";

export const dynamic = "force-dynamic";

export default async function BuildingSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const model = await getPublicProductBySlug(slug);
  if (!model) {
    notFound();
  }

  const targetUrl = getProductUrl(model);
  permanentRedirect(targetUrl);
}
