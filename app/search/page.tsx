import { getAllPosts } from "@/lib/content";
import { ArticleList } from "@/components/article-list";

export const metadata = {
  title: "Search",
  description: "포스트 검색",
};

export default function SearchPage() {
  const posts = getAllPosts().map(({ slug, frontmatter, readingTime }) => ({
    slug,
    frontmatter,
    readingTime,
  }));

  return (
    <div className="mx-auto max-w-[1000px] space-y-16">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">search</h2>
        <p className="text-base text-muted-foreground">
          제목, 설명, 태그, 카테고리로 검색할 수 있습니다.
        </p>
      </section>

      <ArticleList posts={posts} />
    </div>
  );
}
