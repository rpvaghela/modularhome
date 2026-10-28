export interface ResourceItem {
  slug: string;
  title: string;
  category: string;
  fileType: string;
  fileSize: string;
  description: string;
}

export const RESOURCES: ResourceItem[] = [
  {
    slug: "soil-hydrology-handbook",
    title: "Subterranean Soil & Hydrology Handbook",
    category: "Site Preparation",
    fileType: "PDF Guide",
    fileSize: "4.8 MB",
    description: "Geotechnical guide for evaluating soil bearing capacity, seasonal water tables, and hydrostatic buoyancy anchors for underground bunkers.",
  },
  {
    slug: "swiss-nbc-manual",
    title: "Swiss NBC Air Filtration Operations & Maintenance",
    category: "Life Support",
    fileType: "Technical Manual",
    fileSize: "6.2 MB",
    description: "Standard operating procedures for military-grade gas adsorbers, positive pressure sealing, and emergency manual hand-crank blower use.",
  },
  {
    slug: "fema-p320-checklist",
    title: "FEMA P-320 Safe Room & Storm Shelter Checklist",
    category: "Compliance",
    fileType: "Inspection Checklist",
    fileSize: "2.1 MB",
    description: "Official homeowner guidelines covering 250 MPH wind deflection, anchor bolt torque specs, and ICC 500 missile impact standards.",
  },
  {
    slug: "bunker-permitting-guide",
    title: "Homeowner Guide to Discretion & Private Permitting",
    category: "Permitting",
    fileType: "Planning Document",
    fileSize: "3.5 MB",
    description: "How to navigate county building departments, HOA accessory structure rules, and privacy disclosures during shelter installation.",
  },
];

