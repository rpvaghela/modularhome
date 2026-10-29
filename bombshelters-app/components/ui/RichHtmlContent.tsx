"use client";

import React from "react";

interface RichHtmlContentProps {
  content?: string | null;
  className?: string;
}

function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export function RichHtmlContent({
  content,
  className = "",
}: RichHtmlContentProps) {
  if (!content || !content.trim()) {
    return null;
  }

  const hasHtmlTags = isHtml(content);

  if (!hasHtmlTags) {
    return (
      <div className={`text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line ${className}`}>
        {content}
      </div>
    );
  }

  // Enforce single H1 SEO hierarchy: demote any <h1> tags inside descriptions to <h2>
  const sanitizedHtml = content
    .replace(/<h1(\s|>)/gi, "<h2$1")
    .replace(/<\/h1>/gi, "</h2>");

  return (
    <div
      className={`prose max-w-none text-gray-700 leading-relaxed text-sm sm:text-base prose-headings:font-display prose-headings:text-[#0a0a0a] prose-strong:text-[#0a0a0a] prose-a:text-[#e11d1d] hover:prose-a:underline ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

