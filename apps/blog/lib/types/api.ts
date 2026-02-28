export interface PostComment {
  id: number;
  post_slug: string;
  user_id: number;
  parent_id: number | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostStats {
  post_slug: string;
  view_count: number;
  like_count: number;
  comment_count: number;
}

export interface CommentUserInfo {
  email: string;
  avatar_url: string | null;
}
