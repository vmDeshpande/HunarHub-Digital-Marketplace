import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, fonts (public assets)
     * - api routes (except auth routes which need the middleware)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|fonts|api/(?!auth)).*)',
  ],
};
