'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';

export interface DatabaseCommunityItem {
  id: string;
  name: string;
  collegeName: string;
  location: string;
  memberCount: number;
  badgeText: string;
  category: string;
  tags: string[];
  description: string;
}

interface FeaturedCommunitiesSectionProps {
  initialCommunities?: any[];
  limit?: number;
  showDistrictFilter?: boolean;
}

export default function FeaturedCommunitiesSection({
  initialCommunities = [],
  limit,
  showDistrictFilter = false,
}: FeaturedCommunitiesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Map ONLY database communities that are approved
  const communities = useMemo(() => {
    if (!Array.isArray(initialCommunities) || initialCommunities.length === 0) {
      return [];
    }

    return initialCommunities.map((dbComm) => {
      const isCentral = dbComm.id === 'open-engineering-community' || dbComm.id === 'open-engineering-central';
      return {
        id: dbComm.id,
        name: dbComm.name,
        collegeName: dbComm.college?.name || (isCentral ? 'Open Engineering Central Hub' : 'Campus Chapter'),
        district: dbComm.college?.district || '',
        location: dbComm.college?.city
          ? `${dbComm.college.city}${dbComm.college.state ? `, ${dbComm.college.state}` : ''}`
          : 'India',
        memberCount: dbComm.member_count || 1,
        badgeText: isCentral ? '👑 Central Hub' : '⚡ Approved Chapter',
        category: isCentral ? 'central' : 'approved',
        tags: ['Engineering', 'Campus Chapter', 'Projects'],
        description: dbComm.description || 'Approved official campus engineering chapter connecting students and projects.',
      };
    });
  }, [initialCommunities]);

  // Unique list of districts for filtering
  const districts = useMemo(() => {
    const distSet = new Set<string>();
    communities.forEach((c) => {
      if (c.district) distSet.add(c.district);
    });
    return Array.from(distSet).sort();
  }, [communities]);

  // Filter list based on user search query and district
  const filteredList = useMemo(() => {
    return communities.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || (
        item.name.toLowerCase().includes(query) ||
        item.collegeName.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
      const matchesDistrict = !selectedDistrict || item.district === selectedDistrict;

      return matchesQuery && matchesDistrict;
    });
  }, [communities, searchQuery, selectedDistrict]);

  // If limit is specified and user isn't searching/filtering, show only top `limit` items
  const displayedList = useMemo(() => {
    if (searchQuery.trim() !== '' || selectedDistrict !== '') {
      return filteredList;
    }
    if (limit && limit > 0) {
      return filteredList.slice(0, limit);
    }
    return filteredList;
  }, [filteredList, searchQuery, selectedDistrict, limit]);

  return (
    <section className="section-sm pb-16 pt-4 relative">
      <div className="container mx-auto px-6">
        {/* Header, Search Bar & Join Button Row */}
        <FadeIn className="max-w-6xl mx-auto mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight text-left">
              {limit ? 'Featured Communities' : 'Explore All Communities'}
            </h2>
            {limit && (
              <p className="text-xs text-slate-500 font-medium mt-1">
                Displaying {displayedList.length} of {communities.length} approved communities. Type in search bar to find matching chapters.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* District Filter Dropdown (Optional / when enabled) */}
            {showDistrictFilter && districts.length > 0 && (
              <div className="w-full sm:w-44 relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full py-2 px-3 bg-white/90 backdrop-blur-xs border border-purple-200/80 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-xs transition-all"
                >
                  <option value="">All Districts</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search Control */}
            {communities.length > 0 && (
              <div className="w-full sm:w-64 md:w-72 relative flex items-center">
                <svg
                  className="w-4 h-4 text-purple-500 absolute left-3.5 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community name, college..."
                  className="w-full pl-10 pr-9 py-2 bg-white/90 backdrop-blur-xs border border-purple-200/80 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Search & Join Button */}
            {limit && (
              <Link
                href="/community/search"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
              >
                <span>Explore Rest of Communities</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>
        </FadeIn>

        {/* Communities Grid */}
        {displayedList.length > 0 ? (
          <>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {displayedList.map((comm) => (
                <StaggerItem key={comm.id}>
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-5 border border-purple-100/80 shadow-[0_4px_16px_rgba(147,51,234,0.05)] hover:shadow-[0_8px_24px_rgba(147,51,234,0.12)] hover:border-purple-200 transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      {/* Top Row: Avatar + Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-sm shrink-0">
                          {comm.name.charAt(0)}
                        </div>
                        <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                          {comm.category === 'central' ? 'Central Hub' : 'Approved Chapter'}
                        </span>
                      </div>

                      {/* Community Title & College */}
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 mb-1">
                        {comm.name}
                      </h3>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <svg className="w-3.5 h-3.5 shrink-0 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
                          </svg>
                          <span className="truncate">{comm.collegeName}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{comm.location}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                        {comm.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-purple-100/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {comm.memberCount.toLocaleString()} {comm.memberCount === 1 ? 'Member' : 'Members'}
                      </span>

                      <Link
                        href={`/community/${comm.id}`}
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1"
                      >
                        <span>Explore Chapter</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>

            {/* Explore Rest All Communities Button when limit is set & search query is empty */}
            {limit && communities.length > limit && !searchQuery.trim() && !selectedDistrict && (
              <div className="mt-8 text-center max-w-6xl mx-auto">
                <Link
                  href="/community/search"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Rest All Communities ({communities.length})</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 max-w-md mx-auto bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-purple-100 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {communities.length === 0 ? 'No Approved Communities Yet' : 'No Community Matched'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5 leading-relaxed">
              {communities.length === 0
                ? 'Only verified and approved communities appear here. Be the first to launch a campus chapter!'
                : 'No approved communities matched your search criteria.'}
            </p>

            {communities.length === 0 ? (
              <Link
                href="/community/create"
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
              >
                Launch Campus Chapter ⚡
              </Link>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDistrict('');
                }}
                className="px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors"
              >
                Reset Search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

