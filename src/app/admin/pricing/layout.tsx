import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Matrix & Formulas | Admin Dashboard",
  description: "Configure pricing rules, packages, and cost calculators.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
