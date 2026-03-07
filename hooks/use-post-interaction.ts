"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { postProvider } from "@/lib/backend";
import type { PostComment, PostStats, CommentUserInfo } from "@/lib/types/api";

export type { PostComment, PostStats, CommentUserInfo };

export function usePostStats(slug: string) {
  return useQuery<PostStats>({
    queryKey: ["post-stats", slug],
    queryFn: () => postProvider.getStats(slug),
    staleTime: 30 * 1000,
  });
}

export function useRecordView(slug: string) {
  const mutation = useMutation({
    mutationFn: () => postProvider.recordView(slug),
  });

  useEffect(() => {
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
}

export function usePostLike(slug: string) {
  const queryClient = useQueryClient();

  const checkQuery = useQuery<{ liked: boolean }>({
    queryKey: ["post-like", slug],
    queryFn: async () => {
      const liked = await postProvider.checkLike(slug);
      return { liked };
    },
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (currentlyLiked) {
        await postProvider.unlike(slug);
      } else {
        await postProvider.like(slug);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-like", slug] });
      queryClient.invalidateQueries({ queryKey: ["post-stats", slug] });
    },
  });

  return { checkQuery, toggleMutation };
}

export function usePostComments(slug: string) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery<PostComment[]>({
    queryKey: ["post-comments", slug],
    queryFn: () => postProvider.getComments(slug),
  });

  const addComment = useMutation({
    mutationFn: ({ content, parent_id }: { content: string; parent_id?: number }) =>
      postProvider.addComment(slug, content, parent_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", slug] });
      queryClient.invalidateQueries({ queryKey: ["post-stats", slug] });
    },
  });

  const updateComment = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      postProvider.updateComment(id, content),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["post-comments", slug] }),
  });

  const deleteComment = useMutation({
    mutationFn: (id: number) => postProvider.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", slug] });
      queryClient.invalidateQueries({ queryKey: ["post-stats", slug] });
    },
  });

  return { commentsQuery, addComment, updateComment, deleteComment };
}

export function useCommentUsers(userIds: number[]) {
  const uniqueIds = [...new Set(userIds)];

  const results = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: ["comment-user", id],
      queryFn: () => postProvider.getUserInfo(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const usersMap: Record<number, CommentUserInfo> = {};
  results.forEach((result, i) => {
    const id = uniqueIds[i];
    if (result.data && id !== undefined) usersMap[id] = result.data;
  });

  return usersMap;
}
