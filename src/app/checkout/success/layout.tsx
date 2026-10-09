import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed & Blueprint Downloads | ModularHome.com",
  description: "Your order is confirmed. Access and download your architectural floor plans, CAD drawings, and blueprint kits.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
