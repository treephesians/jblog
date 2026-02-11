import type { MetadataRoute } from "next";
import { getAllPosts, getAllSeriesWithMeta } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/article/${post.slug}`,
    lastModified: post.frontmatter.updatedAt || post.frontmatter.date,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const series = getAllSeriesWithMeta().map((s) => ({
    url: `${siteConfig.url}/series/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const staticPages = [
    {
      url: siteConfig.url,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/article`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/series`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...staticPages, ...posts, ...series];
}
