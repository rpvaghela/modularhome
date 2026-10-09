import { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | ModularHome.com",
  description: "ModularHome.com executive control center and management console.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
