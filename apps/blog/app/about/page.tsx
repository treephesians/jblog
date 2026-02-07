import { Separator } from "@repo/ui/separator";

export const metadata = {
  title: "About",
  description: "블로그 소개",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[768px] space-y-8">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">about</h2>
        <p className="text-base text-muted-foreground">블로그 소개</p>
      </section>
      <Separator />
      <section className="prose prose-neutral dark:prose-invert max-w-none">
        <p>안녕하세요. 개발 관련 지식과 경험을 기록하는 블로그입니다.</p>
        <p>
          직접 개발하면서 해결한 트러블 슈팅과, 좋은 콘텐츠를 통해 얻은 영감,
          그리고 간단한 회고들이 모여있습니다.
        </p>
      </section>
    </div>
  );
}
