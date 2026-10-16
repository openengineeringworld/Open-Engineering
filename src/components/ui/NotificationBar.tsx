'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  text: string;
  link: string;
  is_active: boolean;
}

export default function NotificationBar() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Don't show on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdminPage) return;

    async function fetchNotification() {
      try {
        const res = await fetch('/api/admin/notification-bar');
        if (res.ok) {
          const data = await res.json();
          if (data.notification) {
            setNotification(data.notification);
            // Check if user previously dismissed this specific notification
            const dismissedId = sessionStorage.getItem('dismissed_notification');
            if (dismissedId === data.notification.id) {
              setDismissed(true);
            }
          }
        }
      } catch {
        // Silently fail — notification bar is non-critical
      }
    }

    fetchNotification();
  }, [isAdminPage]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    if (notification) {
      sessionStorage.setItem('dismissed_notification', notification.id);
    }
  };

  if (isAdminPage || pathname === '/' || !notification || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-[60]"
      >
        <a
          href={notification.link}
          target={notification.link.startsWith('http') ? '_blank' : '_self'}
          rel={notification.link.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="group block w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold cursor-pointer hover:from-purple-800 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

          <div className="relative flex items-center justify-center gap-2">
            {/* Pulsing dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            
            <span className="truncate">{notification.text}</span>

            {/* Arrow icon */}
            <svg
              className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              aria-label="Dismiss notification"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
