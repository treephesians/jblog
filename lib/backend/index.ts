import { supabaseAuthProvider, supabasePostProvider } from "./providers/supabase";
import type { AuthProvider, PostProvider } from "./types";

export const authProvider: AuthProvider = supabaseAuthProvider;
export const postProvider: PostProvider = supabasePostProvider;

export type { AuthProvider, PostProvider };
