import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Orders & Receipts | Admin Dashboard",
  description: "Manage customer blueprint orders, payment statuses, and refunds.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
