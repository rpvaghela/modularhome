"use client";

import { useState, useEffect } from "react";
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
  Sparkles, 
  Search,
  X,
  FileText,
  Loader2,
  Edit2,
  Link2,
  Copy,
  Check
} from "lucide-react";
import { VideoItem, SyncStats } from "@/types/video";
import { useConfirm } from "@/context/ConfirmDialogContext";

export default function AdminVideoManager() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const confirm = useConfirm();

  // AI Blog generation state
  const [generatingBlogId, setGeneratingBlogId] = useState<string | null>(null);
  const [blogGenNotice, setBlogGenNotice] = useState<{ type: "success" | "error" | "duplicate"; text: string; link?: string } | null>(null);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/videos");
        const data = await res.json();
        if (isMounted && data.success) {
          setVideos(data.videos || []);
          setStats(data.stats || null);
        }
      } catch (err) {
        console.error("Failed to load admin videos:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchAdminVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error("Failed to load admin videos:", err);
    } finally {
      setIsLoading(false);
    }
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
          text: `Sync Completed! ${data.newVideosCount || 0} new videos added, ${data.updatedVideosCount || 0} updated.`,
        });
        await fetchAdminVideos();
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

  const handleGenerateAiBlog = async (video: VideoItem) => {
    const vId = video.youtubeVideoId;
    if (!vId) return;

    setGeneratingBlogId(vId);
    setBlogGenNotice(null);

    try {
      const res = await fetch("/api/admin/blogs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeVideoId: vId,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          channelTitle: video.channelTitle || "ModularHome Video Hub",
          status: "DRAFT",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setBlogGenNotice({
          type: "success",
          text: `SEO Article draft created: "${json.data?.title}"`,
          link: `/admin/blogs/${json.data?.id}`,
        });
      } else if (json.duplicate) {
        setBlogGenNotice({
          type: "duplicate",
          text: json.error?.message || `A blog article already exists for video ${vId}.`,
          link: json.existingBlog?.id ? `/admin/blogs/${json.existingBlog.id}` : "/admin/blogs",
        });
      } else {
        setBlogGenNotice({
          type: "error",
          text: json.error?.message || "Failed to generate AI blog article.",
        });
      }
    } catch (err: any) {
      setBlogGenNotice({
        type: "error",
        text: err.message || "Network error while generating AI blog.",
      });
    } finally {
      setGeneratingBlogId(null);
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

  const handleCopySlug = (slugText: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://modularhome.com/videos/${slugText}`);
      setCopiedSlug(slugText);
      setTimeout(() => setCopiedSlug(null), 2000);
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

  const filteredVideos = videos.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      v.title.toLowerCase().includes(q) ||
      v.youtubeVideoId.toLowerCase().includes(q) ||
      (v.description && v.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 text-[#101114] animate-in fade-in">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-[#101114] text-white p-6 sm:p-8 rounded-[22px] shadow-[0_20px_45px_rgba(16,17,20,0.15)] space-y-4 border border-[#101114]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#fcb907] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#fcb907]" />
              <span>Automatic Channel Synchronization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              YouTube Video Manager
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl font-sans">
              Automatically sync full-length videos from your YouTube channel directly to your website. Main video uploads appear automatically without manual website post creation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2.5 bg-white text-[#101114] hover:bg-[#fcb907] hover:text-[#101114] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#d97706]" />
              <span>Add Video</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-5 py-2.5 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync YouTube Now"}</span>
            </button>
          </div>
        </div>

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

        {blogGenNotice && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
              blogGenNotice.type === "success"
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                : blogGenNotice.type === "duplicate"
                ? "bg-amber-950/80 border-amber-500 text-amber-200"
                : "bg-red-950/80 border-red-500 text-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {blogGenNotice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : blogGenNotice.type === "duplicate" ? (
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{blogGenNotice.text}</span>
            </div>
            {blogGenNotice.link && (
              <Link
                href={blogGenNotice.link}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold uppercase transition-colors shrink-0"
              >
                Open Article →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 2. SYNC STATS & CONFIGURATION OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-1 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Last Sync Status</div>
          <div className="text-base font-bold text-[#101114] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fcb907]"></span>
            <span>{stats?.status === "never" ? "Never Synced" : stats?.status === "error" ? "Failed Sync" : "Active & Synced"}</span>
          </div>
          <div className="text-[11px] text-[#6b7280]">
            {stats?.lastSyncAt
              ? new Date(stats.lastSyncAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Click Sync to fetch latest videos"}
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-1 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Videos Found</div>
          <div className="text-2xl font-serif font-bold text-[#101114]">{videos.length}</div>
          <div className="text-[11px] text-[#6b7280]">{videos.filter(v => v.isPublished).length} published on website</div>
        </div>

        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-1 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">New Videos Added</div>
          <div className="text-2xl font-serif font-bold text-[#d97706]">{stats?.newVideosAdded || 0}</div>
          <div className="text-[11px] text-[#6b7280]">From last channel sync</div>
        </div>

        <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] space-y-1 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Auto Sync Mode</div>
          <div className="text-base font-bold text-[#d97706]">ON (Scheduled)</div>
          <div className="text-[11px] text-[#6b7280]">Frequency: Every 1 Hour</div>
        </div>
      </div>

      {/* 3. SEARCH STRIP */}
      <div className="p-5 bg-white border border-[#e7e9ee] rounded-[18px] flex items-center justify-between gap-4 shadow-[0_12px_35px_rgba(16,24,40,0.04)]">
        <div className="text-xs font-bold text-[#101114]">
          Video Catalog ({filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"})
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or video ID..."
            className="w-full bg-[#f6f7f9] border border-[#d5d9e0] pl-10 pr-4 py-2.5 text-xs text-[#101114] font-medium rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907]"
          />
        </div>
      </div>

      {/* 4. VIDEO MANAGEMENT TABLE */}
      <div className="bg-white border border-[#e7e9ee] rounded-[18px] shadow-[0_12px_35px_rgba(16,24,40,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs text-[#6b7280] flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#fcb907]" />
            <span>Loading video database...</span>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <VideoIcon className="w-8 h-8 text-[#6b7280] mx-auto" />
            <div className="text-sm font-serif font-bold text-[#101114]">No Videos Found</div>
            <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
              Click &ldquo;Sync YouTube Now&rdquo; to fetch videos from your configured YouTube channel or add a video manually.
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
                {filteredVideos.map((video) => {
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
                              className="object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 font-bold rounded-md">
                              {video.duration}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-[#101114] line-clamp-1 max-w-xs sm:max-w-md font-sans">
                              {video.title}
                            </div>
                            <div className="text-[11px] text-[#6b7280] mt-0.5">
                              {video.views} • {video.date}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 max-w-[280px]">
                          <span className="font-mono text-[11px] text-[#101114] bg-[#f6f7f9] border border-[#e7e9ee] px-2 py-1 rounded-lg truncate" title={`/videos/${currentSlug}`}>
                            /{currentSlug}
                          </span>
                          <button
                            onClick={() => handleCopySlug(currentSlug)}
                            title="Copy URL"
                            className="p-1 text-[#6b7280] hover:text-[#101114] hover:bg-[#f6f7f9] rounded-md transition-colors shrink-0 cursor-pointer"
                          >
                            {copiedSlug === currentSlug ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEditSlug(video)}
                            title="Edit SEO Slug"
                            className="p-1 text-[#b45309] hover:bg-amber-50 rounded-md transition-colors shrink-0 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#d97706]" />
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
                            onClick={() => handleGenerateAiBlog(video)}
                            disabled={generatingBlogId === video.youtubeVideoId}
                            title="Generate SEO Article from Video"
                            className="p-2 text-[#b45309] hover:bg-amber-50 border border-amber-200 bg-amber-50/50 rounded-xl transition-all inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            {generatingBlogId === video.youtubeVideoId ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d97706]" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                            )}
                            <span className="hidden md:inline">AI Blog</span>
                          </button>

                          <Link
                            href={`/videos/${video.slug || video.youtubeVideoId}`}
                            target="_blank"
                            title="View on Website"
                            className="p-2 text-[#101114] hover:text-[#d97706] hover:bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Open on YouTube"
                            className="p-2 text-[#101114] hover:text-[#d97706] hover:bg-[#f6f7f9] border border-[#d5d9e0] rounded-xl transition-colors"
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
      </div>

      {/* 5. ADD YOUTUBE VIDEO BY URL MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white border border-[#e7e9ee] rounded-[22px] p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e9ee]">
              <h3 className="text-base font-serif font-bold text-[#101114] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#fcb907]" />
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
              Paste a YouTube video URL (e.g. <span className="font-mono text-[#101114]">https://www.youtube.com/watch?v=...</span>) to extract metadata and publish it to the website.
            </p>

            {/* URL Input Form */}
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#f6f7f9] border border-[#d5d9e0] px-4 py-2.5 text-xs text-[#101114] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] rounded-xl"
              />
              <button
                type="button"
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !pastedUrl.trim()}
                className="px-5 py-2.5 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
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
                        ? "bg-[#fcb907] text-[#101114] border-[#fcb907]"
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
                className="px-5 py-2 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
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
                <Edit2 className="w-4 h-4 text-[#fcb907]" />
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
                className="w-full bg-[#f6f7f9] border border-[#d5d9e0] px-4 py-2.5 text-xs text-[#101114] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fcb907] rounded-xl"
              />
              <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
                <span>Live URL:</span>
                <span className="font-mono text-[#101114] font-bold truncate">
                  https://modularhome.com/videos/{newSlugInput.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "..."}
                </span>
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
                className="px-5 py-2 bg-[#fcb907] hover:bg-[#e5a706] text-[#101114] text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs inline-flex items-center gap-1.5"
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
    </div>
  );
}
