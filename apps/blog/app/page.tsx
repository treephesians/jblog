import { getAllPosts, getFeaturedPosts } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { FeaturedCarousel } from "@/components/featured-carousel";

export default function Home() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts().map(({ slug, frontmatter }) => ({
    slug,
    frontmatter,
  }));
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = posts.filter((post) => !featuredSlugs.has(post.slug));

  return (
    <div className="mx-auto max-w-[1000px]">
      {featured.length > 0 && (
        <section className="mb-16">
          <FeaturedCarousel posts={featured} />
        </section>
      )}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
