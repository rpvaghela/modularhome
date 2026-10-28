import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage Sections & Blocks | Admin Dashboard",
  description: "Customize homepage blocks, banner highlights, and content sections.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
