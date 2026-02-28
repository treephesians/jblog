"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PostComment, PostStats, CommentUserInfo } from "@/lib/types/api";

export type { PostComment, PostStats, CommentUserInfo };

export function usePostStats(slug: string) {
  return useQuery<PostStats>({
    queryKey: ["post-stats", slug],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/posts/${slug}/stats`);
      return data;
    },
    staleTime: 30 * 1000,
  });
}

export function useRecordView(slug: string) {
  const mutation = useMutation({
    mutationFn: () => api.post(`/api/v1/posts/${slug}/view`),
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
      try {
        const { data } = await api.get(`/api/v1/posts/${slug}/like/check`);
        return data;
      } catch {
        return { liked: false };
      }
    },
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (currentlyLiked) {
        await api.delete(`/api/v1/posts/${slug}/like`);
      } else {
        await api.post(`/api/v1/posts/${slug}/like`);
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
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/posts/${slug}/comments`);
      return data;
    },
  });

  const addComment = useMutation({
    mutationFn: ({
      content,
      parent_id,
    }: {
      content: string;
      parent_id?: number;
    }) => api.post(`/api/v1/posts/${slug}/comments`, { content, parent_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", slug] });
      queryClient.invalidateQueries({ queryKey: ["post-stats", slug] });
    },
  });

  const updateComment = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      api.put(`/api/v1/posts/comments/${id}`, { content }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["post-comments", slug] }),
  });

  const deleteComment = useMutation({
    mutationFn: (id: number) => api.delete(`/api/v1/posts/comments/${id}`),
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
      queryFn: async () => {
        const { data } = await api.get<CommentUserInfo>(`/api/v1/users/${id}`);
        return data;
      },
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
