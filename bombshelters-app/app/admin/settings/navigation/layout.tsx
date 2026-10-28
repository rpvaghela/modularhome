import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Navigation Settings | Admin Dashboard",
  description: "Manage header mega menu, categories, and custom links.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
