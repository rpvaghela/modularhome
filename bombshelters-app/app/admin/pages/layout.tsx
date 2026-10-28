import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Pages Management | Admin Dashboard",
  description: "Create and edit custom CMS landing pages and sections.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
