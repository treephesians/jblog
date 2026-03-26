export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  series?: {
    name: string;
    slug: string;
    order: number;
  };
  thumbnail?: string;
  featured?: boolean;
  draft?: boolean;
  visible?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export type SearchablePost = Omit<Post, "content">;

export interface User {
  id: number;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PostStats {
  post_slug: string;
  view_count: number;
  like_count: number;
  comment_count: number;
}

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

export interface CommentUserInfo {
  email: string;
  avatar_url: string | null;
}
