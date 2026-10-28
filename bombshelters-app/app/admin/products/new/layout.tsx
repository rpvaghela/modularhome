import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Home Model | Admin Dashboard",
  description: "Add a new prefab modular home model to the catalog.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
