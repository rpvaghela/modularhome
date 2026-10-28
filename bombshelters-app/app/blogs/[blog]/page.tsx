import { redirect } from "next/navigation";

export default function BlogCategoryPage({ params }: { params: { blog: string } }) {
  // If navigating to the blog category root, redirect to main blog directory
  redirect("/blogs");
}

