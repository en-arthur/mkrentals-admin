import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import DashboardPage from './(dashboard)/page';

export default async function Home() {
  // Check if user is authenticated
  const session = await getSession();
  
  if (!session) {
    // Redirect to login if not authenticated
    redirect('/login');
  }
  
  // Render dashboard if authenticated
  return <DashboardPage />;
}
