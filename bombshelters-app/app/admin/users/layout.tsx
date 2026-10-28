import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Users & Roles | Admin Dashboard",
  description: "Manage administrator accounts, permissions, and team access.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
