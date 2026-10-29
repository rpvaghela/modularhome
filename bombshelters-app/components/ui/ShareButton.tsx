"use client";

import React, { useState, useEffect } from "react";
import { Share2, Copy, Check, X, Mail } from "lucide-react";

export interface ShareData {
  title: string;
  url?: string;
  description?: string;
  image?: string;
  category?: string;
  price?: string | number;
}

interface ShareButtonProps {
  item: ShareData;
  variant?: "button" | "icon" | "outline";
  label?: string;
  className?: string;
  buttonTitle?: string;
}

const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    color: "bg-[#25D366] hover:bg-[#20ba59] text-white",
    getUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
  },
  {
    name: "Facebook",
    color: "bg-[#1877F2] hover:bg-[#166fe5] text-white",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X (Twitter)",
    color: "bg-[#0f1419] hover:bg-black text-white",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${title} on BombShelters.com`)}`,
  },
  {
    name: "LinkedIn",
    color: "bg-[#0A66C2] hover:bg-[#084e96] text-white",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export function ShareButton({
  item,
  variant = "outline",
  label = "Share",
  className = "",
  buttonTitle,
}: ShareButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(item.url ? `${window.location.origin}${item.url.startsWith("/") ? "" : "/"}${item.url}` : window.location.href);
    }
  }, [item.url]);

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: currentUrl,
        });
        return;
      } catch (err) {
        // User cancelled or unsupported, fallback to modal
      }
    }
    setModalOpen(true);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {variant === "icon" && (
        <button
          type="button"
          onClick={handleShareClick}
          title={buttonTitle || `Share ${item.title}`}
          aria-label={buttonTitle || `Share ${item.title}`}
          className={`w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#0a0a0a] hover:text-[#e11d1d] shadow-md backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${className}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          onClick={handleShareClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#0a0a0a] hover:bg-[#e11d1d] text-white text-xs font-semibold transition-colors cursor-pointer ${className}`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      )}

      {variant === "outline" && (
        <button
          type="button"
          onClick={handleShareClick}
          className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[4px] border border-gray-300 hover:border-[#0a0a0a] hover:bg-gray-50 text-xs font-bold text-[#0a0a0a] transition-colors cursor-pointer ${className}`}
        >
          <Share2 className="w-3.5 h-3.5 text-[#e11d1d]" />
          <span>{label}</span>
        </button>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative max-w-md w-full bg-white border border-gray-200 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#e11d1d]" />
                <h3 className="font-display font-bold text-base uppercase text-[#0a0a0a]">
                  Share Shelter Specs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-[#0a0a0a] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-gray-600 font-medium">
                {item.title}
              </p>

              {/* Copy URL bar */}
              <div className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-200 bg-gray-50">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 min-w-0 bg-transparent px-2 text-xs text-gray-700 select-all outline-hidden"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#e11d1d] hover:bg-[#c81414] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Social Channels */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Share via
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_LINKS.map((s) => (
                    <a
                      key={s.name}
                      href={s.getUrl(currentUrl, item.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${s.color}`}
                    >
                      <span>{s.name}</span>
                    </a>
                  ))}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Check out: ${item.title}`)}&body=${encodeURIComponent(`Hi,\n\nI thought you might be interested in the ${item.title} on BombShelters.com:\n\n${currentUrl}\n\nEngineered steel underground shelters and fortified cabins.`)}`}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gray-700 hover:bg-gray-800 text-white text-xs font-semibold col-span-2 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Share via Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

