import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Active Sessions | Admin Dashboard",
  description: "Monitor active admin sessions, IP access, and 2FA settings.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
