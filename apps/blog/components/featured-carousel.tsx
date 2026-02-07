"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@repo/ui/carousel";
import type { PostFrontmatter } from "@/lib/types";

interface FeaturedPost {
  slug: string;
  frontmatter: PostFrontmatter;
}

export function FeaturedCarousel({ posts }: { posts: FeaturedPost[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!api) return;
    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="group">
      <CarouselContent>
        {posts.map((post) => (
          <CarouselItem key={post.slug}>
            <Link href={`/article/${post.slug}`} className="block">
              <div className="relative rounded-3xl overflow-hidden aspect-[2.4/1]">
                {post.frontmatter.thumbnail ? (
                  <Image
                    src={post.frontmatter.thumbnail}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-muted to-muted-foreground/10" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <CategoryBadge
                    category={post.frontmatter.category}
                    className="mb-3 bg-white/20 text-white border-0 backdrop-blur-sm"
                  />
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/70 max-w-xl line-clamp-2">
                    {post.frontmatter.description}
                  </p>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      {posts.length > 1 && (
        <>
          <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30 hover:text-white" />
          <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30 hover:text-white" />

          <div className="absolute bottom-4 right-8 md:right-12 flex gap-1.5">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  );
}
