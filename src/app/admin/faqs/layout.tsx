import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs Management | Admin Dashboard",
  description: "Manage frequently asked questions and category answers.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
