import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Customer Account | ModularHome.com",
  description: "Create an account to manage orders, floor plan downloads, and quotes on ModularHome.com.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
