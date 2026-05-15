'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { UserRole } from '@/lib/db/models/user.model';

interface SignInOptions {
  email: string;
  password: string;
  callbackUrl?: string;
}

interface SignUpOptions {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const login = useCallback(
    async ({ email, password, callbackUrl }: SignInOptions) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    },
    [router]
  );

  const loginWithGoogle = useCallback(
    async (callbackUrl?: string) => {
      await signIn('google', {
        callbackUrl: callbackUrl || '/dashboard',
      });
    },
    []
  );

  const register = useCallback(
    async ({ name, email, password, role = 'customer' }: SignUpOptions) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto sign-in after registration
      await login({ email, password });

      return data;
    },
    [login]
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  }, [router]);

  const isCustomer = user?.role === 'customer';
  const isEntrepreneur = user?.role === 'entrepreneur';
  const isAdmin = user?.role === 'admin';

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]) => {
      if (!user?.role) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user?.role]
  );

  return {
    user,
    session,
    status,
    isAuthenticated,
    isLoading,
    isCustomer,
    isEntrepreneur,
    isAdmin,
    hasRole,
    login,
    loginWithGoogle,
    register,
    logout,
    update,
  };
}
