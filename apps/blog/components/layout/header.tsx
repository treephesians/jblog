"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@repo/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { label: "article", href: "/article" },
  { label: "series", href: "/series" },
  { label: "about", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold tracking-tight">jblog</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search size={18} />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
