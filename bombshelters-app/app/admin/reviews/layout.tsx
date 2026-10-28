import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials | Admin Dashboard",
  description: "Moderate customer testimonials, ratings, and verified reviews.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
