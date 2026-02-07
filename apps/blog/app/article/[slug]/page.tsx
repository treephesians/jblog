import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Separator } from "@repo/ui/separator";
import { CategoryBadge } from "@/components/category-badge";
import { getPostBySlug, getPostSlugs } from "@/lib/content";
import { compileMdxContent } from "@/lib/mdx";
import { TableOfContents } from "@/components/toc";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMdxContent(post.content);

  return (
    <div className="relative mx-auto max-w-[768px]">
      <article>
        <header className="mb-8">
          {post.frontmatter.thumbnail && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-muted">
              <Image
                src={post.frontmatter.thumbnail}
                alt={post.frontmatter.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={post.frontmatter.category} />
            {post.frontmatter.series && (
              <Badge variant="secondary">
                {post.frontmatter.series.name} #{post.frontmatter.series.order}
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {post.frontmatter.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {post.frontmatter.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {post.frontmatter.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readingTime}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={14} />
              {post.frontmatter.tags.join(", ")}
            </span>
          </div>
        </header>
        <Separator className="mb-8" />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {content}
        </div>
      </article>
      <aside className="hidden xl:block absolute top-0 left-full h-full ml-10 w-56">
        <div className="sticky top-24">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
