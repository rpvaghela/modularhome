export interface TestimonialItem {
  id: string;
  name: string;
  roleOrContext: string;
  location: string;
  quote: string;
  rating: number;
  avatarUrl: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Michael R.",
    roleOrContext: "Homeowner",
    location: "Newnan, Texas",
    quote: "After seeing the severe weather patterns escalating every spring, investing in our underground steel shelter gave our family absolute peace of mind. The delivery and placement took just 4 days, and the build quality is military-grade.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test-2",
    name: "Jennifer L.",
    roleOrContext: "Family Homestead",
    location: "Colorado",
    quote: "We opted for the custom Appalachian cabin with a sub-surface storm vault. The engineering team communicated with us through every step of the excavation. Knowing our children are protected from wildfires and storms is priceless.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test-3",
    name: "David K.",
    roleOrContext: "Business Owner",
    location: "Florida",
    quote: "BombShelters.com handled the entire turnkey process from design to transport. The Swiss NBC filtration and reinforced hatch look and feel indestructible. Financing was straightforward with no surprise hidden fees.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];
