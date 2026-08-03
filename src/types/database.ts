export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  college_id: string | null;
  branch: string | null;
  year: string | null;
  state: string | null;
  city: string | null;
  profile_image: string | null;
  is_profile_complete: boolean;
  is_admin?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | null;
  created_at: string;
};

export type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  district?: string | null;
  added_by: string | null;
  created_at: string;
};

export type Community = {
  id: string;
  college_id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_by: string | null;
  status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
  college?: College;
};

export type CommunityMember = {
  id: string;
  user_id: string;
  community_id: string;
  role: 'member' | 'creator' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  joined_at: string;
  profile?: Profile;
  community?: Community;
};

export type Post = {
  id: string;
  community_id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  user_has_liked?: boolean;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type Announcement = {
  id: string;
  community_id: string;
  author_id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  author?: Profile;
};

export type CommunityResource = {
  id: string;
  community_id: string;
  uploaded_by: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  created_at: string;
  uploader?: Profile;
};

export type Event = {
  id: string;
  community_id: string;
  created_by: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  created_at: string;
  creator?: Profile;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};
