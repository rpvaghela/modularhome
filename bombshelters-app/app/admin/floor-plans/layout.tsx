import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Floor Plans & Blueprints | Admin Dashboard",
  description: "Manage digital floor plans, CAD files, pricing, and download kits.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
