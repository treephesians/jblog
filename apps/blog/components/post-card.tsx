import Image from "next/image";
import { Card, CardContent } from "@repo/ui/card";
import { CategoryBadge } from "@/components/category-badge";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <a href={`/article/${post.slug}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-none bg-transparent gap-0 py-0">
        <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
          {post.frontmatter.thumbnail ? (
            <Image
              src={post.frontmatter.thumbnail}
              alt={post.frontmatter.title}
              width={800}
              height={450}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-muted to-muted-foreground/10" />
          )}
        </div>
        <CardContent className="px-0 pt-4 pb-0">
          <CategoryBadge
            category={post.frontmatter.category}
            className="mb-1.5"
          />
          <h2 className="text-lg font-semibold mt-1 mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
            {post.frontmatter.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {post.frontmatter.description}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
