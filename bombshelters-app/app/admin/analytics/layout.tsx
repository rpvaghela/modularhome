import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics & Traffic | Admin Dashboard",
  description: "View website analytics, visitors, page views, and conversion trends.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
