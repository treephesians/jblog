import { cookies } from 'next/headers';
import type { User } from '@/lib/types/user';

/**
 * 서버 컴포넌트에서 현재 사용자 정보를 가져옵니다.
 * 쿠키에서 access_token을 읽고 백엔드 API를 호출합니다.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      return null;
    }

    // 백엔드 API 호출 (서버 사이드)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/users/me`,
      {
        headers: {
          Cookie: `access_token=${accessToken.value}`,
        },
        cache: 'no-store', // 항상 최신 데이터
      }
    );

    if (!response.ok) {
      return null;
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}
