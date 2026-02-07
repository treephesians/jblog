"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@repo/ui/input";
import { PostCard } from "@/components/post-card";
import type { SearchablePost } from "@/lib/types";

export function ArticleList({ posts }: { posts: SearchablePost[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.frontmatter.title.toLowerCase().includes(q) ||
        post.frontmatter.description.toLowerCase().includes(q) ||
        post.frontmatter.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        post.frontmatter.category.toLowerCase().includes(q),
    );
  }, [posts, query]);

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="제목, 설명, 태그로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 py-6 rounded-2xl"
        />
      </div>
      {!query.trim() ? (
        <p className="text-center text-muted-foreground py-12">
          원하는 내용을 검색해주세요.
        </p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          검색 결과가 없습니다.
        </p>
      )}
    </div>
  );
}
