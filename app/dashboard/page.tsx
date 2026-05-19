import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const role = session.user.role;

  if (role === 'admin') {
    redirect('/admin/dashboard');
  }

  if (role === 'entrepreneur') {
    redirect('/entrepreneur/dashboard');
  }

  redirect('/customer/dashboard');
}