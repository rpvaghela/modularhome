import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads & Inquiries | Admin Dashboard",
  description: "Review customer consultation requests, quote submissions, and inquiries.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
