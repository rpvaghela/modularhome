import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Header Settings | Admin Dashboard",
  description: "Configure top navigation, announcement bars, and CTA buttons.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
