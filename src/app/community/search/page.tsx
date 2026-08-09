'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import FeaturedCommunitiesSection from '@/components/community/FeaturedCommunitiesSection';

export default function SearchCommunityPage() {
  const [approvedCommunities, setApprovedCommunities] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadApprovedCommunities() {
      const { data: commsData } = await supabase
        .from('communities')
        .select('*, college:colleges(*)')
        .eq('status', 'approved');

      if (commsData) {
        setApprovedCommunities(commsData);
      }
    }

    loadApprovedCommunities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-32 pb-24">
      {/* Top Header */}
      <div className="container mx-auto px-6 max-w-6xl mb-6">
        <div className="flex flex-col items-start mb-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-700 hover:underline mb-4"
          >
            ← Back to Communities Overview
          </Link>
          <span className="badge badge-primary mb-3">All Campus Chapters</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Explore All <span className="gradient-text">Communities</span>
          </h1>
          <p className="text-text-muted text-sm font-normal mt-2 max-w-2xl">
            Browse all verified student campus chapters and search by college or district.
          </p>
        </div>
      </div>

      {/* Featured Communities Explorer Grid (Shows ALL approved communities) */}
      <FeaturedCommunitiesSection initialCommunities={approvedCommunities} showDistrictFilter={true} />
    </div>
  );
}
