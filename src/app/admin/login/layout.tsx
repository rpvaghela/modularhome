import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | ModularHome.com",
  description: "Secure administrator sign-in portal.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
