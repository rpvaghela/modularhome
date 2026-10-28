import React from "react";
import { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/templates/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Hardened Modular Storage & Armories | BombShelters.com",
  description:
    "Heavy-duty fireproof steel storage vaults, armories, and secure subterranean storage facilities for emergency provisions and equipment.",
};

export default function ModularStoragePage() {
  return (
    <CategoryPageTemplate
      badge="CLASS-3 SECURITY RATED"
      title="HARDENED STORAGE &"
      highlight="SECURE ARMORIES"
      description="Reinforced structural steel storage structures engineered to safeguard valuable emergency food stores, ammunition, critical tools, and power equipment."
      categoryKey="Modular Storage"
      breadcrumbs={[{ label: "Modular Storage" }]}
      keyPoints={[
        {
          title: "Continuous Structural Steel Plate",
          desc: "Torque and cutting-torch resistant steel walls and roof plate.",
        },
        {
          title: "Bank-Grade Vault Doors",
          desc: "Multi-bolt relocking devices and drill-resistant hardplate barriers.",
        },
        {
          title: "Climate & Humidity Control",
          desc: "Sealed hermetic gaskets and dedicated dehumidification prevent corrosion and mold.",
        },
        {
          title: "Fireproof Concrete Casing",
          desc: "Optional poured concrete exterior encasement rated for 4+ hours of severe fire exposure.",
        },
      ]}
    />
  );
}

