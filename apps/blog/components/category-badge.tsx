import { Badge } from "@repo/ui/badge";
import { getCategoryStyle } from "@/lib/categories";
import { cn } from "@repo/ui/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  return (
    <Badge className={cn(getCategoryStyle(category), className)}>
      {category}
    </Badge>
  );
}
