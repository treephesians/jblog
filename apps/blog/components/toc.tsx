"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = document.querySelectorAll("article h2, article h3");
    const items: TocItem[] = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: Number(el.tagName[1]),
    }));
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1 text-sm">
      <p className="font-semibold mb-2">Table of Contents</p>
      {headings.map((heading) => (
        <button
          key={heading.id}
          type="button"
          onClick={() => {
            const el = document.getElementById(heading.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              history.replaceState(null, "", `#${heading.id}`);
            }
          }}
          className={`block text-left transition-colors hover:text-foreground ${
            heading.level === 3 ? "pl-4" : ""
          } ${
            activeId === heading.id
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          }`}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  );
}
