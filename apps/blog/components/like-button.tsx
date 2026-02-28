"use client";

import { Heart } from "lucide-react";
import { cn } from "@repo/ui/utils";
import { usePostLike, usePostStats } from "@/hooks/use-post-interaction";
import { useCurrentUser } from "@/hooks/use-current-user";

interface LikeButtonProps {
  slug: string;
  onLoginRequired: () => void;
}

export function LikeButton({ slug, onLoginRequired }: LikeButtonProps) {
  const { data: user } = useCurrentUser();
  const { checkQuery, toggleMutation } = usePostLike(slug);
  const { data: stats } = usePostStats(slug);

  const liked = checkQuery.data?.liked ?? false;
  const likeCount = stats?.like_count ?? 0;

  const handleClick = () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    toggleMutation.mutate(liked);
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggleMutation.isPending}
      className={cn(
        "flex flex-col items-center gap-2 px-10 py-5 rounded-2xl border-2 transition-all cursor-pointer group",
        liked
          ? "bg-red-50 border-red-300 text-red-500 dark:bg-red-950/30 dark:border-red-700"
          : "border-border text-muted-foreground hover:border-red-300 hover:text-red-400 dark:hover:border-red-700",
      )}
    >
      <Heart
        className={cn(
          "h-8 w-8 transition-transform group-hover:scale-110",
          liked && "fill-current scale-110",
        )}
      />
      <span className="text-base font-semibold">{likeCount}</span>
    </button>
  );
}
