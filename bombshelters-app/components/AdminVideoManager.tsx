"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  RefreshCw, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Video as VideoIcon, 
  Search,
  X,
  FileText,
  Loader2,
  Edit2,
  Link2,
  Copy,
  Check,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Sparkles,
  StopCircle,
  Clock,
  Zap,
  Power,
  Settings2,
  Sliders,
  Activity,
  History
} from "lucide-react";
import { VideoItem, SyncStats, AutoSyncConfig } from "@/types/video";
import { useConfirm } from "@/context/ConfirmDialogContext";

const CATEGORIES = [
  "All",
  "Shorts",
  "Barndominiums",
  "Modular Homes",
  "Prefab Cabins",
  "Tiny Homes",
  "A-Frames",
  "Building Tours",
];

export default function AdminVideoManager() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncAllProgress, setSyncAllProgress] = useState<{
    batch: number;
    totalBatchesEst: number;
    newCount: number;
    updatedCount: number;
    checkedCount: number;
    percent: number;
    statusText: string;
  } | null>(null);
  const syncCancelRef = useRef(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const confirm = useConfirm();

  // Auto-Sync Engine State
  const [autoSyncConfig, setAutoSyncConfig] = useState<AutoSyncConfig | null>(null);
  const [isUpdatingAutoSync, setIsUpdatingAutoSync] = useState(false);
  const [isTriggeringAutoSync, setIsTriggeringAutoSync] = useState(false);
  const [secondsUntilNextSync, setSecondsUntilNextSync] = useState<number | null>(null);
  const [autoSyncModalOpen, setAutoSyncModalOpen] = useState(false);
  const [pendingIntervalMinutes, setPendingIntervalMinutes] = useState(60);
  const [pendingSyncShorts, setPendingSyncShorts] = useState(true);
  const [pendingSyncScope, setPendingSyncScope] = useState<"latest" | "full">("latest");
  const isAutoSyncExecutingRef = useRef(false);

  // Server-side Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [jumpPageInput, setJumpPageInput] = useState("");

  // Modal for Add YouTube Video by URL
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pastedUrl, setPastedUrl] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchedVideo, setFetchedVideo] = useState<Partial<VideoItem> | null>(null);
  const [manualPublish, setManualPublish] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Modal for Edit SEO Slug
  const [editingSlugVideo, setEditingSlugVideo] = useState<VideoItem | null>(null);
  const [newSlugInput, setNewSlugInput] = useState("");
  const [slugError, setSlugError] = useState("");
  const [isSavingSlug, setIsSavingSlug] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Dynamic Domain configuration for copying SEO links
  const [currentDomain, setCurrentDomain] = useState("https://bombshelters.com");
  const [copyDomainMode, setCopyDomainMode] = useState<"current" | "production" | "relative">("current");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setCurrentDomain(window.location.origin);
    }
  }, []);

  const fetchAdminVideos = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      cat = selectedCategory,
      q = searchQuery,
      stat = selectedStatus
    ) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(targetPage));
        params.set("limit", String(targetLimit));
        if (cat && cat !== "All") params.set("category", cat);
        if (q && q.trim()) params.set("search", q.trim());
        if (stat && stat !== "all") params.set("status", stat);

        const res = await fetch(`/api/admin/videos?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setVideos(data.videos || []);
          setStats(data.stats || null);
          if (data.autoSync) {
            setAutoSyncConfig(data.autoSync);
            setPendingIntervalMinutes(data.autoSync.intervalMinutes || 60);
            setPendingSyncShorts(data.autoSync.syncShorts ?? true);
            setPendingSyncScope(data.autoSync.syncScope || "latest");
          }
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.totalCount ?? (data.count || 0));
          setPage(data.page || targetPage);
        }
      } catch (err) {
        console.error("Failed to load admin videos:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [page, limit, selectedCategory, searchQuery, selectedStatus]
  );

  // Debounced fetch on search query or filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminVideos(page, limit, selectedCategory, searchQuery, selectedStatus);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedStatus, limit, page]);

  const handlePageChange = (newPage: number) => {
    const valid = Math.max(1, Math.min(newPage, totalPages));
    setPage(valid);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/youtube/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncMessage({
          type: "success",
          text: `Sync Completed! ${data.newVideosCount || 0} new videos/shorts added, ${data.updatedVideosCount || 0} updated.`,
        });
        await fetchAdminVideos(1, limit, selectedCategory, searchQuery, selectedStatus);
      } else {
        setSyncMessage({
          type: "error",
          text: data.message || "Failed to sync YouTube channel.",
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: "error",
        text: err.message || "Network error while syncing.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCancelSyncAll = () => {
    syncCancelRef.current = true;
    setIsSyncingAll(false);
    setSyncMessage({
      type: "error",
      text: "Archive sync paused by user.",
    });
  };

  // Automated YouTube Sync Countdown & Trigger Engine
  useEffect(() => {
    if (!autoSyncConfig?.enabled || !autoSyncConfig.nextRunAt) {
      setSecondsUntilNextSync(null);
      return;
    }

    const checkAndTick = () => {
      const now = Date.now();
      const targetTime = new Date(autoSyncConfig.nextRunAt!).getTime();
      const diffSec = Math.floor((targetTime - now) / 1000);

      if (diffSec <= 0) {
        setSecondsUntilNextSync(0);
        // If not already in-flight, trigger automatic sync in background!
        if (
          !isAutoSyncExecutingRef.current &&
          !isSyncing &&
          !isSyncingAll &&
          !isTriggeringAutoSync
        ) {
          isAutoSyncExecutingRef.current = true;
          handleTriggerAutoSync(true).finally(() => {
            isAutoSyncExecutingRef.current = false;
          });
        }
      } else {
        setSecondsUntilNextSync(diffSec);
      }
    };

    checkAndTick();
    const intervalTimer = setInterval(checkAndTick, 1000);
    return () => clearInterval(intervalTimer);
  }, [autoSyncConfig?.enabled, autoSyncConfig?.nextRunAt, isSyncing, isSyncingAll, isTriggeringAutoSync]);

  const formatCountdown = (totalSeconds: number | null): string => {
    if (totalSeconds === null) return "Paused";
    if (totalSeconds <= 0) return "Syncing...";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  };

  const handleToggleAutoSync = async () => {
    const nextState = !autoSyncConfig?.enabled;
    setIsUpdatingAutoSync(true);
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateAutoSync",
          enabled: nextState,
        }),
      });
      const data = await res.json();
      if (data.success && data.autoSync) {
        setAutoSyncConfig(data.autoSync);
        setSyncMessage({
          type: "success",
          text: `Automatic Sync is now ${nextState ? "ACTIVE (Running on Schedule)" : "PAUSED (Manual Only)"}.`,
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: "error",
        text: err.message || "Failed to toggle automatic sync.",
      });
    } finally {
      setIsUpdatingAutoSync(false);
    }
  };

  const handleTriggerAutoSync = async (isBackgroundTrigger = false) => {
    setIsTriggeringAutoSync(true);
    if (!isBackgroundTrigger) {
      setSyncMessage(null);
    }

    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "triggerAutoSync" }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.autoSync) {
          setAutoSyncConfig(data.autoSync);
        }
        setSyncMessage({
          type: "success",
          text: `Auto-Sync Completed: +${data.syncResult?.newVideosCount || 0} new videos/shorts added, ${data.syncResult?.updatedVideosCount || 0} updated.`,
        });
        await fetchAdminVideos(page, limit, selectedCategory, searchQuery, selectedStatus);
      } else {
        setSyncMessage({
          type: "error",
          text: data.message || "Auto-sync failed to execute.",
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: "error",
        text: err.message || "Network error while triggering auto-sync.",
      });
    } finally {
      setIsTriggeringAutoSync(false);
    }
  };

  const handleSaveAutoSyncConfig = async () => {
    setIsUpdatingAutoSync(true);
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateAutoSync",
          enabled: autoSyncConfig ? autoSyncConfig.enabled : true,
          intervalMinutes: pendingIntervalMinutes,
          syncShorts: pendingSyncShorts,
          syncScope: pendingSyncScope,
        }),
      });
      const data = await res.json();
      if (data.success && data.autoSync) {
        setAutoSyncConfig(data.autoSync);
        setAutoSyncModalOpen(false);
        setSyncMessage({
          type: "success",
          text: `Automatic Sync settings updated! Frequency: Every ${data.autoSync.intervalMinutes}m.`,
        });
      } else {
        setSyncMessage({
          type: "error",
          text: data.message || "Failed to update auto-sync settings.",
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: "error",
        text: err.message || "Error updating auto-sync settings.",
      });
    } finally {
      setIsUpdatingAutoSync(false);
    }
  };

  const handleSyncAllArchive = async () => {
    setIsSyncingAll(true);
    syncCancelRef.current = false;
    setSyncMessage(null);

    let currentToken: string | undefined = undefined;
    let batch = 0;
    const estBatches = 48; // ~23,921 / 500
    let totalChecked = 0;
    let totalNew = 0;
    let totalUpdated = 0;

    try {
      while (!syncCancelRef.current) {
        batch++;
        const pct = Math.min(99, Math.round((batch / estBatches) * 100));
        setSyncAllProgress({
          batch,
          totalBatchesEst: estBatches,
          newCount: totalNew,
          updatedCount: totalUpdated,
          checkedCount: totalChecked,
          percent: pct,
          statusText: `Syncing batch #${batch}... Fetching videos and Shorts...`,
        });

        const res: Response = await fetch("/api/youtube/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageToken: currentToken,
            maxPages: 10,
          }),
        });

        const data: any = await res.json();
        if (!data.success) {
          throw new Error(data.message || `Failed at batch #${batch}`);
        }

        totalChecked += data.checkedCount || 0;
        totalNew += data.newVideosCount || 0;
        totalUpdated += data.updatedVideosCount || 0;

        setSyncAllProgress({
          batch,
          totalBatchesEst: estBatches,
          newCount: totalNew,
          updatedCount: totalUpdated,
          checkedCount: totalChecked,
          percent: pct,
          statusText: `Batch #${batch} complete: +${data.newVideosCount || 0} new, ${data.updatedVideosCount || 0} updated.`,
        });

        if (!data.hasMore || !data.nextPageToken) {
          break;
        }

        currentToken = data.nextPageToken;

        if (batch % 2 === 0) {
          await fetchAdminVideos(1, limit, selectedCategory, searchQuery, selectedStatus);
        }
      }

      if (!syncCancelRef.current) {
        setSyncAllProgress({
          batch,
          totalBatchesEst: batch,
          newCount: totalNew,
          updatedCount: totalUpdated,
          checkedCount: totalChecked,
          percent: 100,
          statusText: "All videos & Shorts successfully synchronized!",
        });
        setSyncMessage({
          type: "success",
          text: `Complete 23k+ Channel Sync Finished! Processed ${totalChecked.toLocaleString()} videos. Added ${totalNew.toLocaleString()} new, updated ${totalUpdated.toLocaleString()}.`,
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: "error",
        text: err.message || "Error occurred during full channel archive sync.",
      });
    } finally {
      setIsSyncingAll(false);
      await fetchAdminVideos(1, limit, selectedCategory, searchQuery, selectedStatus);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "togglePublish",
          id,
          isPublished: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) =>
          prev.map((v) => (v.id === id ? { ...v, isPublished: !currentStatus } : v))
        );
      }
    } catch (err) {
      console.error("Error toggling publish status:", err);
    }
  };

  const handleDeleteLocal = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete Local Video Record?",
      message: `Are you sure you want to delete the local website record for "${title}"?\n\nNote: This will not delete the video from YouTube.`,
      confirmText: "Delete Record",
      cancelText: "Keep Video",
      type: "danger",
      icon: "trash",
    });
    if (!ok) return;

    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteLocal",
          id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.error("Error deleting local record:", err);
    }
  };

  const handleFetchUrl = async () => {
    if (!pastedUrl.trim()) return;
    setIsFetchingUrl(true);
    setFetchError("");
    setFetchedVideo(null);
    try {
      const res = await fetch("/api/youtube/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pastedUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setFetchedVideo(data.video);
      } else {
        setFetchError(data.message || "Failed to fetch YouTube video details.");
      }
    } catch (err: any) {
      setFetchError(err.message || "Error fetching video URL.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSaveManualVideo = async () => {
    if (!fetchedVideo || !fetchedVideo.youtubeVideoId) return;

    try {
      const payload = {
        ...fetchedVideo,
        category: "Building Tours" as const,
        isPublished: manualPublish,
      };

      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsertManual",
          videoData: payload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAdminVideos();
        setAddModalOpen(false);
        setPastedUrl("");
        setFetchedVideo(null);
      }
    } catch (err) {
      console.error("Error saving manual video:", err);
    }
  };

  const handleOpenEditSlug = (video: VideoItem) => {
    setEditingSlugVideo(video);
    setNewSlugInput(video.slug || video.youtubeVideoId);
    setSlugError("");
  };

  const getFullVideoUrl = (slugText: string, mode: "current" | "production" | "relative" = copyDomainMode) => {
    const clean = slugText || "tour";
    if (mode === "relative") return `/videos/${clean}`;
    if (mode === "production") return `https://bombshelters.com/videos/${clean}`;
    return `${currentDomain}/videos/${clean}`;
  };

  const handleCopySlug = (slugText: string, customMode?: "current" | "production" | "relative") => {
    const mode = customMode || copyDomainMode;
    const url = getFullVideoUrl(slugText, mode);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedSlug(slugText);
      setSyncMessage({
        type: "success",
        text: `Copied to clipboard: ${url}`,
      });
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const handleSaveSlug = async () => {
    if (!editingSlugVideo) return;
    const clean = newSlugInput
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!clean || clean.length < 2) {
      setSlugError("Slug must contain at least 2 characters (letters, numbers, hyphens).");
      return;
    }

    setIsSavingSlug(true);
    setSlugError("");

    try {
      const vId = editingSlugVideo.id || editingSlugVideo.youtubeVideoId;
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSlug",
          id: vId,
          slug: clean,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === editingSlugVideo.id || v.youtubeVideoId === editingSlugVideo.youtubeVideoId
              ? { ...v, slug: clean }
              : v
          )
        );
        setEditingSlugVideo(null);
        setSyncMessage({
          type: "success",
          text: `SEO Slug updated to "/videos/${clean}". Old URLs will 301 permanently redirect to this address.`,
        });
      } else {
        setSlugError(data.message || "Failed to update slug.");
      }
    } catch (err: any) {
      setSlugError(err.message || "Failed to update slug.");
    } finally {
      setIsSavingSlug(false);
    }
  };

  return (
    <div className="space-y-6 text-[#101114] animate-in fade-in">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#101114] text-white p-6 sm:p-8 rounded-[22px] shadow-[0_20px_45px_rgba(16,17,20,0.15)] space-y-4 border border-[#101114]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e11d1d] mb-2">
              <span className={`w-2 h-2 rounded-full ${autoSyncConfig?.enabled ? "bg-emerald-400 animate-ping" : "bg-gray-400"}`} />
              <span>Automatic Channel Synchronization {autoSyncConfig?.enabled ? "• LIVE" : "• PAUSED"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              YouTube Video Manager
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl font-sans">
              Automatic background synchronization runs every {autoSyncConfig?.intervalMinutes || 60} minutes to ingest fresh YouTube uploads &amp; Shorts directly into your website catalog.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2.5 bg-white text-[#101114] hover:bg-[#e11d1d] hover:text-[#101114] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#e11d1d]" />
              <span>Add Video / Short</span>
            </button>

            <button
              onClick={() => setAutoSyncModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
              title="Configure Automatic Synchronization Schedule"
            >
              <Sliders className="w-3.5 h-3.5 text-[#e11d1d]" />
              <span>Auto-Sync Settings</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing || isSyncingAll || isTriggeringAutoSync}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 border border-white/20 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Latest (500)"}</span>
            </button>

            <button
              onClick={isSyncingAll ? handleCancelSyncAll : handleSyncAllArchive}
              disabled={isSyncing || isTriggeringAutoSync}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                isSyncingAll
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-[#e11d1d] hover:bg-[#b91c1c] text-white"
              }`}
            >
              {isSyncingAll ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  <span>Pause 23k Sync</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#b91c1c]" />
                  <span>Sync All 23k+ Videos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time 23k Archive Progress Indicator */}
        {syncAllProgress && (
          <div className="p-4 bg-white/10 border border-white/20 rounded-xl space-y-2.5 text-white animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#e11d1d] animate-spin" />
                <span className="font-bold">{syncAllProgress.statusText}</span>
              </div>
              <div className="text-[11px] text-white/80 font-mono">
                Batch {syncAllProgress.batch} / ~{syncAllProgress.totalBatchesEst} ({syncAllProgress.percent}%)
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#e11d1d] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(2, syncAllProgress.percent))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/70">
              <span>Processed: {syncAllProgress.checkedCount.toLocaleString()} videos</span>
              <span>New: +{syncAllProgress.newCount.toLocaleString()} | Updated: {syncAllProgress.updatedCount.toLocaleString()}</span>
            </div>
          </div>
        )}

        {syncMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200 ${
              syncMessage.type === "success"
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                : "bg-red-950/80 border-red-500 text-red-200"
            }`}
          >
            {syncMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{syncMessage.text}</span>
          </div>
        )}
      </div>

      {/* 2. SYNC STATS & CONFIGURATION OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-1 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Last Sync Status</div>
          <div className="text-base font-bold text-[#101114] flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${stats?.status === "error" ? "bg-red-500" : "bg-emerald-500"}`}></span>
            <span>{stats?.status === "never" ? "Never Synced" : stats?.status === "error" ? "Failed Sync" : "Active & Synced"}</span>
          </div>
          <div className="text-[11px] text-[#6b7280]">
            {stats?.lastSyncAt
              ? new Date(stats.lastSyncAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Click Sync to fetch latest videos"}
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-1 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Total Videos In Library</div>
          <div className="text-2xl font-serif font-bold text-[#101114]">{totalCount.toLocaleString()}</div>
          <div className="text-[11px] text-[#6b7280]">Total videos &amp; Shorts cataloged</div>
        </div>

        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-1 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">New Videos Added</div>
          <div className="text-2xl font-serif font-bold text-[#e11d1d]">{stats?.newVideosAdded || 0}</div>
          <div className="text-[11px] text-[#6b7280]">From last channel sync</div>
        </div>

        {/* 4. INTERACTIVE AUTO-SYNC CARD */}
        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-2 shadow-[0_12px_35px_rgba(16,24,40,0.04)] relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#e11d1d]" />
              <span>Automatic Sync</span>
            </div>
            <button
              type="button"
              onClick={handleToggleAutoSync}
              disabled={isUpdatingAutoSync}
              title={autoSyncConfig?.enabled ? "Click to Pause Auto-Sync" : "Click to Enable Auto-Sync"}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoSyncConfig?.enabled ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoSyncConfig?.enabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-sm font-bold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${autoSyncConfig?.enabled ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              <span className={autoSyncConfig?.enabled ? "text-emerald-700" : "text-gray-500"}>
                {autoSyncConfig?.enabled ? "AUTOMATIC: ON" : "PAUSED (Manual)"}
              </span>
            </div>
            {autoSyncConfig?.enabled && (
              <span className="text-[11px] font-mono font-bold text-[#e11d1d] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                {formatCountdown(secondsUntilNextSync)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#f0f2f5] text-[11px] text-[#6b7280]">
            <span>Every {autoSyncConfig?.intervalMinutes || 60}m {autoSyncConfig?.syncShorts ? "(+Shorts)" : ""}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTriggerAutoSync(false)}
                disabled={isTriggeringAutoSync || isSyncing || isSyncingAll}
                className="text-[#e11d1d] hover:text-[#b91c1c] font-bold text-[10px] uppercase tracking-wider cursor-pointer inline-flex items-center gap-1"
                title="Trigger immediate auto-sync cycle"
              >
                <RefreshCw className={`w-3 h-3 ${isTriggeringAutoSync ? "animate-spin" : ""}`} />
                <span>{isTriggeringAutoSync ? "Running..." : "Sync Now"}</span>
              </button>
              <button
                type="button"
                onClick={() => setAutoSyncModalOpen(true)}
                className="text-gray-500 hover:text-[#101114] text-[10px] font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-0.5"
                title="Configure Auto-Sync Schedule & Settings"
              >
                <Settings2 className="w-3 h-3" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTER, SEARCH & CONTROLS STRIP */}
      <div className="p-4 sm:p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-3.5 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-xs font-bold text-[#101114]">
              Video Catalog ({totalCount.toLocaleString()} {totalCount === 1 ? "video" : "videos"})
            </div>

            {/* Category Filter */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl text-xs text-[#6b7280]">
              <Filter className="w-3.5 h-3.5 text-[#e11d1d] shrink-0" />
              <span className="font-semibold text-[#101114]">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent font-medium text-[#101114] focus:outline-none cursor-pointer pr-1"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility Status Filter */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl text-xs text-[#6b7280]">
              <Eye className="w-3.5 h-3.5 text-[#e11d1d] shrink-0" />
              <span className="font-semibold text-[#101114]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as any);
                  setPage(1);
                }}
                className="bg-transparent font-medium text-[#101114] focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">All Visibility</option>
                <option value="published">Published Only</option>
                <option value="draft">Hidden / Draft</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl text-xs text-[#6b7280]">
              <span className="font-semibold text-[#101114]">Per Page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-transparent font-medium text-[#101114] focus:outline-none cursor-pointer pr-1"
              >
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            {/* Domain copy selector */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl text-xs text-[#6b7280]">
              <Globe className="w-3.5 h-3.5 text-[#e11d1d] shrink-0" />
              <span className="font-semibold text-[#101114]">Domain:</span>
              <select
                value={copyDomainMode}
                onChange={(e) => setCopyDomainMode(e.target.value as any)}
                className="bg-transparent font-medium text-[#101114] focus:outline-none cursor-pointer pr-1"
              >
                <option value="current">Current Host ({currentDomain.replace(/^https?:\/\//, "")})</option>
                <option value="production">Production (bombshelters.com)</option>
                <option value="relative">Relative Path (/videos/...)</option>
              </select>
            </div>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, slug, or ID..."
              className="w-full bg-[#f6f7f9] border border-[#d5d9e0] pl-10 pr-8 py-2.5 text-xs text-[#101114] font-medium rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. VIDEO MANAGEMENT TABLE */}
      <div className="bg-white border border-[#e7e9ee] rounded-[18px] shadow-[0_12px_35px_rgba(16,24,40,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs text-[#6b7280] flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#e11d1d]" />
            <span>Loading video database...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <VideoIcon className="w-8 h-8 text-[#6b7280] mx-auto" />
            <div className="text-sm font-serif font-bold text-[#101114]">No Videos Found</div>
            <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "All" || selectedStatus !== "all"
                ? "No videos matched your filter criteria. Try clearing filters."
                : "Click \"Sync YouTube Now\" to fetch videos from your configured YouTube channel or add a video manually."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#f6f7f9] border-b border-[#e7e9ee] text-[#6b7280] uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3.5 px-4">Video</th>
                  <th className="py-3.5 px-4">SEO Slug / URL</th>
                  <th className="py-3.5 px-4">YouTube ID</th>
                  <th className="py-3.5 px-4">Published Date</th>
                  <th className="py-3.5 px-4 text-center">Website Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e9ee]">
                {videos.map((video) => {
                  const vId = video.id || (video as any)._id;
                  const currentSlug = video.slug || video.youtubeVideoId;
                  return (
                    <tr key={vId} className="hover:bg-[#f6f7f9]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-20 aspect-[16/10] bg-[#f6f7f9] rounded-xl overflow-hidden shrink-0 border border-[#e7e9ee]">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 font-bold rounded-md">
                              {video.duration}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {Boolean(video.isShort || video.category === "Shorts") && (
                                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 rounded-md border border-red-200 shrink-0">
                                  Shorts
                                </span>
                              )}
                              <div className="font-bold text-[#101114] line-clamp-1 max-w-xs sm:max-w-md font-sans">
                                {video.title}
                              </div>
                            </div>
                            <div className="text-[11px] text-[#6b7280] mt-0.5 flex items-center gap-2">
                              <span>{video.views} • {video.date}</span>
                              <span className="text-[10px] bg-[#f6f7f9] border border-[#e7e9ee] text-[#101114] px-1.5 py-0.2 rounded font-medium">{video.category}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 max-w-[320px]">
                          <span
                            className="font-mono text-[11px] text-[#101114] bg-[#f6f7f9] border border-[#e7e9ee] px-2.5 py-1 rounded-lg truncate select-all"
                            title={getFullVideoUrl(currentSlug)}
                          >
                            /{currentSlug}
                          </span>
                          <button
                            onClick={() => handleCopySlug(currentSlug)}
                            title={`Copy URL according to domain: ${getFullVideoUrl(currentSlug)}`}
                            className={`px-2 py-1 rounded-lg border transition-all shrink-0 cursor-pointer inline-flex items-center gap-1 text-[11px] ${
                              copiedSlug === currentSlug
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                                : "bg-white text-[#6b7280] hover:text-[#101114] hover:bg-[#f6f7f9] border-[#d5d9e0]"
                            }`}
                          >
                            {copiedSlug === currentSlug ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[10px] text-emerald-700 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#6b7280]" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEditSlug(video)}
                            title="Edit SEO Slug"
                            className="p-1.5 text-[#b91c1c] hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors shrink-0 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#e11d1d]" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-[#101114]">
                        {video.youtubeVideoId}
                      </td>

                      <td className="py-3.5 px-4 text-[#6b7280] text-[11px]">
                        {video.publishedAt
                          ? new Date(video.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Recent"}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(vId, !!video.isPublished)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            video.isPublished
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-[#f6f7f9] text-[#6b7280] border border-[#d5d9e0] hover:bg-[#e7e9ee]"
                          }`}
                        >
                          {video.isPublished ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-[#6b7280]" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopySlug(currentSlug)}
                            title={`Copy SEO URL: ${getFullVideoUrl(currentSlug)}`}
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              copiedSlug === currentSlug
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : "text-[#101114] hover:text-[#e11d1d] hover:bg-[#f6f7f9] border-[#d5d9e0]"
                            }`}
                          >
                            {copiedSlug === currentSlug ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Link2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <Link
                            href={getFullVideoUrl(currentSlug, "relative")}
                            target="_blank"
                            title="View on Website"
                            className="p-2 text-[#101114] hover:text-[#e11d1d] hover:bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Open on YouTube"
                            className="p-2 text-[#101114] hover:text-[#e11d1d] hover:bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDeleteLocal(vId, video.title)}
                            title="Remove Local Record (Does not delete on YouTube)"
                            className="p-2 text-[#6b7280] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4a. PAGINATION CONTROLS BAR */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 sm:p-5 bg-[#f6f7f9] border-t border-[#e7e9ee] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6b7280]">
              Showing <span className="font-bold text-[#101114]">{((page - 1) * limit + 1).toLocaleString()}</span> to{" "}
              <span className="font-bold text-[#101114]">{Math.min(page * limit, totalCount).toLocaleString()}</span> of{" "}
              <span className="font-bold text-[#101114]">{totalCount.toLocaleString()}</span> videos
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={page <= 1}
                title="First Page"
                className="p-2 rounded-xl bg-white border border-[#d5d9e0] text-[#101114] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              {/* Prev Page */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                title="Previous Page"
                className="p-2 rounded-xl bg-white border border-[#d5d9e0] text-[#101114] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Numbered Buttons */}
              {(() => {
                const pages: (number | "...")[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (page > 3) pages.push("...");
                  const start = Math.max(2, page - 1);
                  const end = Math.min(totalPages - 1, page + 1);
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (page < totalPages - 2) pages.push("...");
                  pages.push(totalPages);
                }

                return pages.map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span key={`dots-${idx}`} className="px-2 text-xs text-gray-400 select-none">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = p === page;
                  return (
                    <button
                      key={`page-${p}`}
                      onClick={() => handlePageChange(p as number)}
                      className={`min-w-8 h-8 px-2 text-xs font-bold rounded-xl transition-all ${
                        isCurrent
                          ? "bg-[#e11d1d] text-white shadow-xs"
                          : "bg-white border border-[#d5d9e0] text-[#101114] hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                });
              })()}

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                title="Next Page"
                className="p-2 rounded-xl bg-white border border-[#d5d9e0] text-[#101114] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page >= totalPages}
                title="Last Page"
                className="p-2 rounded-xl bg-white border border-[#d5d9e0] text-[#101114] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Jump to page */}
            <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
              <span>Go to:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const num = parseInt(jumpPageInput, 10);
                    if (!isNaN(num)) {
                      handlePageChange(num);
                      setJumpPageInput("");
                    }
                  }
                }}
                placeholder={String(page)}
                className="w-14 px-2 py-1 bg-white border border-[#d5d9e0] rounded-lg text-center text-xs font-medium text-[#101114] focus:outline-none focus:ring-1 focus:ring-[#e11d1d]"
              />
              <button
                onClick={() => {
                  const num = parseInt(jumpPageInput, 10);
                  if (!isNaN(num)) {
                    handlePageChange(num);
                    setJumpPageInput("");
                  }
                }}
                className="px-2.5 py-1 bg-[#101114] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. ADD YOUTUBE VIDEO BY URL MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white border border-[#e7e9ee] rounded-[22px] p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e9ee]">
              <h3 className="text-base font-serif font-bold text-[#101114] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#e11d1d]" />
                Add YouTube Video by URL
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-xl text-[#6b7280] hover:text-[#101114] hover:bg-[#f6f7f9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6b7280] leading-relaxed">
              Paste any YouTube video or Shorts URL (e.g. <span className="font-mono text-[#101114]">https://www.youtube.com/watch?v=...</span> or <span className="font-mono text-[#101114]">https://youtube.com/shorts/...</span>) to extract metadata and publish it to the website.
            </p>

            {/* URL Input Form */}
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                className="w-full bg-[#f6f7f9] border border-[#d5d9e0] px-4 py-2.5 text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d] rounded-xl"
              />
              <button
                type="button"
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !pastedUrl.trim()}
                className="px-5 py-2.5 bg-[#e11d1d] hover:bg-[#b91c1c] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isFetchingUrl ? "Fetching..." : "Fetch"}
              </button>
            </div>

            {fetchError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* Fetched Preview */}
            {fetchedVideo && (
              <div className="p-4 bg-[#f6f7f9] border border-[#e7e9ee] rounded-[16px] space-y-3 animate-in zoom-in-95 duration-150">
                <div className="flex items-start gap-3">
                  <div className="relative w-24 aspect-[16/10] bg-gray-200 rounded-xl overflow-hidden shrink-0 border border-[#e7e9ee]">
                    <Image
                      src={fetchedVideo.thumbnail || ""}
                      alt={fetchedVideo.title || "Video Preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#101114] leading-tight font-sans">
                      {fetchedVideo.title}
                    </div>
                    <div className="text-[11px] text-[#6b7280]">
                      Duration: {fetchedVideo.duration} • ID: {fetchedVideo.youtubeVideoId}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e7e9ee]">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#101114] mb-1">
                    Website Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() => setManualPublish(!manualPublish)}
                    className={`w-full py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-colors cursor-pointer ${
                      manualPublish
                        ? "bg-[#e11d1d] text-white border-[#e11d1d]"
                        : "bg-white text-[#6b7280] border-[#d5d9e0]"
                    }`}
                  >
                    {manualPublish ? "Published" : "Hidden (Draft)"}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#e7e9ee]">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-[#f6f7f9] text-[#101114] border border-[#d5d9e0] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveManualVideo}
                disabled={!fetchedVideo}
                className="px-5 py-2 bg-[#e11d1d] hover:bg-[#b91c1c] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Publish To Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. EDIT VIDEO SEO SLUG MODAL */}
      {editingSlugVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white border border-[#e7e9ee] rounded-[22px] p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e9ee]">
              <h3 className="text-base font-serif font-bold text-[#101114] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#e11d1d]" />
                Edit Video SEO Slug
              </h3>
              <button
                onClick={() => setEditingSlugVideo(null)}
                className="p-1.5 rounded-xl text-[#6b7280] hover:text-[#101114] hover:bg-[#f6f7f9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f6f7f9] border border-[#e7e9ee] rounded-xl">
              <div className="relative w-16 aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden shrink-0 border border-[#e7e9ee]">
                <Image
                  src={editingSlugVideo.thumbnail}
                  alt={editingSlugVideo.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#101114] line-clamp-1">{editingSlugVideo.title}</div>
                <div className="text-[11px] text-[#6b7280] font-mono">YouTube ID: {editingSlugVideo.youtubeVideoId}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#101114]">
                Custom URL Slug (Kebab-case)
              </label>
              <input
                type="text"
                value={newSlugInput}
                onChange={(e) => {
                  setNewSlugInput(e.target.value);
                  setSlugError("");
                }}
                placeholder="descriptive-video-title-slug"
                className="w-full bg-[#f6f7f9] border border-[#d5d9e0] px-4 py-2.5 text-xs text-[#101114] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d1d] rounded-xl"
              />
              <div className="p-3 bg-[#f6f7f9] border border-[#e7e9ee] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#101114] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#e11d1d]" />
                    Full Link According to Domain:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopySlug(newSlugInput, "current")}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#d5d9e0] hover:bg-red-50 hover:border-red-300 text-[10px] font-bold text-[#101114] cursor-pointer inline-flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3 text-[#e11d1d]" />
                      <span>Copy Current ({currentDomain.replace(/^https?:\/\//, "")})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySlug(newSlugInput, "production")}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#d5d9e0] hover:bg-red-50 hover:border-red-300 text-[10px] font-bold text-[#101114] cursor-pointer inline-flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3 text-[#e11d1d]" />
                      <span>Copy Production</span>
                    </button>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-[#101114] font-medium break-all select-all bg-white p-2 rounded-lg border border-[#e7e9ee]">
                  {getFullVideoUrl(newSlugInput.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "slug", "current")}
                </div>
              </div>

              <p className="text-[10px] text-[#6b7280] leading-relaxed">
                Note: Updating this slug automatically creates permanent 301 redirects from the YouTube ID and any previous slug.
              </p>
            </div>

            {slugError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{slugError}</span>
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#e7e9ee]">
              <button
                type="button"
                onClick={() => setEditingSlugVideo(null)}
                className="px-4 py-2 bg-white hover:bg-[#f6f7f9] text-[#101114] border border-[#d5d9e0] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSlug}
                disabled={isSavingSlug || !newSlugInput.trim()}
                className="px-5 py-2 bg-[#e11d1d] hover:bg-[#b91c1c] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                {isSavingSlug ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save SEO Slug</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AUTOMATIC SYNC CONFIGURATION & HISTORY */}
      {autoSyncModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-[22px] max-w-xl w-full p-6 sm:p-7 space-y-6 border border-[#e7e9ee] shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e7e9ee] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#e11d1d]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#101114]">Automatic YouTube Sync Settings</h3>
                  <p className="text-xs text-[#6b7280]">Fully automated synchronization without manual intervention</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoSyncModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Master Auto-Sync Switch */}
            <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
              (autoSyncConfig?.enabled ?? true)
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}>
              <div className="space-y-0.5 pr-4">
                <div className="text-sm font-bold flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${autoSyncConfig?.enabled ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                  <span>Automatic Synchronization</span>
                </div>
                <p className="text-xs opacity-80">
                  {autoSyncConfig?.enabled
                    ? "Active: System regularly checks and ingests new uploads and Shorts in background."
                    : "Paused: Automatic background sync is disabled. Videos will only sync when manually requested."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleAutoSync}
                disabled={isUpdatingAutoSync}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoSyncConfig?.enabled ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoSyncConfig?.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Sync Frequency */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#101114]">
                Sync Frequency Interval
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: "15 Min", val: 15 },
                  { label: "30 Min", val: 30 },
                  { label: "1 Hour", val: 60 },
                  { label: "6 Hours", val: 360 },
                  { label: "24 Hours", val: 1440 },
                ].map((item) => {
                  const isSelected = pendingIntervalMinutes === item.val;
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setPendingIntervalMinutes(item.val)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#101114] text-white border-[#101114] shadow-xs"
                          : "bg-white text-[#101114] border-[#d5d9e0] hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#6b7280]">
                Every {pendingIntervalMinutes} minutes, the background runner scans the YouTube channel for new items.
              </p>
            </div>

            {/* Content Options */}
            <div className="space-y-3 pt-2 border-t border-[#e7e9ee]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#101114]">
                Content Options
              </label>

              <label className="flex items-start gap-3 p-3 bg-[#f6f7f9] border border-[#e7e9ee] rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={pendingSyncShorts}
                  onChange={(e) => setPendingSyncShorts(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#e11d1d] rounded border-[#d5d9e0] focus:ring-[#e11d1d]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#101114] block">Include YouTube Shorts</span>
                  <span className="text-[#6b7280] block text-[11px] mt-0.5">
                    Automatically tag videos &le; 60 seconds as Shorts and categorize them appropriately.
                  </span>
                </div>
              </label>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#101114]">Sync Scope:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className={`p-3 rounded-xl border cursor-pointer text-xs transition-colors flex items-start gap-2.5 ${
                    pendingSyncScope === "latest" ? "bg-red-50/60 border-red-300" : "bg-white border-[#d5d9e0]"
                  }`}>
                    <input
                      type="radio"
                      name="syncScope"
                      checked={pendingSyncScope === "latest"}
                      onChange={() => setPendingSyncScope("latest")}
                      className="mt-0.5 text-[#e11d1d]"
                    />
                    <div>
                      <span className="font-bold text-[#101114] block">Latest Uploads &amp; Shorts</span>
                      <span className="text-[11px] text-[#6b7280]">Fetches the most recent ~100 uploads. Fast, reliable, low API quota.</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border cursor-pointer text-xs transition-colors flex items-start gap-2.5 ${
                    pendingSyncScope === "full" ? "bg-red-50/60 border-red-300" : "bg-white border-[#d5d9e0]"
                  }`}>
                    <input
                      type="radio"
                      name="syncScope"
                      checked={pendingSyncScope === "full"}
                      onChange={() => setPendingSyncScope("full")}
                      className="mt-0.5 text-[#e11d1d]"
                    />
                    <div>
                      <span className="font-bold text-[#101114] block">Continuous Deep Crawl</span>
                      <span className="text-[11px] text-[#6b7280]">Fetches up to 250 videos per cycle to continuously refresh older videos.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Status Details */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280] font-medium">Next Automatic Run:</span>
                <span className="font-bold text-[#101114] font-mono">
                  {autoSyncConfig?.enabled ? formatCountdown(secondsUntilNextSync) : "Paused"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280] font-medium">Last Run Time:</span>
                <span className="text-[#101114]">
                  {autoSyncConfig?.lastRunAt
                    ? new Date(autoSyncConfig.lastRunAt).toLocaleString()
                    : "No runs yet"}
                </span>
              </div>
              {autoSyncConfig?.lastRunMessage && (
                <div className="text-[11px] text-[#6b7280] border-t border-gray-200 pt-1.5">
                  <span className="font-medium text-[#101114]">Status:</span> {autoSyncConfig.lastRunMessage}
                </div>
              )}
            </div>

            {/* Recent History Logs */}
            {autoSyncConfig?.history && autoSyncConfig.history.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#e7e9ee]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#101114] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#e11d1d]" />
                  <span>Recent Automatic Sync Logs</span>
                </div>
                <div className="max-h-32 overflow-y-auto rounded-xl border border-[#e7e9ee] divide-y divide-[#e7e9ee] text-[11px]">
                  {autoSyncConfig.history.slice(0, 5).map((log, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${log.status === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
                        <span className="font-mono text-gray-600">
                          {new Date(log.executedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <span className="font-medium text-[#101114]">
                        +{log.newVideos} new, {log.updatedVideos} updated
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#e7e9ee]">
              <button
                type="button"
                onClick={() => handleTriggerAutoSync(false)}
                disabled={isTriggeringAutoSync || isSyncing || isSyncingAll}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#101114] text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTriggeringAutoSync ? "animate-spin" : ""}`} />
                <span>{isTriggeringAutoSync ? "Triggering..." : "Test Run Auto-Sync Now"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoSyncModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-[#101114] border border-[#d5d9e0] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAutoSyncConfig}
                  disabled={isUpdatingAutoSync}
                  className="px-5 py-2 bg-[#e11d1d] hover:bg-[#b91c1c] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  {isUpdatingAutoSync ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Auto-Sync Settings</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
