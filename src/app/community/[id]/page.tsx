'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Community, CommunityMember, Profile, Post, Comment, Announcement, CommunityResource, Event } from '@/types/database';

export default function CommunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [community, setCommunity] = useState<Community | null>(null);
  const [membership, setMembership] = useState<CommunityMember | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [leadName, setLeadName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);

      // Fetch community details
      let { data: comm } = await supabase
        .from('communities')
        .select('*, college:colleges(*)')
        .eq('id', id)
        .single();

      if (!comm && (id === 'open-engineering-community' || id === 'open-engineering-main')) {
        comm = {
          id: 'open-engineering-community',
          college_id: 'open-engineering-central',
          name: 'Open Engineering Community',
          description: 'Official flagship central engineering hub connecting student engineers, developers, and campus innovators across all engineering disciplines.',
          member_count: 5240,
          created_by: null,
          status: 'approved',
          created_at: new Date().toISOString(),
          college: {
            id: 'open-engineering-central',
            name: 'Open Engineering Central Hub',
            city: 'Pan-India / Online',
            state: 'India',
            district: 'Central',
            added_by: null,
            created_at: new Date().toISOString()
          }
        } as any;
      }

      if (!comm) {
        router.push('/community');
        return;
      }
      setCommunity(comm);

      // Extract leadName & whatsappLink from description or applications/submissions tables
      let lName: string | null = null;
      let wLink: string | null = (comm as any).whatsapp_link || null;

      if (comm.description) {
        const leadMatch = comm.description.match(/Lead:\s*([^.(,@]+)/i);
        if (leadMatch && leadMatch[1]) {
          lName = leadMatch[1].trim();
        }
        const urlMatch = comm.description.match(/(https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com)\/[^\s)]+)/i);
        if (urlMatch && urlMatch[1]) {
          wLink = urlMatch[1];
        }
      }

      try {
        const { data: appData } = await supabase
          .from('community_applications')
          .select('whatsapp_link, leader_name')
          .or(`community_name.eq."${comm.name}",college_full_name.eq."${comm.college?.name}"`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (appData) {
          if (appData.whatsapp_link) wLink = appData.whatsapp_link;
          if (appData.leader_name) lName = appData.leader_name;
        }
      } catch (err) {
        // Table fallback
      }

      // Try contact_submissions table fallback
      if (!wLink || !lName) {
        try {
          const { data: submissions } = await supabase
            .from('contact_submissions')
            .select('message')
            .ilike('subject', 'Community Application:%');

          if (submissions) {
            for (const sub of submissions) {
              try {
                const parsed = JSON.parse(sub.message);
                const isMatch =
                  parsed.community_id === comm.id ||
                  (parsed.community_name && parsed.community_name.toLowerCase() === comm.name.toLowerCase()) ||
                  (parsed.college_full_name && comm.college?.name && parsed.college_full_name.toLowerCase() === comm.college.name.toLowerCase());

                if (isMatch) {
                  if (!wLink && parsed.whatsapp_link) wLink = parsed.whatsapp_link;
                  if (!lName && parsed.leader_name) lName = parsed.leader_name;
                  break;
                }
              } catch {
                // Not JSON
              }
            }
          }
        } catch (err) {
          // Ignore fallback errors
        }
      }

      setLeadName(lName);
      setWhatsappLink(wLink);

      // Fetch user session
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Fetch user profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(prof);

        // Check if user is a member of THIS community
        const { data: mem } = await supabase
          .from('community_members')
          .select('*')
          .eq('user_id', user.id)
          .eq('community_id', id)
          .maybeSingle();

        if (mem) {
          setMembership(mem);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [id, supabase, router]);

  const [copiedLink, setCopiedLink] = useState(false);
  const handleCopyLink = (linkToCopy: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
      </div>
    );
  }

  if (!community) return null;

  const isMember = membership && membership.status === 'approved';
  const isCreator = membership?.role === 'creator';
  const tabs = ['feed', 'announcements', 'members', 'resources', 'events'];
  const activeWhatsappUrl = whatsappLink || 'https://chat.whatsapp.com/open-engineering';

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto space-y-8">
      {/* Back to Communities list */}
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-700 hover:underline"
      >
        ← Back to Communities
      </Link>

      {/* Community Header Card */}
      <div className="neu-card p-8 border border-purple-300/40 shadow-[10px_10px_24px_rgba(147,51,234,0.12),-10px_-10px_24px_#ffffff] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-2xl border border-white/80 shadow-sm shrink-0">
            {community.college?.name?.charAt(0) || community.name.charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mb-1">
              {community.name}
            </h1>
            <p className="text-text-muted text-sm font-medium">
              📍 {community.college?.city ? `${community.college.city}${community.college.state ? `, ${community.college.state}` : ''}` : 'India'}
            </p>
            {leadName && (
              <p className="text-xs font-extrabold text-purple-700 mt-2.5 bg-purple-50 px-3.5 py-1 rounded-full w-max border border-purple-200/60 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                Lead: {leadName}
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp Quick Join Button in Header */}
        <a
          href={activeWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.892 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.637-1.144 4.175 4.275-1.122.613.377z"/>
          </svg>
          <span>Join WhatsApp Group</span>
        </a>
      </div>

      {/* Prominent Dedicated WhatsApp Group Callout Box */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-inner">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.892 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.637-1.144 4.175 4.275-1.122.613.377z"/>
            </svg>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                💬 Campus WhatsApp Hub
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Join {community.name} WhatsApp Group
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              Connect directly with fellow student engineers, get instant announcements, event updates, study vaults, and project collaborations.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full md:w-auto">
          <a
            href={activeWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Join WhatsApp Group</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <button
            onClick={() => handleCopyLink(activeWhatsappUrl)}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copiedLink ? '✓ Copied!' : 'Copy Link 📋'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-purple-200/60 overflow-x-auto gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-5 font-bold text-xs sm:text-sm capitalize transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'border-purple-700 text-purple-700 bg-purple-50/50 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-purple-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'feed' && <FeedTab communityId={community.id} userId={userId || ''} />}
        {activeTab === 'announcements' && <AnnouncementsTab communityId={community.id} userId={userId || ''} isCreator={isCreator} />}
        {activeTab === 'members' && <MembersTab communityId={community.id} />}
        {activeTab === 'resources' && <ResourcesTab communityId={community.id} userId={userId || ''} />}
        {activeTab === 'events' && <EventsTab communityId={community.id} userId={userId || ''} isCreator={isCreator} />}
      </div>
    </section>
  );
}

// ============================================================================
// Sub-components: Feed, Comments, Announcements, Members, Resources, Events
// Reused from dashboard/my-community/page.tsx
// ============================================================================

function FeedTab({ communityId, userId }: { communityId: string; userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, author:profiles(full_name, profile_image)')
      .eq('community_id', communityId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (data) {
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId);

      const likedPostIds = new Set(likes?.map((l) => l.post_id));

      setPosts(
        data.map((p) => ({
          ...p,
          author: Array.isArray(p.author) ? p.author[0] : p.author,
          user_has_liked: likedPostIds.has(p.id),
        }))
      );
    }
  }, [communityId, userId, supabase]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  async function handlePost() {
    if (!newPost.trim()) return;
    setPosting(true);

    await supabase.from('posts').insert({
      community_id: communityId,
      author_id: userId,
      content: newPost.trim(),
    });

    setNewPost('');
    setPosting(false);
    loadPosts();
  }

  async function handleLike(postId: string, liked: boolean) {
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
    }
    loadPosts();
  }

  async function handleDeletePost(postId: string) {
    await supabase.from('posts').delete().eq('id', postId);
    loadPosts();
  }

  function toggleComments(postId: string) {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="neu-card p-5">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="neu-input resize-none mb-3"
          rows={3}
          placeholder="Share something with your community..."
        />
        <div className="flex justify-end">
          <button onClick={handlePost} disabled={posting || !newPost.trim()} className="btn btn-primary btn-sm">
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className={`neu-card p-5 ${post.is_pinned ? 'border-primary/30 border' : ''}`}>
            {post.is_pinned && <span className="badge badge-primary mb-3 text-xs">📌 Pinned</span>}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {post.author?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-medium text-sm">{post.author?.full_name}</p>
                  <p className="text-text-dim text-xs">{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              {post.author_id === userId && (
                <button onClick={() => handleDeletePost(post.id)} className="text-text-dim hover:text-error text-xs">
                  Delete
                </button>
              )}
            </div>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border/20">
              <button
                onClick={() => handleLike(post.id, !!post.user_has_liked)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${post.user_has_liked ? 'text-red-400' : 'text-text-dim hover:text-red-400'}`}
              >
                {post.user_has_liked ? '❤️' : '🤍'} {post.like_count}
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1.5 text-sm text-text-dim hover:text-primary transition-colors"
              >
                💬 {post.comment_count}
              </button>
            </div>
            {expandedComments.has(post.id) && (
              <CommentsSection postId={post.id} userId={userId} />
            )}
          </div>
        ))
      )}
    </div>
  );
}

function CommentsSection({ postId, userId }: { postId: string; userId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const supabase = createClient();

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, author:profiles(full_name, profile_image)')
      .eq('post_id', postId)
      .order('created_at');

    if (data) setComments(data.map((c) => ({ ...c, author: Array.isArray(c.author) ? c.author[0] : c.author })));
  }, [postId, supabase]);

  useEffect(() => { loadComments(); }, [loadComments]);

  async function handleComment() {
    if (!newComment.trim()) return;
    setPosting(true);
    await supabase.from('comments').insert({ post_id: postId, author_id: userId, content: newComment.trim() });
    setNewComment('');
    setPosting(false);
    loadComments();
  }

  return (
    <div className="mt-4 pt-3 border-t border-border/20 space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-surface-light flex items-center justify-center text-text-dim text-xs font-bold shrink-0">
            {comment.author?.full_name?.charAt(0) || '?'}
          </div>
          <div className="flex-1 bg-surface-dark/50 rounded-xl p-3">
            <p className="text-xs font-medium mb-1">{comment.author?.full_name}</p>
            <p className="text-text-muted text-xs">{comment.content}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleComment()}
          className="neu-input text-sm"
          placeholder="Write a comment..."
        />
        <button onClick={handleComment} disabled={posting} className="btn btn-primary btn-sm shrink-0">
          ↑
        </button>
      </div>
    </div>
  );
}

function AnnouncementsTab({ communityId, userId, isCreator }: { communityId: string; userId: string; isCreator: boolean }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*, author:profiles(full_name)')
      .eq('community_id', communityId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) setAnnouncements(data.map((a) => ({ ...a, author: Array.isArray(a.author) ? a.author[0] : a.author })));
  }, [communityId, supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPosting(true);
    const fd = new FormData(e.currentTarget);
    await supabase.from('announcements').insert({
      community_id: communityId,
      author_id: userId,
      title: fd.get('title') as string,
      content: fd.get('content') as string,
    });
    setPosting(false);
    setShowForm(false);
    load();
  }

  return (
    <div className="space-y-4">
      {isCreator && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            {showForm ? 'Cancel' : '+ New Announcement'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="neu-card p-5">
          <form onSubmit={handleAdd} className="space-y-4">
            <input name="title" required className="neu-input" placeholder="Announcement title" />
            <textarea name="content" required className="neu-input resize-none" rows={4} placeholder="Announcement content..." />
            <button type="submit" disabled={posting} className="btn btn-primary btn-sm">
              {posting ? 'Posting...' : 'Post Announcement'}
            </button>
          </form>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="text-center py-12 text-text-muted"><p>No announcements yet.</p></div>
      ) : (
        announcements.map((a) => (
          <div key={a.id} className="neu-card p-6 border-l-4 border-primary">
            <h3 className="font-semibold mb-2">{a.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{a.content}</p>
            <p className="text-text-dim text-xs mt-3">
              By {a.author?.full_name} · {new Date(a.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

function MembersTab({ communityId }: { communityId: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('community_members')
        .select('*, profile:profiles(full_name, profile_image, branch, year, status)')
        .eq('community_id', communityId)
        .eq('status', 'approved')
        .order('joined_at');

      if (data) {
        const mapped = data.map((m) => ({ ...m, profile: Array.isArray(m.profile) ? m.profile[0] : m.profile }));
        setMembers(mapped.filter((m) => m.profile?.status === 'approved'));
      }
    }
    load();
  }, [communityId, supabase]);

  const filtered = members.filter((m) => {
    const fullName = m.profile?.full_name || '';
    const branch = m.profile?.branch || '';
    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      branch.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="neu-input"
        placeholder="Search members..."
      />

      <p className="text-text-dim text-sm">{filtered.length} members</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((member) => (
          <div key={member.id} className="neu-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {member.profile?.full_name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{member.profile?.full_name}</p>
              <p className="text-text-dim text-xs">
                {member.profile?.branch} {member.profile?.year && `· ${member.profile.year}`}
              </p>
            </div>
            {member.role === 'creator' && <span className="badge badge-primary text-xs">Creator</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesTab({ communityId, userId }: { communityId: string; userId: string }) {
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('community_resources')
      .select('*, uploader:profiles(full_name)')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    if (data) setResources(data.map((r) => ({ ...r, uploader: Array.isArray(r.uploader) ? r.uploader[0] : r.uploader })));
  }, [communityId, supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const fd = new FormData(e.currentTarget);
    const file = fd.get('file') as File;
    let fileUrl = fd.get('link_url') as string;
    let fileType = 'link';

    if (file && file.size > 0) {
      const path = `${communityId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('community-resources')
        .upload(path, file);

      if (uploadError) { setUploading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('community-resources').getPublicUrl(path);
      fileUrl = publicUrl;
      fileType = file.type.split('/')[1] || 'file';
    }

    await supabase.from('community_resources').insert({
      community_id: communityId,
      uploaded_by: userId,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      file_url: fileUrl,
      file_type: fileType,
    });

    setUploading(false);
    setShowForm(false);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
          {showForm ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {showForm && (
        <div className="neu-card p-5">
          <form onSubmit={handleAdd} className="space-y-4">
            <input name="title" required className="neu-input" placeholder="Resource title" />
            <input name="description" className="neu-input" placeholder="Description (optional)" />
            <input name="link_url" type="url" className="neu-input" placeholder="Link URL (or upload a file below)" />
            <input name="file" type="file" className="neu-input" />
            <button type="submit" disabled={uploading} className="btn btn-primary btn-sm">
              {uploading ? 'Uploading...' : 'Add Resource'}
            </button>
          </form>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="text-center py-12 text-text-muted"><p>No resources shared yet.</p></div>
      ) : (
        resources.map((r) => (
          <div key={r.id} className="neu-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg shrink-0">
              {r.file_type === 'link' ? '🔗' : '📄'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{r.title}</p>
              {r.description && <p className="text-text-dim text-xs truncate">{r.description}</p>}
              <p className="text-text-dim text-xs">By {r.uploader?.full_name}</p>
            </div>
            <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm shrink-0">
              Open ↗
            </a>
          </div>
        ))
      )}
    </div>
  );
}

function EventsTab({ communityId, userId, isCreator }: { communityId: string; userId: string; isCreator: boolean }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('events')
      .select('*, creator:profiles(full_name)')
      .eq('community_id', communityId)
      .order('event_date');

    if (data) setEvents(data.map((ev) => ({ ...ev, creator: Array.isArray(ev.creator) ? ev.creator[0] : ev.creator })));
  }, [communityId, supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPosting(true);
    const fd = new FormData(e.currentTarget);
    await supabase.from('events').insert({
      community_id: communityId,
      created_by: userId,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      event_date: fd.get('event_date') as string,
      location: fd.get('location') as string,
    });
    setPosting(false);
    setShowForm(false);
    load();
  }

  const now = new Date().toISOString();
  const upcoming = events.filter((e) => e.event_date >= now);
  const past = events.filter((e) => e.event_date < now);

  return (
    <div className="space-y-6">
      {isCreator && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            {showForm ? 'Cancel' : '+ Add Event'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="neu-card p-5">
          <form onSubmit={handleAdd} className="space-y-4">
            <input name="title" required className="neu-input" placeholder="Event title" />
            <textarea name="description" className="neu-input resize-none" rows={3} placeholder="Description" />
            <div className="grid grid-cols-2 gap-4">
              <input name="event_date" type="datetime-local" required className="neu-input" />
              <input name="location" className="neu-input" placeholder="Location (optional)" />
            </div>
            <button type="submit" disabled={posting} className="btn btn-primary btn-sm">
              {posting ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12 text-text-muted"><p>No events scheduled yet.</p></div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Upcoming</h3>
              <div className="space-y-3">
                {upcoming.map((event) => (
                  <div key={event.id} className="neu-card p-5 flex items-start gap-4 border-l-4 border-success">
                    <div className="w-14 h-14 rounded-xl bg-success/10 flex flex-col items-center justify-center text-success shrink-0">
                      <span className="text-lg font-bold">{new Date(event.event_date).getDate()}</span>
                      <span className="text-xs uppercase">{new Date(event.event_date).toLocaleDateString('en', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      {event.description && <p className="text-text-muted text-sm mt-1">{event.description}</p>}
                      <p className="text-text-dim text-xs mt-2">
                        📍 {event.location || 'Online'} · 🕐 {new Date(event.event_date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Past Events</h3>
              <div className="space-y-3 opacity-60">
                {past.map((event) => (
                  <div key={event.id} className="neu-card p-5 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-surface-light flex flex-col items-center justify-center text-text-dim shrink-0">
                      <span className="text-lg font-bold">{new Date(event.event_date).getDate()}</span>
                      <span className="text-xs uppercase">{new Date(event.event_date).toLocaleDateString('en', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-text-dim text-xs mt-1">📍 {event.location || 'Online'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
