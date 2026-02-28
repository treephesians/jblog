"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { CommentForm } from "@/components/comment-form";
import type {
  PostComment,
  CommentUserInfo,
} from "@/hooks/use-post-interaction";

interface CommentItemProps {
  comment: PostComment;
  userInfo?: CommentUserInfo;
  isOwner: boolean;
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
  isPending: boolean;
}

export function CommentItem({
  comment,
  userInfo,
  isOwner,
  onEdit,
  onDelete,
  isPending,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const email = userInfo?.email ?? "알 수 없음";
  const avatarLetter = email[0]?.toUpperCase() ?? "?";

  const formattedDate = new Date(comment.created_at).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <div className="flex gap-3 items-start">
      {/* 아바타: 헤더와 동일하게 이메일 첫 글자 */}
      <Avatar className="h-8 w-8 shrink-0">
        {userInfo?.avatar_url && (
          <AvatarImage src={userInfo.avatar_url} alt="" />
        )}
        <AvatarFallback>{avatarLetter}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <CommentForm
            onSubmit={(content) => {
              onEdit(comment.id, content);
              setIsEditing(false);
            }}
            isPending={isPending}
            onCancel={() => setIsEditing(false)}
            defaultValue={comment.content}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-foreground whitespace-pre-wrap wrap-break-word leading-relaxed">
                {comment.content}
              </p>
              {isOwner && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(comment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-muted-foreground">
                {email}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formattedDate}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
