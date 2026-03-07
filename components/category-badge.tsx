import { Badge } from "@/components/ui/badge";
import { getCategoryStyle } from "@/lib/categories";
import { cn } from "@/components/ui/utils";

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
