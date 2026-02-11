import Image from "next/image";
import { Badge } from "@repo/ui/badge";
import type { SeriesMeta } from "@/lib/content";
import Link from "next/link";

export function SeriesCard({ series }: { series: SeriesMeta }) {
  return (
    <Link
      href={`/series/${series.slug}`}
      className="group block"
    >
      <div className="relative rounded-2xl overflow-hidden aspect-video">
        {series.thumbnail ? (
          <Image
            src={series.thumbnail}
            alt={series.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-muted to-muted-foreground/10" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-lg font-bold text-white mb-1.5">
            {series.name}
          </h2>
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
            {series.postCount}개의 포스트
          </Badge>
        </div>
      </div>
    </Link>
  );
}
