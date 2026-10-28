import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs & Articles | Admin Dashboard",
  description: "Manage blog posts, articles, and architectural guides.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
