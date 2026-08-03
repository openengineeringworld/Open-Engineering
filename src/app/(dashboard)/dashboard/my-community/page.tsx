'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Post, Comment, Announcement, CommunityResource, Event, Community, CommunityMember, Profile } from '@/types/database';

export default function MyCommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [community, setCommunity] = useState<Community | null>(null);
  const [membership, setMembership] = useState<CommunityMember | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: mem } = await supabase
        .from('community_members')
        .select('*, community:communities(*, college:colleges(*))')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!mem) {
        router.push('/community/join');
        return;
      }

      setMembership(mem);
      const comm = Array.isArray(mem.community) ? mem.community[0] : mem.community;
      setCommunity(comm);
      setLoading(false);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="loading-spinner" /></div>;
  if (!community || !membership || !userId) return null;

  // Handle pending join request screen
  if (membership.status === 'pending') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12">
        <div className="neu-card p-8 sm:p-10 max-w-xl text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
          <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-3xl mx-auto border border-white/80 shadow-sm animate-pulse">
            ⏳
          </div>
          <span className="badge badge-warning">● Pending Campus Approval</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Awaiting Approval
          </h2>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            Your request to join the college chapter <span className="font-extrabold text-purple-700">&ldquo;{community.name}&rdquo;</span> has been sent to the Campus Admin for approval.
          </p>
          <p className="text-text-muted text-xs font-normal">
            Once the Campus Admin approves your request, you will immediately unlock access to the discussion feed, announcements, resources, and events.
          </p>
          <div className="pt-4 border-t border-purple-200/40">
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to cancel your join request?')) {
                  await supabase.from('community_members').delete().eq('id', membership.id);
                  router.push('/community/join');
                  router.refresh();
                }
              }}
              className="py-3 px-6 rounded-xl border border-rose-200 text-rose-700 font-bold text-xs hover:text-rose-950 hover:bg-rose-50/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Cancel Join Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCreator = membership.role === 'creator';
  const isAdmin = membership.role === 'creator' || membership.role === 'admin';
  const tabs = ['feed', 'announcements', 'members', 'resources', 'events'];
  if (isAdmin) {
    tabs.push('requests');
  }

  return (
    <div>
      {/* Community Header */}
      <div className="neu-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{community.name}</h1>
            <p className="text-text-muted text-sm">{community.description}</p>
            <p className="text-text-dim text-xs mt-1">
              {community.member_count} members · {membership.role === 'creator' ? 'Creator' : membership.role === 'admin' ? 'Admin' : 'Member'}
            </p>
          </div>
          <button
            onClick={async () => {
              if (confirm('Are you sure you want to leave the community?')) {
                await supabase.from('community_members').delete().eq('id', membership.id);
                router.push('/community/join');
                router.refresh();
              }
            }}
            className="btn btn-ghost btn-sm text-error"
          >
            Leave Community
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-trigger capitalize ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' && <FeedTab communityId={community.id} userId={userId} />}
      {activeTab === 'announcements' && <AnnouncementsTab communityId={community.id} userId={userId} isCreator={isAdmin} />}
      {activeTab === 'members' && <MembersTab communityId={community.id} currentMembership={membership} />}
      {activeTab === 'resources' && <ResourcesTab communityId={community.id} userId={userId} />}
      {activeTab === 'events' && <EventsTab communityId={community.id} userId={userId} isCreator={isAdmin} />}
      {activeTab === 'requests' && <RequestsTab communityId={community.id} />}
    </div>
  );
}

// ========================================
// FEED TAB
// ========================================
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
      // Check which posts user has liked
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
      {/* Create Post */}
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

      {/* Posts */}
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
            {post.image_url && (
              <img src={post.image_url} alt="Post" className="mt-3 rounded-xl max-h-80 object-cover w-full" />
            )}
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

// ========================================
// COMMENTS SECTION
// ========================================
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

// ========================================
// ANNOUNCEMENTS TAB
// ========================================
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

// ========================================
// MEMBERS TAB
// ========================================
function MembersTab({ communityId, currentMembership }: { communityId: string; currentMembership: CommunityMember }) {
  const [members, setMembers] = useState<(CommunityMember & { profile?: Profile })[]>([]);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  const load = useCallback(async () => {
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
  }, [communityId, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleAdmin(memberId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    const { error } = await supabase
      .from('community_members')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) {
      alert(error.message);
    } else {
      load();
    }
  }

  const filtered = members.filter((m) => {
    const fullName = m.profile?.full_name || '';
    const branch = m.profile?.branch || '';
    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      branch.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isCreator = currentMembership.role === 'creator';

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
            {member.profile?.profile_image ? (
              <img src={member.profile.profile_image} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {member.profile?.full_name?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{member.profile?.full_name}</p>
              <p className="text-text-dim text-xs">
                {member.profile?.branch} {member.profile?.year && `· ${member.profile.year}`}
              </p>
            </div>
            
            {/* Roles and Actions */}
            <div className="flex items-center gap-2">
              {member.role === 'creator' && <span className="badge badge-primary text-xs">Creator</span>}
              {member.role === 'admin' && <span className="badge badge-success text-xs">Admin</span>}
              
              {isCreator && member.role !== 'creator' && (
                <button
                  onClick={() => handleToggleAdmin(member.id, member.role)}
                  className={`py-1 px-2.5 rounded-lg font-bold text-[10px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all ${
                    member.role === 'admin'
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// RESOURCES TAB
// ========================================
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
              {r.file_type === 'link' ? '🔗' : r.file_type === 'pdf' ? '📄' : '📁'}
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

// ========================================
// EVENTS TAB
// ========================================
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

// ========================================
// JOIN REQUESTS TAB
// ========================================
function RequestsTab({ communityId }: { communityId: string }) {
  const [requests, setRequests] = useState<(CommunityMember & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('community_members')
      .select('*, profile:profiles(*)')
      .eq('community_id', communityId)
      .eq('status', 'pending')
      .order('joined_at');

    if (data) {
      setRequests(data.map((r) => ({ ...r, profile: Array.isArray(r.profile) ? r.profile[0] : r.profile })));
    }
    setLoading(false);
  }, [communityId, supabase]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  async function handleApprove(requestId: string, memberUserId: string) {
    const { error } = await supabase
      .from('community_members')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (error) {
      alert(error.message);
      return;
    }

    // Also approve student profile status
    await supabase
      .from('profiles')
      .update({ status: 'approved' })
      .eq('id', memberUserId);

    loadRequests();
  }

  async function handleReject(requestId: string) {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('id', requestId);

    if (error) {
      alert(error.message);
    } else {
      loadRequests();
    }
  }

  if (loading) return <div className="text-center py-6 text-xs text-text-dim">Loading requests...</div>;

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-sm text-slate-900 mb-2">Pending Access Requests</h3>
      {requests.length === 0 ? (
        <div className="text-center py-12 text-text-muted neu-card p-6 border border-purple-300/20 shadow-sm">
          <p className="text-xs font-semibold">No pending join requests for this campus chapter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="neu-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-300/30 shadow-[4px_4px_12px_rgba(147,51,234,0.06),-4px_-4px_12px_#ffffff]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-sm border border-white/80 shrink-0">
                  {req.profile?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-900">{req.profile?.full_name}</p>
                  <p className="text-text-muted text-xs font-normal">
                    {req.profile?.branch} {req.profile?.year && `· ${req.profile.year}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApprove(req.id, req.user_id)}
                  className="py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="py-2 px-4 rounded-xl border border-rose-200 text-rose-700 font-bold text-xs hover:text-rose-950 hover:bg-rose-50/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
