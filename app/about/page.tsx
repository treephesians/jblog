import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "About",
  description: "Frontend Developer 박준범입니다.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[768px] space-y-12">
      {/* 헤더 */}
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">about</h2>
      </section>

      <Separator />

      {/* 프로필 */}
      <section className="space-y-3">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold">안녕하세요 👋</h3>
          <p className="text-muted-foreground leading-relaxed">
            Frontend Developer 박준범입니다.
            <br />
            일상의 어려움을 기술적으로 해결하는 것을 즐거워하며,
            <br />
            요구사항 분석부터 설계, 개선까지 전 과정을 경험해봤습니다.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            또한 AI 시대에서 AI 도구를 활용해 빠르게 개발을 진행하면서도,
            <br />
            기능의 검증과 최적화, 효율성 향상을 위해 깊이 고민하고 있습니다.
          </p>
        </div>
      </section>

      <Separator />

      {/* 이런 개발자 */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">
          🔽 이런 개발자가 되기 위해 노력하고 있어요,
        </h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-5 space-y-2">
            <h4 className="font-semibold">✏️ 잘 읽고 쓰는 개발자</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                문서화와 지식을 정리하는 습관으로, 같은 문제를 반복하지 않도록
                성장하는 개발자
              </li>
              <li>
                최신 IT 트렌드를 꾸준히 리서치 및 학습하고, 팀에 공유하여 함께
                성장하는 개발자
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30 p-5 space-y-2">
            <h4 className="font-semibold">💡 문제를 정의하는 개발자</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                "Why?"를 끊임없이 질문하며 문제의 본질을 탐구하는 개발자
              </li>
              <li>
                사용자 관점에서 문제를 바라보고, 진짜 필요한 가치를 찾아내는
                개발자
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-5 space-y-2">
            <h4 className="font-semibold">🍀 최소 Input 최대 Output 만드는 개발자</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                제한된 자원으로도 기술적 선택이 비즈니스 성과로 이어지도록
                연결하는 개발자
              </li>
              <li>
                반복 작업을 자동화하고, 작은 개선으로도 큰 효과를 이끌어내는
                개발자
              </li>
            </ul>
          </div>
        </div>

        <details className="group rounded-lg border p-4">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground select-none">
            위와 같은 개발자가 되기 위해 이렇게 노력했어요
          </summary>
          <ol className="mt-3 text-sm text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              이 블로그에 꾸준히 글을 작성하고 있으며, thread 계정으로도 열심히
              리포스트하고 있습니다.
            </li>
            <li>
              저의 아이디어로 시작 된 PrayU 서비스는 지금까지 리텐션 그래프에서
              long tail을 만들어 내며 저는 PMF를 찾아낸 경험이 있습니다. 실제로
              유저들을 인터뷰하고 Amplitude로 지표 보기를 좋아합니다.
            </li>
            <li>
              실제로 서비스로 돈을 벌어본 적은 없지만, 번역 Extension을
              만드는동안 OpenAI API를 사용하지 않고 직접 Docker로 AI를 서빙하여
              비용을 최소화하고자 머리를 굴립니다.
            </li>
          </ol>
        </details>
      </section>

      <Separator />

      {/* 개발 외적으로 */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">🔽 개발 외적으로는요,</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-5 space-y-2">
            <h4 className="font-semibold">🫂 사람들을 좋아합니다</h4>
            <p className="text-sm text-muted-foreground">
              공동체 생활을 즐거워하며, 이쁜 여자친구와 2년이 넘도록 행복하게
              연애중입니다 😆
            </p>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30 p-5 space-y-2">
            <h4 className="font-semibold">🎲 방탈출, 보드게임을 좋아합니다</h4>
            <p className="text-sm text-muted-foreground">
              머리쓰며 해결하는 것들을 좋아합니다. 알고리즘 푸는 것도 즐거워합니다 👀
            </p>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-5 space-y-2">
            <h4 className="font-semibold">📚 자기계발 책을 좋아합니다.</h4>
            <p className="text-sm text-muted-foreground">
              어쩌면 자기계발 책 내용은 비슷하겠지만, 게을러질때마다 책을 읽으며
              동기부여를 얻습니다 💪
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
