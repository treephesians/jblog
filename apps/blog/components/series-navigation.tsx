import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPostsBySeries } from "@/lib/content";
import type { PostFrontmatter } from "@/lib/types";

interface SeriesNavigationProps {
  series: NonNullable<PostFrontmatter["series"]>;
  currentSlug: string;
}

export function SeriesNavigation({
  series,
  currentSlug,
}: SeriesNavigationProps) {
  const posts = getPostsBySeries(series.name);
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <nav className="mt-12 rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/series/${encodeURIComponent(series.name)}`}
          className="font-semibold hover:text-primary transition-colors"
        >
          {series.name}
        </Link>
        <span className="text-sm text-muted-foreground">
          {series.order} / {posts.length}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/article/${prev.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="line-clamp-1">{prev.frontmatter.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/article/${next.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
          >
            <span className="line-clamp-1">{next.frontmatter.title}</span>
            <ChevronRight size={16} />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
