export interface VideoItem {
  slug: string;
  title: string;
  category: string;
  duration: string;
  imageUrl: string;
  description: string;
  youtubeId: string;
}

export const VIDEOS: VideoItem[] = [
  {
    slug: "subterranean-crane-setting",
    title: "Setting a 40,000-lb Subterranean Bunker with a 75-Ton Crane",
    category: "Installation",
    duration: "6:42",
    imageUrl: "/images/hillside-bunker.png",
    description: "Full on-site documentation of the rigging, crane hoisting, and subterranean leveling of a custom 10x40 shelter.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    slug: "luxury-bunker-walkthrough",
    title: "Inside a Multi-Level Luxury Underground Estate (Complete Tour)",
    category: "Tours",
    duration: "12:15",
    imageUrl: "/images/cat-luxury-bunkers.png",
    description: "Tour the master living quarters, hydroponic produce bay, battery microgrid, and decontamination airlock.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    slug: "factory-welding-tour",
    title: "Factory Precision: Continuous Arc Welding of ASTM A36 Steel",
    category: "Manufacturing",
    duration: "8:05",
    imageUrl: "/images/cat-steel-framed-homes.png",
    description: "Go behind the scenes at our American steel fabrication plant to see how pressure vessels are hydrostatically sealed.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    slug: "nbc-filtration-demo",
    title: "Swiss NBC Air Filtration & Manual Blower Emergency Test",
    category: "Engineering",
    duration: "5:30",
    imageUrl: "/images/cat-bomb-shelters.png",
    description: "Demonstration of positive-pressure air scrubbing and manual hand-crank operation during zero-grid scenarios.",
    youtubeId: "dQw4w9WgXcQ",
  },
];

