import { redirect } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  redirect(`/models/${params.slug}`);
}

