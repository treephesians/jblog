import { notFound } from "next/navigation";
import { getPostsBySeries, getAllSeries } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export function generateStaticParams() {
  return getAllSeries().map((name) => ({ name: encodeURIComponent(name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return {
    title: `${decoded} 시리즈`,
    description: `${decoded} 연재 시리즈`,
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const posts = getPostsBySeries(decoded);

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-[1000px] space-y-16">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">{decoded}</h2>
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
