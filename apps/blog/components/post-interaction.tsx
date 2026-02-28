"use client";

import { CommentSection } from "@/components/comment-section";
import { useRecordView } from "@/hooks/use-post-interaction";

export function PostInteraction({ slug }: { slug: string }) {
  useRecordView(slug);
  return <CommentSection slug={slug} />;
}
