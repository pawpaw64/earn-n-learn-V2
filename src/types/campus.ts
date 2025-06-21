export interface PollOption {
  id: number;
  option_text: string;
  votes?: number;
}

export interface PostType {
  id: number;
  user_id: number;
  type: 'question' | 'discussion' | 'announcement' | 'poll';
  title: string;
  content: string;
  tags: string[];
  privacy: 'public' | 'followers' | 'groups';
  attachment_url?: string;
  attachment_type?: string;
  is_solved?: boolean;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_avatar?: string;
  is_liked?: boolean;
  // Poll-specific properties
  poll_options?: PollOption[];
  total_votes?: number;
  user_voted?: boolean;
  user_vote?: number;
}

export interface CommentType {
  id: number;
  post_id: number;
  user_id: number;
  parent_id?: number;
  content: string;
  likes_count: number;
  created_at: string;
  author_name: string;
  author_avatar?: string;
  is_liked?: boolean;
  replies?: CommentType[];
}

export interface TagType {
  id: number;
  name: string;
  description?: string;
  category: string;
  posts_count: number;
  followers_count: number;
  is_following?: boolean;
}

export interface PostLikeType {
  id: number;
  post_id: number;
  user_id: number;
  created_at: string;
}

export interface CommentLikeType {
  id: number;
  comment_id: number;
  user_id: number;
  created_at: string;
}

export interface TagFollowType {
  id: number;
  tag_id: number;
  user_id: number;
  created_at: string;
}

export interface NotificationType {
  id: number;
  user_id: number;
  type: 'like' | 'comment' | 'answer' | 'mention' | 'tag_activity';
  title: string;
  message: string;
  reference_id?: number;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
}
