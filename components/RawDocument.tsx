import { JsonBlock } from "./JsonBlock";
import { redactDocument } from "@/lib/format";

export function RawDocument({
  value,
  title = "Raw document",
  defaultOpen = false,
}: {
  value: unknown;
  title?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-white/10 bg-stoat-panel"
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-stoat-text marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span className="text-stoat-cyan transition group-open:rotate-90">▸</span>
          {title}
          <span className="font-normal text-stoat-muted">JSON</span>
        </span>
      </summary>
      <div className="border-t border-white/10 p-3 pt-0">
        <JsonBlock value={redactDocument(value)} />
      </div>
    </details>
  );
}
