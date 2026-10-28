import fs from "fs";
import path from "path";
import { TESTIMONIALS, TestimonialItem } from "../data/testimonials";

export interface BombShelterReview {
  id: string;
  customer_name: string;
  location?: string;
  rating: number;
  review_text: string;
  project_title?: string;
  image_url?: string;
  status: "PUBLISHED" | "PENDING" | "ARCHIVED";
  is_featured: boolean;
  display_order: number;
  created_at?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "custom_reviews.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

function getInitialReviews(): BombShelterReview[] {
  return TESTIMONIALS.map((t, idx) => ({
    id: t.id,
    customer_name: t.name,
    location: t.location,
    rating: t.rating,
    review_text: t.quote,
    project_title: t.roleOrContext,
    image_url: t.avatarUrl,
    status: "PUBLISHED",
    is_featured: true,
    display_order: idx + 1,
    created_at: new Date().toISOString(),
  }));
}

export function readLocalReviews(): BombShelterReview[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(REVIEWS_FILE)) {
      const initial = getInitialReviews();
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getInitialReviews();
  } catch (error) {
    console.error("Error reading custom_reviews.json:", error);
    return getInitialReviews();
  }
}

export function writeLocalReviews(reviews: BombShelterReview[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_reviews.json:", error);
  }
}

export async function getBombShelterReviews(onlyPublished = false): Promise<BombShelterReview[]> {
  const reviews = readLocalReviews();
  if (onlyPublished) {
    return reviews.filter((r) => r.status === "PUBLISHED");
  }
  return reviews;
}

export async function saveBombShelterReview(review: BombShelterReview): Promise<BombShelterReview> {
  const reviews = readLocalReviews();
  const idx = reviews.findIndex((r) => r.id === review.id);
  if (idx !== -1) {
    reviews[idx] = review;
  } else {
    reviews.unshift(review);
  }
  writeLocalReviews(reviews);
  return review;
}

export async function deleteBombShelterReview(id: string): Promise<boolean> {
  const reviews = readLocalReviews();
  const filtered = reviews.filter((r) => r.id !== id);
  writeLocalReviews(filtered);
  return true;
}

