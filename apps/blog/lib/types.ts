export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  series?: {
    name: string;
    order: number;
  };
  thumbnail?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export type SearchablePost = Omit<Post, "content">;
