'use client';

import Logo from '@/components/ui/Logo';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname?.endsWith('/signup');

  return (
    <section className="min-h-screen flex items-center justify-center py-32 px-6">
      <div className={`w-full ${isSignup ? 'max-w-2xl' : 'max-w-md'} transition-all duration-300`}>
        <div className="text-center mb-8">
          <Logo size="md" />
        </div>
        {children}
      </div>
    </section>
  );
}
