import { notFound } from "next/navigation";
import {
  getPostsBySeries,
  getAllSeriesWithMeta,
  getSeriesNameBySlug,
} from "@/lib/content";
import { PostCard } from "@/components/post-card";

export function generateStaticParams() {
  return getAllSeriesWithMeta().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seriesName = getSeriesNameBySlug(slug);
  if (!seriesName) return { title: "Series Not Found" };
  return {
    title: `${seriesName} 시리즈`,
    description: `${seriesName} 연재 시리즈`,
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seriesName = getSeriesNameBySlug(slug);
  if (!seriesName) notFound();

  const posts = getPostsBySeries(seriesName);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-[1000px] space-y-16">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">{seriesName}</h2>
        <p className="text-base text-muted-foreground">
          총 {posts.length}개의 포스트로 구성된 시리즈입니다.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
