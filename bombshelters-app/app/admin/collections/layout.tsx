import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections Management | Admin Dashboard",
  description: "Organize models and floor plans into curated collections.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
