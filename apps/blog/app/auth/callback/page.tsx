'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const redirect = sessionStorage.getItem("loginRedirect") ?? "/";
    sessionStorage.removeItem("loginRedirect");
    router.replace(redirect);
    router.refresh();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">로그인 성공!</h1>
        <p className="text-muted-foreground">홈으로 이동중...</p>
      </div>
    </div>
  );
}
