import { notFound, permanentRedirect } from "next/navigation";
import { getPublicProductBySlug } from "@/lib/publicData";
import { getProductUrl, resolveSimilarCategoryPath } from "@/utils/productUrls";

export const dynamic = "force-dynamic";

export default async function ModelSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) permanentRedirect("/buildings");

  const model = await getPublicProductBySlug(slug);
  if (!model) {
    permanentRedirect(resolveSimilarCategoryPath(slug));
  }

  const targetUrl = getProductUrl(model);
  permanentRedirect(targetUrl);
}
