import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Invoice & Receipt | ModularHome.com",
  description: "Official printable invoice and receipt for order on ModularHome.com.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
