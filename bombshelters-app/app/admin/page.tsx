import { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Command Center | BombShelters.com Admin",
  description: "BombShelters.com executive defense control center and management console.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
