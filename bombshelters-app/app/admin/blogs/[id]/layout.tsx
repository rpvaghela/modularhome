import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog Article | Admin Dashboard",
  description: "Edit existing blog post details, markdown content, and SEO metadata.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
