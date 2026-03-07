import type { AuthProvider, PostProvider, User, PostStats, PostComment, CommentUserInfo } from "../types";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fastapiAuthProvider: AuthProvider = {
  async getCurrentUser(cookieHeader?: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/me`, {
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
        cache: "no-store",
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  async login(): Promise<void> {
    window.location.href = `${API_URL}/api/v1/auth/google/login`;
  },

  async fetchCurrentUser(): Promise<User | null> {
    try {
      const { data } = await api.get<User>("/api/v1/users/me");
      return data;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await api.post("/api/v1/auth/logout");
  },
};

export const fastapiPostProvider: PostProvider = {
  async getStats(slug: string): Promise<PostStats> {
    const { data } = await api.get(`/api/v1/posts/${slug}/stats`);
    return data;
  },

  async recordView(slug: string): Promise<void> {
    await api.post(`/api/v1/posts/${slug}/view`);
  },

  async checkLike(slug: string): Promise<boolean> {
    try {
      const { data } = await api.get<{ liked: boolean }>(`/api/v1/posts/${slug}/like/check`);
      return data.liked;
    } catch {
      return false;
    }
  },

  async like(slug: string): Promise<void> {
    await api.post(`/api/v1/posts/${slug}/like`);
  },

  async unlike(slug: string): Promise<void> {
    await api.delete(`/api/v1/posts/${slug}/like`);
  },

  async getComments(slug: string): Promise<PostComment[]> {
    const { data } = await api.get(`/api/v1/posts/${slug}/comments`);
    return data;
  },

  async addComment(slug: string, content: string, parentId?: number): Promise<PostComment> {
    const { data } = await api.post(`/api/v1/posts/${slug}/comments`, {
      content,
      parent_id: parentId,
    });
    return data;
  },

  async updateComment(id: number, content: string): Promise<PostComment> {
    const { data } = await api.put(`/api/v1/posts/comments/${id}`, { content });
    return data;
  },

  async deleteComment(id: number): Promise<void> {
    await api.delete(`/api/v1/posts/comments/${id}`);
  },

  async getUserInfo(userId: number): Promise<CommentUserInfo> {
    const { data } = await api.get<CommentUserInfo>(`/api/v1/users/${userId}`);
    return data;
  },
};
