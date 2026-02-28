'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // 쿠키가 이미 설정되어 있음 (백엔드에서)
    // 홈으로 리다이렉트
    setTimeout(() => {
      router.push('/');
      router.refresh(); // 사용자 정보 다시 불러오기
    }, 1000);
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
