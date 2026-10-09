import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | ModularHome.com",
  description: "Reset your ModularHome.com customer portal password securely.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
