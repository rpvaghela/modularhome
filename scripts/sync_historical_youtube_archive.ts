/**
 * Historical YouTube Video Archive Synchronization Runner
 * Pages through the entire YouTube uploads playlist (~20,000+ videos),
 * persisting checkpoint pagination tokens, batch upserting into Supabase,
 * and respecting YouTube API quotas.
 */

import dotenv from "dotenv";
dotenv.config();

import { syncYouTubeChannel } from "../src/lib/youtubeService";
import { readVideosFromStore, writeVideosToStore, getTotalVideoCount } from "../src/lib/videoStore";
import fs from "fs";
import path from "path";

const CHECKPOINT_FILE = path.join(process.cwd(), "src", "data", "youtube_sync_checkpoint.json");

interface CheckpointData {
  lastPageToken: string | null;
  totalBatchesProcessed: number;
  totalVideosSynced: number;
  lastRunAt: string;
  isComplete: boolean;
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
    isComplete: false,
  };
}

function saveCheckpoint(data: CheckpointData) {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function runHistoricalSync() {
  const args = process.argv.slice(2);
  const resetRequested = args.includes("--reset");
  const runAll = args.includes("--all");
  const maxBatchesArg = args.find((a) => a.startsWith("--max-batches="));
  const maxBatches = maxBatchesArg ? parseInt(maxBatchesArg.split("=")[1], 10) : (runAll ? 500 : 40);

  console.log("==================================================================");
  console.log("🎬 STARTING COMPLETE YOUTUBE HISTORICAL ARCHIVE SYNCHRONIZATION");
  console.log("   Target Channel: Amish Built Cabins (@amishbuiltcabins)");
  console.log("   Archive Scope: Full Historical Uploads (~20,000+ Videos)");
  console.log("==================================================================");

  let checkpoint = readCheckpoint();

  if (resetRequested) {
    console.log("🔄 Reset requested: Clearing checkpoint to start from beginning.");
    checkpoint = {
      lastPageToken: null,
      totalBatchesProcessed: 0,
      totalVideosSynced: 0,
      lastRunAt: new Date().toISOString(),
      isComplete: false,
    };
    saveCheckpoint(checkpoint);
  }

  const initialDbCount = await getTotalVideoCount();
  console.log(`Current Published Videos in Database: ${initialDbCount}`);
  console.log(`Resuming from token: ${checkpoint.lastPageToken || "[START OF HISTORICAL ARCHIVE]"}`);

  let currentToken = checkpoint.lastPageToken || undefined;
  let batchCount = 0;
  let consecutiveErrors = 0;

  while (batchCount < maxBatches) {
    batchCount++;
    console.log(`\n------------------------------------------------------------------`);
    console.log(`⚡ Processing Batch #${batchCount} / ${maxBatches} (Token: ${currentToken ? currentToken.slice(0, 20) + "..." : "[Start]"})`);

    try {
      const result = await syncYouTubeChannel({
        pageToken: currentToken,
        maxPages: 10, // 10 pages * 50 = up to 500 videos per batch
        includeAllHistorical: true,
        skipFileWrite: true, // Only write to local file periodically to save disk I/O
      });

      if (!result.success) {
        console.error(`❌ Batch #${batchCount} reported failure:`, result.message);
        consecutiveErrors++;
        if (consecutiveErrors >= 3) {
          console.error(`Stopping after 3 consecutive errors.`);
          break;
        }
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }

      consecutiveErrors = 0;
      console.log(`- Batch result: ${result.message}`);
      console.log(`- Checked: ${result.checkedCount} | New: ${result.newVideosCount} | Updated: ${result.updatedVideosCount}`);

      checkpoint.totalBatchesProcessed += 1;
      checkpoint.totalVideosSynced += result.newVideosCount;
      checkpoint.lastRunAt = new Date().toISOString();
      checkpoint.lastPageToken = result.nextPageToken || null;
      checkpoint.isComplete = !result.hasMore || !result.nextPageToken;
      saveCheckpoint(checkpoint);

      const currentTotal = await getTotalVideoCount();
      console.log(`- Total Videos in Database: ${currentTotal}`);

      if (!result.hasMore || !result.nextPageToken) {
        console.log("\n🎉 Reached end of historical YouTube archive! All available videos imported.");
        break;
      }

      currentToken = result.nextPageToken;

      // Flush local disk store every 5 batches (~2,500 videos)
      if (batchCount % 5 === 0) {
        try {
          const currentInMemory = readVideosFromStore();
          writeVideosToStore(currentInMemory);
          console.log(`💾 Checkpoint flushed to local video store (Total in memory: ${currentInMemory.length})`);
        } catch (e) {}
      }

      // Small throttle to be courteous with YouTube Data API quota
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (err: any) {
      console.error(`\n❌ Error during historical batch #${batchCount}:`, err.message);
      consecutiveErrors++;
      if (consecutiveErrors >= 3) break;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Final flush to local video store
  try {
    const finalVideos = readVideosFromStore();
    writeVideosToStore(finalVideos);
  } catch (e) {}

  const finalCount = await getTotalVideoCount();
  console.log("\n==================================================================");
  console.log(`📊 ARCHIVE RUN COMPLETED`);
  console.log(`   Final Total Videos in Database: ${finalCount}`);
  console.log(`   Total Batches Processed This Run: ${batchCount}`);
  console.log(`   Total Historical Checkpoint: ${checkpoint.totalVideosSynced} synced across ${checkpoint.totalBatchesProcessed} batches`);
  console.log(`   Next resumption token saved to: src/data/youtube_sync_checkpoint.json`);
  console.log("==================================================================");
}

runHistoricalSync().catch(console.error);
