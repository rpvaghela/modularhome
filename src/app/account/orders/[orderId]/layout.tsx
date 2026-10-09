import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details & Receipt | Customer Portal",
  description: "Detailed view of your modular home blueprint purchase and order receipts.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
