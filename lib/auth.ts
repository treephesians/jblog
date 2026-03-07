import { cookies } from 'next/headers';
import type { User } from '@/lib/types/user';
import { authProvider } from '@/lib/backend';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    return authProvider.getCurrentUser(cookieHeader);
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}
