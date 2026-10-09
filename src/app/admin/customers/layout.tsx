import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers Directory | Admin Dashboard",
  description: "Manage registered customer accounts, orders, and blueprint access.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
