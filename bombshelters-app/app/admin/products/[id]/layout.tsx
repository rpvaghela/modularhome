import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Home Model | Admin Dashboard",
  description: "Edit home model details, specifications, floor plans, and pricing.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
