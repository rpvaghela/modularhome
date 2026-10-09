import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Sync & Integration | Admin Dashboard",
  description: "Manage synchronization between Shopify catalog and local database.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
