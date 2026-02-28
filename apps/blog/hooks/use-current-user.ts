"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { User } from "@/lib/types/user";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const { data } = await api.get<User>("/api/v1/users/me");
        return data;
      } catch (error: unknown) {
        // 401 에러 (비로그인)는 null 반환
        if (error instanceof Error && error.message.includes("401")) {
          return null;
        }
        return null;
      }
    },
    retry: false,
  });
}

export function useLogout() {
  return async () => {
    await api.post("/api/v1/auth/logout");
    window.location.href = "/";
  };
}
