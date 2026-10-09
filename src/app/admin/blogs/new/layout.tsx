import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Blog Article | Admin Dashboard",
  description: "Publish a new blog post or construction guide.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
