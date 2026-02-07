import Image from "next/image";
import { Card, CardContent } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import type { SeriesMeta } from "@/lib/content";
import Link from "next/link";

export function SeriesCard({ series }: { series: SeriesMeta }) {
  return (
    <Link
      href={`/series/${encodeURIComponent(series.name)}`}
      className="group block"
    >
      <Card className="overflow-hidden border-0 shadow-none bg-transparent gap-0 py-0">
        <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
          {series.thumbnail ? (
            <Image
              src={series.thumbnail}
              alt={series.name}
              width={800}
              height={450}
              className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-muted to-muted-foreground/10" />
          )}
        </div>
        <CardContent className="px-0 pt-4 pb-0">
          <h2 className="text-lg font-semibold mt-1 mb-1.5 group-hover:text-primary transition-colors">
            {series.name}
          </h2>
          <Badge variant="secondary">{series.postCount}개의 포스트</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
