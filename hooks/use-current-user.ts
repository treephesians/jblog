"use client";

import { useQuery } from "@tanstack/react-query";
import { authProvider } from "@/lib/backend";
import type { User } from "@/lib/types";

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["current-user"],
    queryFn: () => authProvider.fetchCurrentUser(),
    retry: false,
  });
}

export function useGoogleLogin() {
  return async () => {
    document.cookie = `loginRedirect=${window.location.pathname}; path=/; max-age=300; SameSite=Lax`;
    await authProvider.login();
  };
}

export function useLogout() {
  return async () => {
    await authProvider.logout();
    window.location.href = "/";
  };
}
