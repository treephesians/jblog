"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { User } from "@/lib/types/user";

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const { data } = await api.get<User>("/api/v1/users/me");
        return data;
      } catch {
        return null;
      }
    },
    retry: false,
  });
}

export function useGoogleLogin() {
  return () => {
    sessionStorage.setItem("loginRedirect", window.location.pathname);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/login`;
  };
}

export function useLogout() {
  return async () => {
    await api.post("/api/v1/auth/logout");
    window.location.href = "/";
  };
}
