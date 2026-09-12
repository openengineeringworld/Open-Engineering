'use client';

import { useState } from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { createClient } from '@/lib/supabase/client';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // Send email notification via EmailJS (non-blocking)
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
      } catch (emailErr) {
        console.error('EmailJS error (non-blocking):', emailErr);
      }

      setSuccess(true);
      form.reset();
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Fallback attempt with direct client insert if API route fails
      try {
        const supabase = createClient();
        const { error: insertError } = await supabase.from('contact_submissions').insert({
          name,
          email,
          subject,
          message,
        });

        if (insertError) throw insertError;
        setSuccess(true);
        form.reset();
      } catch (fallbackErr: any) {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="section pt-32 pb-16">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <span className="badge badge-primary mb-4">Contact</span>
            <h1 className="mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed">
              Have a question, project idea, or want to collaborate? We&apos;d love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <FadeIn className="lg:col-span-3">
              <div className="neu-card p-8">
                <h2 className="text-xl font-bold mb-6">Send us a message</h2>
                {success ? (
                  <div className="text-center py-12">
                    <span className="text-5xl block mb-4">✅</span>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-text-muted mb-6">We&apos;ll get back to you as soon as possible.</p>
                    <button onClick={() => setSuccess(false)} className="btn btn-outline btn-sm">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">Name</label>
                        <input id="name" name="name" required className="neu-input" placeholder="Your name" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email</label>
                        <input id="email" name="email" type="email" required className="neu-input" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-text-muted mb-2">Subject</label>
                      <input id="subject" name="subject" required className="neu-input" placeholder="What's this about?" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="neu-input resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>
                    {error && <p className="text-error text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="btn btn-primary w-full">
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>

            {/* Contact Info */}
            <FadeIn delay={0.2} className="lg:col-span-2">
              <div className="space-y-6">
                <div className="neu-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:7086524249" className="text-text-muted hover:text-primary transition-colors text-sm">
                        7086524249
                      </a>
                    </div>
                  </div>
                </div>

                <div className="neu-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:openengineering9@gmail.com" className="text-text-muted hover:text-primary transition-colors text-sm break-all">
                        openengineering9@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="neu-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Instagram</h3>
                      <a href="https://www.instagram.com/openengineeringworld" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors text-sm">
                        @openengineeringworld
                      </a>
                    </div>
                  </div>
                </div>

                <div className="neu-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">LinkedIn</h3>
                      <a href="https://www.linkedin.com/company/openengineeringworld" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors text-sm">
                        Open Engineering
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
