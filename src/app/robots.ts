import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://openeng.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/community/dashboard/', '/community/login/', '/community/signup/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
