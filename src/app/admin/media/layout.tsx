import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Asset Library | Admin Dashboard",
  description: "Upload and manage website images, blueprints, and assets.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
