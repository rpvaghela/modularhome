import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit CMS Page | Admin Dashboard",
  description: "Edit page content, dynamic sections, and SEO tags.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
