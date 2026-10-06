import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Login | ModularHome.com",
  description: "Secure customer account login portal for ModularHome.com.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
