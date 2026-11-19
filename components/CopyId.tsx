"use client";

import { useState } from "react";

export function CopyId({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard may be blocked */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy ID"
      className={`group inline-flex max-w-full items-center gap-2 rounded-md border border-transparent px-1.5 py-0.5 font-mono text-xs text-stoat-muted transition hover:border-white/10 hover:bg-white/5 hover:text-stoat-text ${className}`}
    >
      <span className="truncate">{id}</span>
      <span className="shrink-0 text-[10px] uppercase tracking-wide text-stoat-cyan opacity-0 transition group-hover:opacity-100">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
