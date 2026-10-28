import React from "react";

interface UsFlagProps {
  className?: string;
}

// Lightweight inline US flag (13 stripes + canton with star dots) used on "Made in USA" badges.
export function UsFlag({ className = "w-8 h-auto" }: UsFlagProps) {
  const stripeHeight = 100 / 13;
  return (
    <svg viewBox="0 0 190 100" className={className} role="img" aria-label="United States flag">
      <rect width="190" height="100" fill="#ffffff" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} y={i * 2 * stripeHeight} width="190" height={stripeHeight} fill="#b22234" />
      ))}
      <rect width="76" height={stripeHeight * 7} fill="#3c3b6e" />
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={7 + col * 12.5} cy={6 + row * 10.5} r="2.2" fill="#ffffff" />
        ))
      )}
    </svg>
  );
}
