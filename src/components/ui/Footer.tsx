'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';

const footerLinks = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact Us' },
  ],
  career: [
    { href: '/jobs', label: 'Job Openings' },
    { href: '/internship', label: 'Internships' },
    { href: '/academy', label: 'Engineering Academy' },
    { href: '/community', label: 'Campus Chapters' },
  ],
};

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard routes as they have their own layout
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-16 pb-12 bg-background border-t border-border/40 mt-20">
      <div className="container mx-auto px-6">

        {/* 2. Main Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand & Socials Column */}
          <div className="lg:col-span-4">
            <Logo size="lg" className="mb-5" />
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-sm font-normal">
              Empowering students to learn engineering concepts & apply them to real-world challenges. 
              Connecting campus communities across the nation.
            </p>

            {/* Tactile Neumorphic Social Buttons */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/openengineeringworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-2xl neu-card flex items-center justify-center text-text-muted hover:text-pink-500 hover:shadow-[6px_6px_16px_rgba(236,72,153,0.25),-6px_-6px_16px_#ffffff] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/openengineeringworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-2xl neu-card flex items-center justify-center text-text-muted hover:text-purple-600 hover:shadow-[6px_6px_16px_rgba(147,51,234,0.25),-6px_-6px_16px_#ffffff] transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

            </div>
          </div>

          {/* Company Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-text font-bold mb-4 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Career & Learning Column */}
          <div className="lg:col-span-3">
            <h4 className="text-text font-bold mb-4 text-xs uppercase tracking-wider">Careers & Learning</h4>
            <ul className="space-y-3">
              {footerLinks.career.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div className="lg:col-span-3">
            <h4 className="text-text font-bold mb-4 text-xs uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:7086524249"
                className="neu-card p-3 flex items-center gap-3 text-text-muted hover:text-primary transition-all text-xs font-semibold"
              >
                <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-primary shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>7086524249</span>
              </a>

              <a
                href="mailto:openengineering9@gmail.com"
                className="neu-card p-3 flex items-center gap-3 text-text-muted hover:text-primary transition-all text-xs font-semibold"
              >
                <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-primary shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="truncate">openengineering9@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="divider mb-8" />

        {/* 3. Bottom Legal & Back to Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-text-dim text-xs font-medium">
            © {new Date().getFullYear()} Open Engineering. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/community" className="text-text-dim hover:text-primary transition-colors text-xs font-medium">
              Campus Chapters
            </Link>
            <Link href="/about" className="text-text-dim hover:text-primary transition-colors text-xs font-medium">
              About
            </Link>
            {/* Tactile Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="btn btn-secondary btn-sm flex items-center gap-1.5 shadow-sm text-xs"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
