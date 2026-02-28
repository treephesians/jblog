"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isPending: boolean;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: string;
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
}

export function CommentForm({
  onSubmit,
  isPending,
  onCancel,
  placeholder = "댓글을 작성해주세요...",
  defaultValue = "",
  isLoggedIn = true,
  onLoginRequired,
}: CommentFormProps) {
  const [content, setContent] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onLoginRequired?.();
      return;
    }
    if (!content.trim()) return;
    onSubmit(content.trim());
    if (!defaultValue) setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isPending || (!isLoggedIn ? false : !content.trim())}>
          {isPending ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
}
