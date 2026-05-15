import { Suspense } from 'react';

export const metadata = {
  title: 'Authentication - HunarHub',
  description: 'Sign in or create an account on HunarHub',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
