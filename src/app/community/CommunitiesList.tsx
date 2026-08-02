'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';

export default function CommunitiesList({ initialCommunities }: { initialCommunities: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Extract unique districts from the list of communities
  const districts = useMemo(() => {
    const distSet = new Set<string>();
    initialCommunities.forEach((c) => {
      const d = c.college?.district;
      if (d) distSet.add(d);
    });
    return Array.from(distSet).sort();
  }, [initialCommunities]);

  // Filter communities based on search query and selected district
  const filteredCommunities = useMemo(() => {
    return initialCommunities.filter((c) => {
      const name = c.name || '';
      const collegeName = c.college?.name || '';
      const collegeCity = c.college?.city || '';

      const matchesSearch = 
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collegeCity.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDistrict = selectedDistrict ? c.college?.district === selectedDistrict : true;

      return matchesSearch && matchesDistrict;
    });
  }, [initialCommunities, searchQuery, selectedDistrict]);

  return (
    <div className="space-y-8">
      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12 p-6 rounded-2xl border border-purple-200/50 bg-[#eef0f8]/50 shadow-inner">
        <div>
          <label htmlFor="search" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
            Search College / Communities
          </label>
          <input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, college, or city..."
            className="neu-input py-3 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 w-full"
          />
        </div>

        <div>
          <label htmlFor="district" className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
            Filter by District
          </label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="neu-input py-3 px-4 text-xs sm:text-sm border border-purple-200/60 text-slate-900 bg-[#eef0f8] w-full font-medium"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredCommunities.length > 0 ? (
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <StaggerItem key={community.id}>
              <Link href={`/community/${community.id}`} className="block h-full">
                <div className="neu-card p-6 border border-purple-300/40 shadow-[6px_6px_16px_rgba(147,51,234,0.12),-6px_-6px_16px_#ffffff] flex flex-col justify-between h-full group hover:scale-[1.01] hover:shadow-[10px_10px_24px_rgba(147,51,234,0.15),-10px_-10px_24px_#ffffff] transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 neu-convex rounded-2xl flex items-center justify-center text-primary font-black text-xl border border-purple-300/40 shadow-[4px_4px_10px_rgba(147,51,234,0.18),-4px_-4px_10px_#ffffff]">
                      {community.college?.name?.charAt(0) || 'C'}
                    </div>
                    <span className="badge badge-success text-xs font-bold shadow-sm">
                      ● {community.member_count} Members
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg mb-1 text-text group-hover:text-primary transition-colors">{community.name}</h3>
                  <p className="text-text-muted text-xs font-normal">
                    📍 {community.college?.city}, {community.college?.state}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 neu-convex rounded-2xl p-4 flex items-center justify-center border border-purple-300/40 mx-auto mb-4 shadow-sm">
            <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold mb-1 text-text">No active hubs found</h3>
          <p className="text-text-muted text-xs font-normal">
            Try adjusting your search query or selecting a different district.
          </p>
        </div>
      )}
    </div>
  );
}
