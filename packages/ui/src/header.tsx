import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "Series", href: "/series" },
  { label: "Tags", href: "/tags" },
  { label: "About", href: "/about" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">
          Blog
        </a>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
