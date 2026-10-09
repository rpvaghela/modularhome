import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales & Activity Reports | Admin Dashboard",
  description: "Export sales reports, customer activity, and catalog statistics.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
