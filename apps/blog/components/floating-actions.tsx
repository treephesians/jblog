"use client";

import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@repo/ui/utils";
import { LoginModal } from "@/components/login-modal";
import { usePostLike, usePostStats } from "@/hooks/use-post-interaction";
import { useCurrentUser } from "@/hooks/use-current-user";

function ActionButton({
  onClick,
  disabled,
  className,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

function LikeAction({
  slug,
  onLoginRequired,
}: {
  slug: string;
  onLoginRequired: () => void;
}) {
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
    <div className="flex flex-col items-center gap-1.5">
      <ActionButton
        onClick={handleClick}
        disabled={toggleMutation.isPending}
        className={
          liked
            ? "bg-red-50 border-red-300 text-red-500 dark:bg-red-950/30 dark:border-red-700"
            : "border-border text-muted-foreground hover:border-red-300 hover:text-red-400 dark:hover:border-red-700"
        }
      >
        <Heart className={cn("h-5 w-5 transition-transform", liked && "fill-current scale-110")} />
      </ActionButton>
      <span className="text-xs font-medium text-muted-foreground tabular-nums">
        {likeCount}
      </span>
    </div>
  );
}

function ShareAction() {
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다");
  };

  return (
    <ActionButton
      onClick={handleShare}
      className="border-border text-muted-foreground hover:border-foreground hover:text-foreground"
    >
      <Share2 className="h-5 w-5" />
    </ActionButton>
  );
}

export function FloatingActions({ slug }: { slug: string }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <LikeAction slug={slug} onLoginRequired={() => setShowLoginModal(true)} />
        <ShareAction />
      </div>
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
