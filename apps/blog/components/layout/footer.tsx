import { Github, Linkedin, Mail } from "lucide-react";
import { Separator } from "@repo/ui/separator";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20">
      <Separator />
      <div className="mx-auto max-w-[1000px] py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} jblog</p>
        <div className="flex items-center gap-4">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Github size={18} />
          </Link>
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Linkedin size={18} />
          </Link>
          <Link
            href={siteConfig.links.email}
            className="hover:text-foreground transition-colors"
          >
            <Mail size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
