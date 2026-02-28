"use client";

import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { LogIn, LogOut } from "lucide-react";
import type { User } from "@/lib/types/user";
import api from "@/lib/api";

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const handleLogin = () => {
    sessionStorage.setItem("loginRedirect", window.location.pathname);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/login`;
  };

  const handleLogout = async () => {
    await api.post("/api/v1/auth/logout");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <Button variant="ghost" size="icon" onClick={handleLogin}>
        <LogIn className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-6 w-6">
            {user.avatar_url && <AvatarImage src={user.avatar_url} alt="" />}
            <AvatarFallback>
              {user.email?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">사용자 메뉴</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.full_name || "사용자"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
