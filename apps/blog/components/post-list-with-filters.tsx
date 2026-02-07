"use client";

import { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover";
import { PostCard } from "@/components/post-card";
import type { Post } from "@/lib/types";

export function PostListWithFilters({
  posts,
  tags,
}: {
  posts: Post[];
  tags: string[];
}) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      for (const tag of post.frontmatter.tags) {
        counts[tag] = (counts[tag] ?? 0) + 1;
      }
    }
    return counts;
  }, [posts]);

  const filtered = selectedTag
    ? posts.filter((post) =>
        post.frontmatter.tags
          .map((t) => t.toLowerCase())
          .includes(selectedTag.toLowerCase())
      )
    : posts;

  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter size={14} />
              Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2">
            <div className="max-h-64 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag ? null : tag);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                    selectedTag === tag
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <span>{tag}</span>
                  <span className="text-muted-foreground text-xs">
                    {tagCounts[tag] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {selectedTag && (
          <Badge
            variant="secondary"
            className="gap-1 cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            {selectedTag}
            <X size={12} />
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No posts found.
        </p>
      )}
    </>
  );
}
