import { Separator } from "@repo/ui/separator";

export function Footer() {
  return (
    <footer className="mt-20">
      <Separator />
      <div className="mx-auto max-w-[1000px] py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} tech blog</p>
        <div className="flex items-center gap-6">
          <a href="/about" className="hover:text-foreground transition-colors">
            About
          </a>
          <a
            href="/feed.xml"
            className="hover:text-foreground transition-colors"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
