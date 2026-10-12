/**
 * Historical YouTube Video Archive Synchronization Runner
 * Pages through the entire YouTube uploads playlist in batches,
 * persisting checkpoint pagination tokens and respecting YouTube API quotas.
 */

import dotenv from "dotenv";
dotenv.config();

import { syncYouTubeChannel } from "../src/lib/youtubeService";
import fs from "fs";
import path from "path";

const CHECKPOINT_FILE = path.join(process.cwd(), "src", "data", "youtube_sync_checkpoint.json");

interface CheckpointData {
  lastPageToken: string | null;
  totalBatchesProcessed: number;
  totalVideosSynced: number;
  lastRunAt: string;
}

function readCheckpoint(): CheckpointData {
  if (fs.existsSync(CHECKPOINT_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf-8"));
      return data;
    } catch (e) {
      // Fallback
    }
  }
  return {
    lastPageToken: null,
    totalBatchesProcessed: 0,
    totalVideosSynced: 0,
    lastRunAt: new Date().toISOString(),
  };
}

function saveCheckpoint(data: CheckpointData) {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function runHistoricalSync() {
  console.log("==================================================================");
  console.log("🎬 STARTING YOUTUBE HISTORICAL ARCHIVE SYNCHRONIZATION");
  console.log("==================================================================");

  const checkpoint = readCheckpoint();
  console.log(`Starting from token: ${checkpoint.lastPageToken || "[START OF ARCHIVE]"}`);

  let currentToken = checkpoint.lastPageToken || undefined;
  let batchCount = 0;
  const maxBatchesPerRun = 5; // Process up to 5 batches of 10 pages (~2,500 videos per run)

  while (batchCount < maxBatchesPerRun) {
    batchCount++;
    console.log(`\nProcessing Batch #${batchCount} (PageToken: ${currentToken || "Initial"})...`);

    try {
      const result = await syncYouTubeChannel({
        pageToken: currentToken,
        maxPages: 10, // 10 pages * 50 = up to 500 videos per batch
      });

      console.log(`- Batch result: ${result.message}`);
      console.log(`- Checked: ${result.checkedCount} | New: ${result.newVideosCount} | Updated: ${result.updatedVideosCount}`);

      checkpoint.totalBatchesProcessed += 1;
      checkpoint.totalVideosSynced += result.newVideosCount;
      checkpoint.lastRunAt = new Date().toISOString();
      checkpoint.lastPageToken = result.nextPageToken || null;
      saveCheckpoint(checkpoint);

      if (!result.hasMore || !result.nextPageToken) {
        console.log("\n🎉 Reached end of historical YouTube archive! All videos imported.");
        break;
      }

      currentToken = result.nextPageToken;

      // Small throttle to be courteous with YouTube Data API quota
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err: any) {
      console.error(`\n❌ Error during historical batch:`, err.message);
      break;
    }
  }

  console.log("\n==================================================================");
  console.log(`📊 ARCHIVE RUN COMPLETED`);
  console.log(`Next resumption token saved to: src/data/youtube_sync_checkpoint.json`);
  console.log("==================================================================");
}

runHistoricalSync().catch(console.error);
