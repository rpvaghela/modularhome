import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Settings | Admin Dashboard",
  description: "Configure site name, contact information, branding, and defaults.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
