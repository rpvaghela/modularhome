import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Floor Plan | Admin Dashboard",
  description: "Edit architectural floor plan details, specifications, and files.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
