"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
    >
      <span className="hidden dark:inline">
        <Sun size={18} />
      </span>
      <span className="inline dark:hidden">
        <Moon size={18} />
      </span>
    </button>
  );
}
