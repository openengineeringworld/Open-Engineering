import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function CommunityDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/community/login?redirect=/community/dashboard');
  }

  // Redirect to the ambassador's college community dashboard
  redirect('/dashboard/my-community');
}
