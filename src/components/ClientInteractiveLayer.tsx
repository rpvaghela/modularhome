"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const AIBuildAssistant = dynamic(() => import("@/components/AIBuildAssistant"), { ssr: false });

export default function ClientInteractiveLayer() {
  return (
    <>
      <CartDrawer />
      <AIBuildAssistant />
    </>
  );
}
