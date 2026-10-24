import type { Metadata } from 'next';
import SecretaryClient from './SecretaryClient';

export const metadata: Metadata = {
  title: 'Secretary — AI Super App & Autonomous Personal Assistant',
  description:
    'No worries! Your secretary is here, let it manage. Discover Secretary, an all-in-one AI super app and proactive personal assistant currently being built by Open Engineering.',
  keywords: [
    'Secretary AI',
    'AI Super App',
    'Personal Assistant',
    'Open Engineering',
    'Autonomous AI Agent',
    'Smart Scheduling',
    'Workflow Automation',
  ],
  openGraph: {
    title: 'Secretary — AI Super App & Autonomous Personal Assistant',
    description:
      'No worries! Your secretary is here, let it manage. Built by Open Engineering to autonomously manage your schedules, inbox, tasks, and daily workflows.',
    url: 'https://openeng.in/secretary',
    siteName: 'Open Engineering',
    type: 'website',
    images: [
      {
        url: '/images/products/Secretary%20logo.png',
        width: 800,
        height: 800,
        alt: 'Secretary AI Super App Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secretary — AI Super App & Autonomous Personal Assistant',
    description:
      'No worries! Your secretary is here, let it manage. Built by Open Engineering.',
    images: ['/images/products/Secretary%20logo.png'],
  },
};

export default function SecretaryPage() {
  return <SecretaryClient />;
}
