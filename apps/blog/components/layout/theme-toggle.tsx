"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@repo/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="hidden dark:inline">
        <Moon size={18} />
      </span>
      <span className="inline dark:hidden">
        <Sun size={18} />
      </span>
    </Button>
  );
}
