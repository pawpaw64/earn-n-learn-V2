
export interface MessageType {
  id: number;
  sender_id: number;
  receiver_id?: number;
  group_id?: number;
  content: string;
  has_attachment: boolean;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface ChatType {
  id: number;
  name: string;
  avatar?: string;
  email?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export interface GroupType {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at: string;
  member_count: number;
  last_message?: string;
  last_message_time?: string;
  is_admin: boolean;
}

export interface GroupMemberType {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  is_admin: boolean;
  joined_at: string;
}
