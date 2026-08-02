'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef0f8]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
    </div>
  );
}
