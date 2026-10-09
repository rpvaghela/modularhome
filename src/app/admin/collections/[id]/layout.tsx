import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Collection | Admin Dashboard",
  description: "Configure collection rules, banners, and model associations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
