import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Profile & Settings | Customer Portal",
  description: "Manage your personal profile, contact information, and security preferences on ModularHome.com.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
