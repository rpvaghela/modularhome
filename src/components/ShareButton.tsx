"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Share2,
  Copy,
  Check,
  X,
  Mail,
  Smartphone,
} from "lucide-react";

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
  variant?: "button" | "icon" | "outline" | "badge" | "hero" | "secondary";
  label?: string;
  className?: string;
  iconClassName?: string;
  buttonTitle?: string;
}

// ─── Social network definitions ───────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    color: "bg-[#25D366] hover:bg-[#20ba59] text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-12.416c-5.514 0-10 4.486-10 10 0 1.764.457 3.424 1.258 4.872l-1.336 4.886 5.01-1.314c1.405.768 3.008 1.198 4.71 1.198 5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.2c-1.503 0-2.915-.403-4.137-1.107l-.297-.172-2.968.779.792-2.894-.188-.3c-.77-1.233-1.2-2.678-1.2-4.184 0-4.521 3.679-8.2 8.2-8.2 4.522 0 8.2 3.679 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
  },
  {
    name: "Facebook",
    color: "bg-[#1877F2] hover:bg-[#166fe5] text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X (Twitter)",
    color: "bg-[#0f1419] hover:bg-black text-white",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${title} on ModularHome.com`)}`,
  },
  {
    name: "Pinterest",
    color: "bg-[#E60023] hover:bg-[#c9001e] text-white",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
    getUrl: (url: string, title: string, img?: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(img || "")}&description=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    color: "bg-[#0A66C2] hover:bg-[#084e96] text-white",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Email",
    color: "bg-[#475569] hover:bg-[#334155] text-white",
    icon: <Mail className="w-4 h-4" />,
    getUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(`Check out: ${title}`)}&body=${encodeURIComponent(`Hi,\n\nI thought you might be interested in the ${title} on ModularHome.com:\n\n${url}\n\nPrecision engineered modular and steel home design.`)}`,
  },
];

// ─── Portal modal ─────────────────────────────────────────────────────────────
interface ShareModalProps {
  item: ShareData;
  shareUrl: string;
  onClose: () => void;
}

function ShareModal({ item, shareUrl, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);

    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCopyLink = useCallback(async () => {
    try {
      const urlToCopy = shareUrl || window.location.href;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const ta = document.createElement("textarea");
        ta.value = urlToCopy;
        ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description || `Check out ${item.title} on ModularHome.com`,
          url: shareUrl || window.location.href,
        });
        onClose();
      } catch (err) {
        if ((err as Error).name !== "AbortError") console.error(err);
      }
    }
  }, [item, shareUrl, onClose]);

  // Stop all clicks inside the dialog from reaching any parent / backdrop handler
  const stopBubble = (e: React.MouseEvent) => e.stopPropagation();

  if (!mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
      style={{ isolation: "isolate" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      {/* Backdrop — click closes */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog — clicks DO NOT propagate to backdrop */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#e7e9ee] p-6 sm:p-7 z-10 overflow-hidden text-[#101114]"
        onClick={stopBubble}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#fcb907]/20 flex items-center justify-center text-[#d97706]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="share-modal-title"
                className="text-base sm:text-lg font-black tracking-tight text-[#101114]"
              >
                Share This Model
              </h3>
              <p className="text-[11px] text-[#6b7280] font-medium">
                Send to a friend, contractor, or save for later
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close share modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Mini preview ── */}
        <div className="my-4 p-3 rounded-2xl bg-[#f6f7f9] border border-[#e7e9ee] flex items-center gap-3.5">
          {item.image && (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-white">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {item.category && (
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#d97706] block truncate">
                {item.category}
              </span>
            )}
            <h4 className="text-xs sm:text-sm font-black text-[#101114] truncate">
              {item.title}
            </h4>
            {item.price && (
              <span className="text-xs font-black text-[#d97706] block mt-0.5">
                {typeof item.price === "number"
                  ? `$${item.price.toLocaleString()}`
                  : item.price}
              </span>
            )}
          </div>
        </div>

        {/* ── Copy link ── */}
        <div className="space-y-1.5 mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">
            Copy Direct Link
          </label>
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-stone-50 border border-[#e7e9ee] focus-within:border-[#fcb907] focus-within:ring-2 focus-within:ring-[#fcb907]/20 transition-all">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="bg-transparent text-xs text-stone-700 w-full outline-none font-mono select-all truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-[#0f1218] hover:bg-[#fcb907] text-white hover:text-[#101114]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] font-semibold text-emerald-600">
              ✓ Link copied to clipboard! Ready to paste.
            </p>
          )}
        </div>

        {/* ── Social grid ── */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] block">
            Share via Social &amp; Apps
          </span>
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {SOCIAL_LINKS.map((social) => {
              const href = social.getUrl(shareUrl, item.title, item.image);
              return (
                <a
                  key={social.name}
                  href={href}
                  target={social.name === "Email" ? undefined : "_blank"}
                  rel={social.name === "Email" ? undefined : "noopener noreferrer"}
                  onClick={(e) => {
                    // Prevent click from bubbling to the dialog stopBubble OR backdrop
                    e.stopPropagation();
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${social.color}`}
                >
                  <div className="mb-1">{social.icon}</div>
                  <span className="text-[11px] font-bold tracking-tight">
                    {social.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Native share ── */}
        {canNativeShare && (
          <div className="mt-4 pt-4 border-t border-[#f1f3f7]">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#d97706]" />
              <span>Open System Share Menu</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ← KEY FIX: render outside ALL ancestors via portal
  return createPortal(modal, document.body);
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function ShareButton({
  item,
  variant = "button",
  label = "Share",
  className = "",
  iconClassName = "w-4 h-4",
  buttonTitle = "Share this model",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Build absolute URL once on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (item.url) {
      if (item.url.startsWith("http://") || item.url.startsWith("https://")) {
        setShareUrl(item.url);
      } else {
        setShareUrl(
          `${window.location.origin}${item.url.startsWith("/") ? "" : "/"}${item.url}`
        );
      }
    } else {
      setShareUrl(window.location.href);
    }
  }, [item.url]);

  const handleOpen = (e: React.MouseEvent) => {
    // Stop event fully so no ancestor Link / card handler fires
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = useCallback(() => setIsOpen(false), []);

  // ── Trigger variants ──────────────────────────────────────────────────────
  const triggerBase =
    "cursor-pointer transition-all duration-200 flex items-center justify-center";

  const triggers: Record<string, React.ReactNode> = {
    icon: (
      <button
        type="button"
        onClick={handleOpen}
        title={buttonTitle}
        aria-label={buttonTitle}
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-[#fcb907] text-[#101114] backdrop-blur-md border border-white/70 hover:border-[#fcb907] shadow-sm hover:shadow-md gap-0 ${triggerBase} group ${className}`}
      >
        <Share2
          className={`${iconClassName} group-hover:scale-110 transition-transform duration-200`}
        />
      </button>
    ),
    badge: (
      <button
        type="button"
        onClick={handleOpen}
        title={buttonTitle}
        aria-label={buttonTitle}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold ${triggerBase} ${className}`}
      >
        <Share2 className={iconClassName} />
        <span>{label}</span>
      </button>
    ),
    outline: (
      <button
        type="button"
        onClick={handleOpen}
        title={buttonTitle}
        aria-label={buttonTitle}
        className={`btn-outline py-2.5 px-3.5 text-xs font-bold rounded-[9px] gap-1.5 hover:border-[#fcb907] hover:text-[#d97706] ${triggerBase} ${className}`}
      >
        <Share2 className={`${iconClassName} text-[#d97706]`} />
        <span>{label}</span>
      </button>
    ),
    hero: (
      <button
        type="button"
        onClick={handleOpen}
        title={buttonTitle}
        aria-label={buttonTitle}
        className={`gap-2 px-3.5 py-1.5 rounded-lg bg-white/90 hover:bg-[#fcb907] text-[#101114] border border-[#e7e9ee] hover:border-[#fcb907] text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${triggerBase} ${className}`}
      >
        <Share2 className={iconClassName} />
        <span>{label}</span>
      </button>
    ),
    secondary: (
      <button
        type="button"
        onClick={handleOpen}
        title={buttonTitle}
        aria-label={buttonTitle}
        className={`p-2 text-stone-700 bg-stone-100 hover:bg-stone-200 hover:text-[#d97706] rounded-xl ${triggerBase} ${className}`}
      >
        <Share2 className={iconClassName} />
      </button>
    ),
    button: (
      <button
        type="button"
        onClick={handleOpen}
        title={buttonTitle}
        aria-label={buttonTitle}
        className={`gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#fcb907] text-[#101114] text-xs font-bold shadow-sm ${triggerBase} ${className}`}
      >
        <Share2 className={iconClassName} />
        <span>{label}</span>
      </button>
    ),
  };

  const trigger = triggers[variant] ?? triggers.button;

  return (
    <>
      {trigger}
      {isOpen && (
        <ShareModal item={item} shareUrl={shareUrl} onClose={handleClose} />
      )}
    </>
  );
}
