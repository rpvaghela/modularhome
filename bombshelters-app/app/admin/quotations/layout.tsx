import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quotations & Estimates | Admin Dashboard",
  description: "Manage customer custom quotations and factory cost breakdowns.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
