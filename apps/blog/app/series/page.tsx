import { getAllSeriesWithMeta } from "@/lib/content";
import { SeriesCard } from "@/components/series-card";

export const metadata = {
  title: "Series",
  description: "연재 시리즈 목록",
};

export default function SeriesPage() {
  const seriesList = getAllSeriesWithMeta();

  return (
    <div className="mx-auto max-w-[1000px] space-y-16">
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">series</h2>
        <p className="text-base text-muted-foreground">
          단계별로 정리한 연재 시리즈입니다.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {seriesList.map((series) => (
          <SeriesCard key={series.name} series={series} />
        ))}
      </div>
    </div>
  );
}
