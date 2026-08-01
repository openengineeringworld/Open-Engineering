import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Open Engineering — Learn Engineering, Build Real Solutions',
    template: '%s | Open Engineering',
  },
  description:
    'Empowering students to learn engineering concepts and apply them to real-world challenges. Join college-wise engineering communities.',
  keywords: ['engineering', 'students', 'community', 'education', 'technology', 'web development'],
  openGraph: {
    title: 'Open Engineering',
    description: 'Empowering students to learn engineering & apply it to real-life challenges.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Open Engineering',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
