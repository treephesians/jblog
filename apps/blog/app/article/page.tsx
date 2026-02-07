import { getAllPosts, getAllTags } from "@/lib/content";
import { PostListWithFilters } from "@/components/post-list-with-filters";

export const metadata = {
  title: "Article",
  description: "모든 포스트 목록",
};

export default function ArticlePage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-[1200px]">
      <PostListWithFilters posts={posts} tags={tags} />
    </div>
  );
}
