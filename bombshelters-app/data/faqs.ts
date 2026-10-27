export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How much does a bomb shelter cost?",
    answer: "Standard pre-fabricated residential underground bomb shelters start at approximately $49,900 for a turnkey 4-8 person unit with NBC air filtration. Compact residential storm shelters start at $12,900, while multi-room luxury underground estates range from $199,900 to $1M+ depending on customized off-grid power, hydroponics, and square footage.",
  },
  {
    id: "faq-2",
    question: "How long does installation take?",
    answer: "Most pre-engineered underground shelters and safe rooms are installed within 3 to 7 business days once excavation begins. Turnkey modular cabins and steel-framed homes typically take 3 to 6 weeks from site delivery to final interior walkthrough.",
  },
  {
    id: "faq-3",
    question: "Do I need a permit to install a shelter?",
    answer: "Permit requirements vary by municipality and county. In many rural and suburban jurisdictions, underground storm shelters fall under standard accessory structure or grading guidelines. Our vetted engineering team assists you directly with local site surveys, structural drawings, and county permit submissions.",
  },
  {
    id: "faq-4",
    question: "What features can be customized?",
    answer: "Virtually everything: ballistic ratings (Level 1-8), NBC (Nuclear, Biological, Chemical) filtration units, EMP-shielded electrical conduits, geothermal heating/cooling, hidden hydraulic entry hatches, solar/battery generator banks, and luxury interior woodwork and cabinetry.",
  },
  {
    id: "faq-5",
    question: "Do you offer financing options?",
    answer: "Yes. We partner with specialized nationwide construction and preparedness lenders offering fixed-rate financing options, terms up to 15-20 years, and quick pre-qualification with no impact on your credit score during the initial review.",
  },
];
