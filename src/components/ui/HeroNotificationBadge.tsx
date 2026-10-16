'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface NotificationData {
  id?: string;
  text: string;
  link: string;
  is_active: boolean;
}

export default function HeroNotificationBadge() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchNotification() {
      try {
        const res = await fetch('/api/admin/notification-bar');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.notification && data.notification.is_active && data.notification.text) {
            setNotification(data.notification);
          }
        }
      } catch {
        // Fallback silently to default badge
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchNotification();

    return () => {
      isMounted = false;
    };
  }, []);

  // When active notification is present from admin dashboard
  if (notification && notification.text) {
    const isExternal = notification.link.startsWith('http://') || notification.link.startsWith('https://');

    const badgeContent = (
      <>
        {/* Glowing pulse indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-emerald-400/30" />
        </span>

        {/* Notification Text */}
        <span className="truncate max-w-[240px] sm:max-w-md font-bold tracking-tight">
          {notification.text}
        </span>

        {/* Interactive Arrow Indicator */}
        <svg
          className="w-3.5 h-3.5 text-purple-700 transition-transform duration-200 group-hover:translate-x-1 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </>
    );

    const commonClasses =
      "group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 hover:bg-purple-200/90 border border-purple-200/70 hover:border-purple-300 text-purple-900 text-xs sm:text-sm font-bold shadow-[inset_1px_1px_3px_rgba(147,51,234,0.12),inset_-1px_-1px_3px_#ffffff,0_4px_12px_rgba(147,51,234,0.08)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.16)] transition-all duration-300 hover:scale-[1.02] cursor-pointer";

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isExternal ? (
          <a
            href={notification.link}
            target="_blank"
            rel="noopener noreferrer"
            className={commonClasses}
            title={notification.text}
          >
            {badgeContent}
          </a>
        ) : (
          <Link
            href={notification.link.startsWith('/') ? notification.link : `/${notification.link}`}
            className={commonClasses}
            title={notification.text}
          >
            {badgeContent}
          </Link>
        )}
      </motion.div>
    );
  }

  // Default badge when no active notification is configured in admin dashboard
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/70 border border-purple-200/50 text-purple-800 text-xs font-bold shadow-[inset_1px_1px_3px_rgba(147,51,234,0.1),inset_-1px_-1px_3px_#ffffff]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Open Engineering Ecosystem
      </span>
    </motion.div>
  );
}
