import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Footer Settings | Admin Dashboard",
  description: "Configure footer columns, legal links, and social channels.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
