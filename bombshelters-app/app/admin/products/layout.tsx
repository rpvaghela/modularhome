import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Models Catalog | Admin Dashboard",
  description: "Manage prefab and modular home models, specs, and floor plans.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
