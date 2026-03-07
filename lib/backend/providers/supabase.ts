import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthProvider, PostProvider, User, PostStats, PostComment, CommentUserInfo } from "../types";
import type { Database } from "@/lib/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getBrowserClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function getServerClient(cookieHeader: string) {
  const cookieMap = Object.fromEntries(
    cookieHeader.split(";").flatMap((c) => {
      const [k, ...v] = c.trim().split("=");
      if (!k) return [];
      return [[k.trim(), decodeURIComponent(v.join("="))]];
    })
  );

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => Object.entries(cookieMap).map(([name, value]) => ({ name, value })),
      setAll: () => {},
    },
  });
}

async function getInternalUserId(supabase: SupabaseClient<Database>): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("users").select("id").eq("auth_id", user.id).single();
  return data?.id ?? null;
}

// ── Auth Provider ──────────────────────────────────────────────

export const supabaseAuthProvider: AuthProvider = {
  async getCurrentUser(cookieHeader?: string): Promise<User | null> {
    if (!cookieHeader) return null;
    try {
      const supabase = getServerClient(cookieHeader);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("users")
        .select("id, email, username, full_name, avatar_url, is_active, created_at")
        .eq("auth_id", user.id)
        .single();

      return data ?? null;
    } catch {
      return null;
    }
  },

  async login(): Promise<void> {
    const supabase = getBrowserClient();
    const redirectTo = `${window.location.origin}/api/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  },

  async fetchCurrentUser(): Promise<User | null> {
    try {
      const supabase = getBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("users")
        .select("id, email, username, full_name, avatar_url, is_active, created_at")
        .eq("auth_id", user.id)
        .single();

      return data ?? null;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
  },
};

// ── Post Provider ──────────────────────────────────────────────

export const supabasePostProvider: PostProvider = {
  async getStats(slug: string): Promise<PostStats> {
    const supabase = getBrowserClient();

    const [views, likes, comments] = await Promise.all([
      supabase.from("post_views").select("id", { count: "exact", head: true }).eq("post_slug", slug),
      supabase.from("post_likes").select("id", { count: "exact", head: true }).eq("post_slug", slug),
      supabase.from("post_comments").select("id", { count: "exact", head: true }).eq("post_slug", slug).eq("is_deleted", false),
    ]);

    return {
      post_slug: slug,
      view_count: views.count ?? 0,
      like_count: likes.count ?? 0,
      comment_count: comments.count ?? 0,
    };
  },

  async recordView(slug: string): Promise<void> {
    const supabase = getBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userId: number | null = null;
    if (user) {
      const { data } = await supabase.from("users").select("id").eq("auth_id", user.id).single();
      userId = data?.id ?? null;
    }

    await supabase.from("post_views").insert({ post_slug: slug, user_id: userId });
  },

  async checkLike(slug: string): Promise<boolean> {
    try {
      const supabase = getBrowserClient();
      const userId = await getInternalUserId(supabase);
      if (!userId) return false;

      const { data } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_slug", slug)
        .eq("user_id", userId)
        .maybeSingle();

      return data !== null;
    } catch {
      return false;
    }
  },

  async like(slug: string): Promise<void> {
    const supabase = getBrowserClient();
    const userId = await getInternalUserId(supabase);
    if (!userId) throw new Error("Not authenticated");
    await supabase.from("post_likes").insert({ post_slug: slug, user_id: userId });
  },

  async unlike(slug: string): Promise<void> {
    const supabase = getBrowserClient();
    const userId = await getInternalUserId(supabase);
    if (!userId) throw new Error("Not authenticated");
    await supabase.from("post_likes").delete().eq("post_slug", slug).eq("user_id", userId);
  },

  async getComments(slug: string): Promise<PostComment[]> {
    const supabase = getBrowserClient();
    const { data } = await supabase
      .from("post_comments")
      .select("id, post_slug, user_id, parent_id, content, is_deleted, created_at, updated_at")
      .eq("post_slug", slug)
      .order("created_at", { ascending: true });

    return data ?? [];
  },

  async addComment(slug: string, content: string, parentId?: number): Promise<PostComment> {
    const supabase = getBrowserClient();
    const userId = await getInternalUserId(supabase);
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("post_comments")
      .insert({ post_slug: slug, user_id: userId, content, parent_id: parentId ?? null })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to add comment");
    return data;
  },

  async updateComment(id: number, content: string): Promise<PostComment> {
    const supabase = getBrowserClient();
    const { data, error } = await supabase
      .from("post_comments")
      .update({ content })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update comment");
    return data;
  },

  async deleteComment(id: number): Promise<void> {
    const supabase = getBrowserClient();
    await supabase.from("post_comments").update({ is_deleted: true }).eq("id", id);
  },

  async getUserInfo(userId: number): Promise<CommentUserInfo> {
    const supabase = getBrowserClient();
    const { data, error } = await supabase
      .from("users")
      .select("email, avatar_url")
      .eq("id", userId)
      .single();

    if (error || !data) throw new Error(error?.message ?? "User not found");
    return { email: data.email, avatar_url: data.avatar_url };
  },
};
