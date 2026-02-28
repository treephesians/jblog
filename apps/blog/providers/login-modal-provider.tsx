"use client";

import { createContext, useContext, useState } from "react";
import { LoginModal } from "@/components/login-modal";

const LoginModalContext = createContext<() => void>(() => {});

export function useLoginModal() {
  return useContext(LoginModalContext);
}

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <LoginModalContext.Provider value={() => setOpen(true)}>
      {children}
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </LoginModalContext.Provider>
  );
}
