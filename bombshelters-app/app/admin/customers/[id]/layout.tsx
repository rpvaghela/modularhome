import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Account Details | Admin Dashboard",
  description: "View detailed customer profile, order history, and downloads.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
