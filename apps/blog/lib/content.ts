import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter } from "./types";

const postsDirectory = path.join(process.cwd(), "content/posts");

function getMdxFiles(dir: string): { slug: string; filePath: string }[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: { slug: string; filePath: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push({
        slug: entry.name.replace(/\.mdx$/, ""),
        filePath: fullPath,
      });
    }
  }

  return files;
}

export function getPostSlugs(): string[] {
  return getMdxFiles(postsDirectory).map((f) => f.slug);
}

export function getPostBySlug(slug: string): Post {
  const file = getMdxFiles(postsDirectory).find((f) => f.slug === slug);
  if (!file) throw new Error(`Post not found: ${slug}`);

  const fileContent = fs.readFileSync(file.filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content: fileContent,
    readingTime: stats.text,
  };
}

export function getAllPosts(): Post[] {
  return getMdxFiles(postsDirectory)
    .map((f) => getPostBySlug(f.slug))
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.frontmatter.featured);
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    (post) =>
      post.frontmatter.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) =>
    post.frontmatter.tags
      .map((t) => t.toLowerCase())
      .includes(tag.toLowerCase())
  );
}

export function getPostsBySeries(seriesName: string): Post[] {
  return getAllPosts()
    .filter(
      (post) =>
        post.frontmatter.series?.name.toLowerCase() ===
        seriesName.toLowerCase()
    )
    .sort(
      (a, b) =>
        (a.frontmatter.series?.order ?? 0) -
        (b.frontmatter.series?.order ?? 0)
    );
}

export function getAllCategories(): string[] {
  const categories = getAllPosts().map((post) => post.frontmatter.category);
  return [...new Set(categories)];
}

export function getAllTags(): string[] {
  const tags = getAllPosts().flatMap((post) => post.frontmatter.tags);
  return [...new Set(tags)];
}

export function getAllSeries(): string[] {
  const series = getAllPosts()
    .map((post) => post.frontmatter.series?.name)
    .filter((name): name is string => !!name);
  return [...new Set(series)];
}

export interface SeriesMeta {
  name: string;
  postCount: number;
  thumbnail?: string;
  latestDate: string;
}

export function getAllSeriesWithMeta(): SeriesMeta[] {
  return getAllSeries().map((name) => {
    const posts = getPostsBySeries(name);
    const latestDate = posts
      .map((p) => p.frontmatter.date)
      .sort()
      .reverse()[0]!;
    return {
      name,
      postCount: posts.length,
      thumbnail: posts[0]?.frontmatter.thumbnail,
      latestDate,
    };
  });
}
