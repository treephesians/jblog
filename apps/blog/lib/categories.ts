const categoryStyles: Record<string, string> = {
  DevOps:
    "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  Frontend:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  Backend:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  Infra:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  Insight:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
};

const defaultStyle =
  "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";

export function getCategoryStyle(category: string): string {
  return categoryStyles[category] ?? defaultStyle;
}
