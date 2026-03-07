import {
  getAllPosts,
  getFeaturedPosts,
  getAllSeriesWithMeta,
} from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SeriesCard } from "@/components/series-card";
import { FeaturedCarousel } from "@/components/featured-carousel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts().map(({ slug, frontmatter }) => ({
    slug,
    frontmatter,
  }));
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const recentPosts = posts
    .filter((post) => !featuredSlugs.has(post.slug))
    .slice(0, 3);

  const recentSeries = getAllSeriesWithMeta()
    .sort(
      (a, b) =>
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime(),
    )
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-[1000px]">
      {featured.length > 0 && (
        <section className="mb-16">
          <FeaturedCarousel posts={featured} />
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-border">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          <Link
            href="/article"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            more
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {recentSeries.length > 0 && (
        <section>
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-border">
            <h2 className="text-2xl font-bold">Recent Series</h2>
            <Link
              href="/series"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              more
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
            {recentSeries.map((series) => (
              <SeriesCard key={series.name} series={series} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
