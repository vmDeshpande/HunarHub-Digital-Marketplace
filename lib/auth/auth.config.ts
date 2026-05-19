import type { NextAuthConfig } from 'next-auth';
import type { UserRole } from '@/lib/db/models/user.model';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: UserRole;
      entrepreneurId?: string;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: UserRole;
    entrepreneurId?: string;
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Protected routes
      const protectedRoutes = [
        '/dashboard',
        '/profile',
        '/orders',
        '/wishlist',
        '/cart',
        '/checkout',
      ];
      
      const entrepreneurRoutes = ['/entrepreneur'];
      const adminRoutes = ['/admin'];
      
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );
      const isEntrepreneurRoute = entrepreneurRoutes.some((route) =>
        pathname.startsWith(route)
      );
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Redirect unauthenticated users to login
      if ((isProtectedRoute || isEntrepreneurRoute || isAdminRoute) && !isLoggedIn) {
        const callbackUrl = encodeURIComponent(pathname);
        return Response.redirect(
          new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
        );
      }

      // Role-based access control
      if (isLoggedIn && auth?.user) {
        const userRole = auth.user.role;

        // Admin routes require admin role
        if (isAdminRoute && userRole !== 'admin') {
          return Response.redirect(new URL('/unauthorized', nextUrl));
        }

        // Entrepreneur routes require entrepreneur or admin role
        if (isEntrepreneurRoute && !['entrepreneur', 'admin'].includes(userRole)) {
          return Response.redirect(new URL('/unauthorized', nextUrl));
        }
      }

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && pathname.startsWith('/auth')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.entrepreneurId = user.entrepreneurId;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as UserRole;
        session.user.entrepreneurId = token.entrepreneurId ? String(token.entrepreneurId) : undefined;
      }
      return session;
    },
  },
  providers: [], // Providers are added in auth.ts
};
