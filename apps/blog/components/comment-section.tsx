"use client";

import { MessageSquare } from "lucide-react";
import { Separator } from "@repo/ui/separator";
import { CommentForm } from "@/components/comment-form";
import { CommentItem } from "@/components/comment-item";
import { usePostComments, useCommentUsers } from "@/hooks/use-post-interaction";
import { useCurrentUser } from "@/hooks/use-current-user";

interface CommentSectionProps {
  slug: string;
  onLoginRequired: () => void;
}

export function CommentSection({ slug, onLoginRequired }: CommentSectionProps) {
  const { data: user } = useCurrentUser();
  const { commentsQuery, addComment, updateComment, deleteComment } =
    usePostComments(slug);

  const comments = commentsQuery.data ?? [];
  const userIds = comments.map((c) => c.user_id);
  const usersMap = useCommentUsers(userIds);

  const isPending =
    addComment.isPending || updateComment.isPending || deleteComment.isPending;

  return (
    <section className="mt-12">
      <Separator className="mb-8" />
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
        <MessageSquare className="h-5 w-5" />
        댓글
        {comments.length > 0 && (
          <span className="text-sm font-normal text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* 댓글 작성 폼 - 항상 표시, 등록 시 로그인 체크 */}
      <div className="mb-8">
        <CommentForm
          onSubmit={(content) => addComment.mutate({ content })}
          isPending={addComment.isPending}
          isLoggedIn={!!user}
          onLoginRequired={onLoginRequired}
        />
      </div>

      {/* 댓글 목록 */}
      {commentsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">댓글을 불러오는 중...</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userInfo={usersMap[comment.user_id]}
              isOwner={!!user && user.id === comment.user_id}
              onEdit={(id, content) => updateComment.mutate({ id, content })}
              onDelete={(id) => deleteComment.mutate(id)}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </section>
  );
}
