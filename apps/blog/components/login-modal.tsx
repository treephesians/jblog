"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const handleLogin = () => {
    sessionStorage.setItem("loginRedirect", window.location.pathname);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/login`;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>로그인이 필요합니다</DialogTitle>
          <DialogDescription>
            이 기능을 사용하려면 로그인이 필요합니다. <br />
            Google 계정으로 간편하게 로그인하세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleLogin}>Google로 로그인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
