import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Audit Logs | Admin Dashboard",
  description: "Track administrative actions, authentication attempts, and system logs.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
