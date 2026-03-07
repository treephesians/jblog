import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export const metadata = {
  title: "Article",
  description: "모든 포스트 목록",
};

export default function ArticlePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-[1000px] space-y-16">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">article</h2>
        <p className="text-base text-muted-foreground">
          직접 개발하면서 해결한 트러블 슈팅과, 좋은 콘텐츠를 통해 얻은 영감,
          그리고 간단한 회고들이 모여있습니다.
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
