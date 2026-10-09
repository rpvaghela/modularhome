import { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Redirects Manager | Admin Dashboard",
  description: "Manage 301/302 redirects and vanity URL routing.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
