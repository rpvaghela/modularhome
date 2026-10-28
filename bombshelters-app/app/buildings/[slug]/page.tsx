import { redirect } from "next/navigation";

export default function BuildingDetailPage({ params }: { params: { slug: string } }) {
  redirect(`/models/${params.slug}`);
}

