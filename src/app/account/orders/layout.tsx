import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders & Receipts | Customer Portal",
  description: "View your order history, invoices, and blueprints purchases on ModularHome.com.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
