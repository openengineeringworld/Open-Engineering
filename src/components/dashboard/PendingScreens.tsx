'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function PendingCommunityView({ communityId, collegeName }: { communityId: string; collegeName: string }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`pending-community-${communityId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'communities',
          filter: `id=eq.${communityId}`
        },
        (payload) => {
          if (payload.new && (payload.new as any).status === 'approved') {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId, router, supabase]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="neu-card p-8 sm:p-10 max-w-xl text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
        <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-amber-600 font-black text-3xl mx-auto border border-white/80 shadow-sm animate-pulse">
          ⚡
        </div>
        <span className="badge badge-warning">● Pending Admin Verification</span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
          Awaiting Admin Approval
        </h2>
        <p className="text-slate-700 text-sm font-medium leading-relaxed">
          Your registration for the college chapter <span className="font-extrabold text-purple-700">&ldquo;{collegeName}&rdquo;</span> is currently being reviewed by Open Engineering Admins.
        </p>
        <p className="text-text-muted text-xs font-normal">
          Once approved, your college chapter will go live and you will have full access to discussions, shared resources, events, and member channels.
        </p>
      </div>
    </div>
  );
}

export function PendingMemberView({ userId, membershipId, communityName }: { userId: string; membershipId: string; communityName: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel(`pending-member-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_members',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new && (payload.new as any).status === 'approved') {
            router.refresh();
          } else if (payload.eventType === 'DELETE') {
            router.push('/community/join');
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router, supabase]);

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel your join request?')) return;
    setCancelling(true);
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('id', membershipId);

    if (error) {
      alert(error.message);
      setCancelling(false);
    } else {
      router.push('/community/join');
      router.refresh();
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="neu-card p-8 sm:p-10 max-w-xl text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
        <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-purple-700 font-black text-3xl mx-auto border border-white/80 shadow-sm animate-pulse">
          ⏳
        </div>
        <span className="badge badge-warning">● Pending Campus Approval</span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
          Awaiting Approval
        </h2>
        <p className="text-slate-700 text-sm font-medium leading-relaxed">
          Your request to join the college chapter <span className="font-extrabold text-purple-700">&ldquo;{communityName}&rdquo;</span> is pending approval from the Campus Admin.
        </p>
        <p className="text-text-muted text-xs font-normal">
          Once approved, you will have full access to discussions, shared resources, events, and member channels.
        </p>
        <div className="pt-4 border-t border-purple-200/40">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="py-3 px-6 rounded-xl border border-rose-200 text-rose-700 font-bold text-xs hover:text-rose-950 hover:bg-rose-50/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Join Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PendingProfileView({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`pending-profile-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          if (payload.new && (payload.new as any).status === 'approved') {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router, supabase]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="neu-card p-8 sm:p-10 max-w-xl text-center border border-purple-300/60 shadow-[12px_12px_28px_rgba(147,51,234,0.16),-12px_-12px_28px_#ffffff] space-y-6">
        <div className="w-16 h-16 neu-convex rounded-2xl flex items-center justify-center text-amber-600 font-black text-3xl mx-auto border border-white/80 shadow-sm animate-pulse">
          ⏳
        </div>
        <span className="badge badge-warning">● Pending Verification</span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
          Awaiting Verification
        </h2>
        <p className="text-slate-700 text-sm font-medium leading-relaxed">
          Your account is currently pending verification by Open Engineering Admins.
        </p>
        <p className="text-text-muted text-xs font-normal">
          Once verified, your profile status will be activated and you will gain full access to the platform.
        </p>
      </div>
    </div>
  );
}
