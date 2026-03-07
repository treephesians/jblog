import { ExternalLink } from "lucide-react";

export function LinkCard({ url, title }: { url: string; title: string }) {
  const domain = new URL(url).hostname;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group flex items-center gap-4 rounded-xl border p-4 my-4 hover:bg-muted/50 transition-colors"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
        alt=""
        width={20}
        height={20}
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{domain}</p>
      </div>
      <ExternalLink
        size={14}
        className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </a>
  );
}
