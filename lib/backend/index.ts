import { fastapiAuthProvider, fastapiPostProvider } from "./providers/fastapi";
import { supabaseAuthProvider, supabasePostProvider } from "./providers/supabase";
import type { AuthProvider, PostProvider } from "./types";

const isSupabase = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "supabase";

export const authProvider: AuthProvider = isSupabase
  ? supabaseAuthProvider
  : fastapiAuthProvider;

export const postProvider: PostProvider = isSupabase
  ? supabasePostProvider
  : fastapiPostProvider;

export type { AuthProvider, PostProvider };
