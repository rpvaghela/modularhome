import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Blueprint Downloads | Customer Portal",
  description: "Access and download your purchased architectural floor plans, CAD drawings, and construction blueprints.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DownloadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
