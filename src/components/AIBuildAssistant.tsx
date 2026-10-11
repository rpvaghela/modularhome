"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  actionButtons?: { label: string; href?: string; query?: string }[];
}

export default function AIBuildAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Welcome to ModularHome.com. I am your architectural housing advisor. What kind of home or building project are you envisioning?",
      timestamp: "Just now",
      actionButtons: [
        { label: "Modular & Prefab Homes", query: "Tell me about your modular and prefab homes" },
        { label: "Modern Barndominiums", query: "Tell me about your residential barndominiums" },
        { label: "Cabins & ADUs", query: "What options do you have for cabins and ADUs?" },
        { label: "Estimate Build Cost", href: "/quote" },
        { label: "Upload Custom Floor Plan", href: "/upload-floor-plan" },
      ],
    },
  ]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateBotReply = (userQuery: string): { reply: string; actionButtons?: { label: string; href?: string; query?: string }[] } => {
    const q = userQuery.toLowerCase();

    if (q.includes("cabin") || q.includes("tiny") || q.includes("snow") || q.includes("mountain") || q.includes("off-grid")) {
      return {
        reply: "Our featured cabins and tiny homes include 'The Homestead Cabin' (1,200 sq ft, starting at $49,900) and 'The Retreat' luxury tiny home (650 sq ft, starting at $39,900), both factory engineered with precision.",
        actionButtons: [
          { label: "The Homestead Cabin", href: "/cabins/the-homestead-cabin" },
          { label: "The Retreat Tiny Home", href: "/tiny-homes/the-retreat" },
          { label: "The Yellowstone Ranch", href: "/modular-homes/the-yellowstone" },
        ],
      };
    }

    if (q.includes("barndominium") || q.includes("residential") || q.includes("living") || q.includes("house")) {
      return {
        reply: "Our Barndominiums blend steel-reinforced framing with open Scandinavian luxury interiors. Our top residential designs include 'The Lancaster' (2,200 sq ft, starting at $64,500) and 'The Hawthorne' (2,400 sq ft with wraparound porch).",
        actionButtons: [
          { label: "View The Lancaster", href: "/barndominiums/the-lancaster" },
          { label: "View The Hawthorne", href: "/barndominiums/the-hawthorne" },
          { label: "Calculate Quote", href: "/quote" },
        ],
      };
    }

    if (q.includes("quote") || q.includes("cost") || q.includes("price") || q.includes("estimate") || q.includes("sq ft")) {
      return {
        reply: "Modular home packages typically range from $25 to $45 per sq ft for factory-engineered components, with finished home packages ranging from $120 to $180 per sq ft. You can calculate a customized breakdown using our interactive tool:",
        actionButtons: [
          { label: "Launch Instant Quote Tool →", href: "/quote" },
          { label: "Submit Floor Plan For Exact Bids", href: "/upload-floor-plan" },
        ],
      };
    }

    if (q.includes("workshop") || q.includes("commercial") || q.includes("shop") || q.includes("storage") || q.includes("crane") || q.includes("shed")) {
      return {
        reply: "For workshops, commercial space, and multi-purpose buildings, take a look at 'The Timberline Workshop' (3,000 sq ft clear-span) and 'The Artisan Shed' (480 sq ft versatile studio kit).",
        actionButtons: [
          { label: "Explore The Timberline", href: "/commercial-modular-buildings/the-timberline-workshop" },
          { label: "Explore The Artisan Shed", href: "/house-kits/the-artisan-shed" },
        ],
      };
    }

    return {
      reply: "Thank you for reaching out to ModularHome.com. We offer factory-built housing solutions from 650 sq ft cabins to 5,000+ sq ft custom estates. Would you like to explore existing models or build a custom quote?",
      actionButtons: [
        { label: "Browse All Models", href: "/buildings" },
        { label: "Request a Quote", href: "/quote" },
        { label: "Contact Us", href: "/contact" },
      ],
    };
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: "Just now",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          userContext: { source: "AI_BUILD_ASSISTANT" },
        }),
      });

      const json = await res.json();
      if (json.success && json.reply) {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: json.reply,
          timestamp: "Just now",
          actionButtons: json.actionButtons || [
            { label: "Instant Quote Wizard", href: "/quote" },
            { label: "Browse Catalog", href: "/buildings" },
          ],
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const fallback = generateBotReply(text);
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: fallback.reply,
          timestamp: "Just now",
          actionButtons: fallback.actionButtons,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch {
      const fallback = generateBotReply(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: fallback.reply,
        timestamp: "Just now",
        actionButtons: fallback.actionButtons,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatChatMessage = (content: string) => {
    if (!content) return null;
    const lines = content.split("\n");
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={lineIdx} className="h-1.5" />;
      }

      // Check header
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={lineIdx} className="font-bold text-[13px] text-stone-900 mt-1 mb-1 font-serif">
            {trimmed.replace(/^###\s+/, "")}
          </h4>
        );
      }

      // Check blockquote
      if (trimmed.startsWith("> ")) {
        return (
          <div
            key={lineIdx}
            className="p-2 my-1 bg-amber-50 border-l-2 border-[#fcb907] rounded-r-lg text-[11px] text-stone-700 italic font-medium"
          >
            {trimmed.replace(/^>\s+/, "")}
          </div>
        );
      }

      // Check bullet list item
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const itemText = trimmed.replace(/^[\*\-]\s+/, "");
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 my-0.5 pl-1">
            <span className="text-[#fcb907] font-black text-xs leading-none mt-1">•</span>
            <span className="flex-1">{renderInlineMarkdown(itemText)}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="my-0.5 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    // Replace **bold** and [links](url)
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={pIdx} className="font-extrabold text-stone-950">{part.slice(2, -2)}</strong>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <Link
            key={pIdx}
            href={linkMatch[2]}
            onClick={() => setIsOpen(false)}
            className="text-[#d97706] font-bold hover:underline inline-flex items-center gap-0.5"
          >
            <span>{linkMatch[1]}</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <aside aria-label="AI Build Assistant Widget">
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Housing Assistant"
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
          isOpen
            ? "bg-[#111317] text-[#fcb907] ring-2 ring-[#fcb907]/40 shadow-black/40"
            : "bg-[#fcb907] hover:bg-[#e5a706] text-[#111317] hover:scale-105 shadow-amber-500/30"
        }`}
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform duration-200" />
        ) : (
          <>
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider hidden sm:inline-block pr-1">
              Housing Advisor
            </span>
          </>
        )}
      </button>

      {/* Slide-over Drawer / Chat Window */}
      {isOpen && (
        <div
          onWheel={(e) => {
            // Forward mouse wheel scrolling from anywhere in the chat modal to the messages feed
            if (messagesContainerRef.current && !messagesContainerRef.current.contains(e.target as Node)) {
              messagesContainerRef.current.scrollTop += e.deltaY;
            }
          }}
          className="fixed bottom-[74px] sm:bottom-22 right-3 sm:right-6 z-[999] w-[calc(100vw-24px)] sm:w-[410px] md:w-[430px] h-[520px] sm:h-[560px] max-h-[calc(100dvh-95px)] bg-white border border-stone-200/90 rounded-2xl sm:rounded-[22px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-[#111317] text-white px-4 sm:px-5 py-3.5 border-b border-white/10 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 px-2 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                <Image
                  src="/newmodularlogo.png"
                  alt="ModularHome.com"
                  width={80}
                  height={22}
                  className="h-4.5 w-auto object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  Housing Advisor
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#fcb907] text-[#111317] font-extrabold rounded-full">AI</span>
                </div>
                <div className="text-[10px] text-stone-300 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online • Live Project Quotation
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div
            ref={messagesContainerRef}
            tabIndex={0}
            role="region"
            aria-label="Chat messages conversation history"
            className="flex-1 p-3.5 sm:p-4 overflow-y-auto overscroll-contain space-y-3.5 bg-[#F9F9FB] custom-chat-scrollbar focus:outline-none"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#111317] text-white font-medium rounded-br-xs"
                      : "bg-white border border-stone-200/80 text-stone-800 rounded-bl-xs"
                  }`}
                >
                  {msg.sender === "bot" ? formatChatMessage(msg.text) : msg.text}
                </div>

                {/* Render quick Action Buttons if provided by the bot */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                    {msg.actionButtons.map((btn, idx) =>
                      btn.href ? (
                        <Link
                          key={idx}
                          href={btn.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-amber-50 hover:bg-[#fcb907] text-[#111317] border border-amber-200/90 rounded-full transition-all shadow-2xs hover:shadow-xs"
                        >
                          <span>{btn.label}</span>
                          <ArrowRight className="w-3 h-3 text-[#111317]" />
                        </Link>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => handleSend(btn.query || btn.label)}
                          className="px-3 py-1.5 text-[11px] font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-full transition-colors text-left shadow-2xs cursor-pointer"
                        >
                          {btn.label}
                        </button>
                      )
                    )}
                  </div>
                )}

                <span className="text-[9px] text-stone-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 px-3 bg-white border border-stone-200 rounded-2xl w-fit shadow-2xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#fcb907] animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions strip */}
          <div
            onWheel={(e) => {
              // If user scrolls horizontally or Shift is held, allow horizontal scroll
              if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                return;
              }
              // Otherwise delegate vertical mouse wheel scroll to the messages feed
              if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop += e.deltaY;
              }
            }}
            className="px-3 py-2 bg-white border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[10px] text-stone-500 no-scrollbar shrink-0"
          >
            <span className="shrink-0 font-bold text-stone-900">Ask:</span>
            <button
              onClick={() => handleSend("Estimate 1,500 sq ft build quotation")}
              className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-stone-900 border border-stone-200/80 shrink-0 transition-colors cursor-pointer font-medium"
            >
              1,500 Sq Ft Quote?
            </button>
            <button
              onClick={() => handleSend("Tell me about cabins and ADUs")}
              className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-stone-900 border border-stone-200/80 shrink-0 transition-colors cursor-pointer font-medium"
            >
              Cabins?
            </button>
            <button
              onClick={() => handleSend("Why steel framing over wood?")}
              className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-stone-900 border border-stone-200/80 shrink-0 transition-colors cursor-pointer font-medium"
            >
              Steel vs Wood
            </button>
            <button
              onClick={() => handleSend("What barndominium models do you have?")}
              className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-stone-900 border border-stone-200/80 shrink-0 transition-colors cursor-pointer font-medium"
            >
              Barndos
            </button>
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about models, pricing, blueprints..."
              className="flex-1 bg-stone-100/80 border border-stone-200 px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#fcb907] focus:bg-white rounded-full transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send message"
              className="p-2.5 bg-[#fcb907] hover:bg-[#e5a706] disabled:opacity-40 text-stone-950 rounded-full transition-all cursor-pointer font-bold shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
