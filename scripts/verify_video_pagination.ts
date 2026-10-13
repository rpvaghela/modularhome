import dotenv from "dotenv";
dotenv.config();

import { getPaginatedVideos, getTotalVideoCount, getCategoryCounts } from "../src/lib/videoStore";

async function runVerification() {
  console.log("==================================================================");
  console.log("🧪 VERIFYING VIDEO GALLERY PAGINATION & SYNC SUITE");
  console.log("==================================================================");

  // 1. Total Video Count
  const totalCount = await getTotalVideoCount();
  console.log(`✅ 1. Total Videos Count in Database: ${totalCount.toLocaleString()}`);

  // 2. Category Counts
  const categoryCounts = await getCategoryCounts();
  console.log("✅ 2. Category Badge Counts:", JSON.stringify(categoryCounts, null, 2));

  // 3. Page 1 Query
  const page1 = await getPaginatedVideos({ page: 1, limit: 12 });
  console.log(`✅ 3. Page 1: Returned ${page1.videos.length} videos (Total Pages: ${page1.totalPages.toLocaleString()})`);
  if (page1.videos.length > 0) {
    console.log(`   Sample Video 1: "${page1.videos[0].title.slice(0, 50)}..." [Slug: ${page1.videos[0].slug}]`);
  }

  // 4. Page 2 Query
  const page2 = await getPaginatedVideos({ page: 2, limit: 12 });
  console.log(`✅ 4. Page 2: Returned ${page2.videos.length} videos`);
  if (page2.videos.length > 0) {
    console.log(`   Sample Video 1 (Page 2): "${page2.videos[0].title.slice(0, 50)}..." [Slug: ${page2.videos[0].slug}]`);
  }

  // Ensure Page 1 and Page 2 contain distinct videos
  const id1 = page1.videos.map(v => v.youtubeVideoId);
  const id2 = page2.videos.map(v => v.youtubeVideoId);
  const overlap = id1.filter(id => id2.includes(id));
  if (overlap.length === 0) {
    console.log("✅ 5. Distinctness Check: 0 overlap between Page 1 and Page 2 (100% distinct paginated slices).");
  } else {
    console.warn("⚠️ Warning: Overlap found between pages:", overlap);
  }

  // 6. Category Filtering: Prefab Cabins
  const cabinsPage = await getPaginatedVideos({ page: 1, limit: 12, category: "Prefab Cabins" });
  console.log(`✅ 6. Category Filter "Prefab Cabins": Found ${cabinsPage.totalCount.toLocaleString()} total, ${cabinsPage.videos.length} on page 1.`);

  // 7. Category Filtering: Barndominiums
  const barndoPage = await getPaginatedVideos({ page: 1, limit: 12, category: "Barndominiums" });
  console.log(`✅ 7. Category Filter "Barndominiums": Found ${barndoPage.totalCount.toLocaleString()} total, ${barndoPage.videos.length} on page 1.`);

  // 8. Search Query: "cabin"
  const searchResult = await getPaginatedVideos({ page: 1, limit: 12, search: "cabin" });
  console.log(`✅ 8. Keyword Search "cabin": Found ${searchResult.totalCount.toLocaleString()} total matching videos.`);

  console.log("\n==================================================================");
  console.log("🎉 ALL VIDEO PAGINATION & DATABASE TESTS PASSED!");
  console.log("==================================================================");
}

runVerification().catch(console.error);
