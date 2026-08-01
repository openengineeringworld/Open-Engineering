import Logo from '@/components/ui/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center py-32 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="md" />
        </div>
        {children}
      </div>
    </section>
  );
}
