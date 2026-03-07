import type { User } from "@/lib/types/user";
import type { PostStats, PostComment, CommentUserInfo } from "@/lib/types/api";

export type { User, PostStats, PostComment, CommentUserInfo };

export interface AuthProvider {
  /** 서버 컴포넌트용: 쿠키 문자열로 현재 유저 조회 */
  getCurrentUser(cookieHeader?: string): Promise<User | null>;
  /** 클라이언트용: Google 로그인 (리다이렉트 처리 포함) */
  login(): Promise<void>;
  /** 클라이언트용: 현재 유저 조회 (React Query에서 사용) */
  fetchCurrentUser(): Promise<User | null>;
  /** 클라이언트용: 로그아웃 */
  logout(): Promise<void>;
}

export interface PostProvider {
  getStats(slug: string): Promise<PostStats>;
  recordView(slug: string): Promise<void>;
  checkLike(slug: string): Promise<boolean>;
  like(slug: string): Promise<void>;
  unlike(slug: string): Promise<void>;
  getComments(slug: string): Promise<PostComment[]>;
  addComment(slug: string, content: string, parentId?: number): Promise<PostComment>;
  updateComment(id: number, content: string): Promise<PostComment>;
  deleteComment(id: number): Promise<void>;
  getUserInfo(userId: number): Promise<CommentUserInfo>;
}
