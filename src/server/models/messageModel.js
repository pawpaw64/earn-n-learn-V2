
import { execute } from '../config/db.js';

class MessageModel {
  // Create a new direct message
  static async createMessage({ sender_id, receiver_id, content, has_attachment = false, attachment_url = null }) {
    try {
      const result = await execute(
        'INSERT INTO messages (sender_id, receiver_id, content, has_attachment, attachment_url) VALUES (?, ?, ?, ?, ?)',
        [sender_id, receiver_id, content, has_attachment, attachment_url]
      );
      
      // Handle different result formats based on the database client
      const insertId = Array.isArray(result) ? 
        (result[0]?.insertId || result[0][0]?.insertId) : 
        result.insertId;
        
      return insertId;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }
  
  // Get a message by ID
  static async getMessageById(messageId) {
    try {
      const result = await execute(`
        SELECT m.*, 
          sender.name as sender_name, 
          sender.avatar as sender_avatar
        FROM messages m
        JOIN users sender ON m.sender_id = sender.id
        WHERE m.id = ?
      `, [messageId]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows[0];
    } catch (error) {
      console.error('Error getting message by ID:', error);
      throw error;
    }
  }
  
  // Get direct messages between two users
  static async getDirectMessages(user1Id, user2Id) {
    try {
      const result = await execute(`
        SELECT m.*, 
          sender.name as sender_name, 
          sender.avatar as sender_avatar
        FROM messages m
        JOIN users sender ON m.sender_id = sender.id
        WHERE 
          (m.sender_id = ? AND m.receiver_id = ?) OR 
          (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
      `, [user1Id, user2Id, user2Id, user1Id]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows;
    } catch (error) {
      console.error('Error getting direct messages:', error);
      throw error;
    }
  }
  
  // Mark messages as read
  static async markMessagesAsRead(receiverId, senderId) {
    try {
      await execute(`
        UPDATE messages 
        SET is_read = true
        WHERE receiver_id = ? AND sender_id = ? AND is_read = false
      `, [receiverId, senderId]);
      
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
  
  // Get recent chats for a user
  static async getRecentChats(userId) {
    try {
      // This complex query gets the most recent message between the user and each contact
      const result = await execute(`
        SELECT 
          u.id, 
          u.name, 
          u.avatar, 
          u.email,
          (
            SELECT content 
            FROM messages 
            WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?)
            ORDER BY created_at DESC 
            LIMIT 1
          ) as last_message,
          (
            SELECT created_at 
            FROM messages 
            WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?)
            ORDER BY created_at DESC 
            LIMIT 1
          ) as last_message_time,
          (
            SELECT COUNT(*) 
            FROM messages 
            WHERE receiver_id = ? AND sender_id = u.id AND is_read = false
          ) as unread_count
        FROM users u
        WHERE u.id != ? AND EXISTS (
          SELECT 1 
          FROM messages 
          WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?)
        )
        ORDER BY last_message_time DESC
      `, [userId, userId, userId, userId, userId, userId, userId, userId]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows;
    } catch (error) {
      console.error('Error getting recent chats:', error);
      throw error;
    }
  }
  
  // Create a new group
  static async createGroup({ name, description, created_by }) {
    try {
      const result = await execute(
        'INSERT INTO message_groups (name, description, created_by) VALUES (?, ?, ?)',
        [name, description, created_by]
      );
      
      const insertId = Array.isArray(result) ? 
        (result[0]?.insertId || result[0][0]?.insertId) : 
        result.insertId;
        
      return insertId;
    } catch (error) {
      console.error('Error creating message group:', error);
      throw error;
    }
  }
  
  // Get a group by ID
  static async getGroupById(groupId) {
    try {
      const result = await execute(`
        SELECT g.*, 
          creator.name as creator_name,
          creator.avatar as creator_avatar,
          (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
        FROM message_groups g
        JOIN users creator ON g.created_by = creator.id
        WHERE g.id = ?
      `, [groupId]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows[0];
    } catch (error) {
      console.error('Error getting group by ID:', error);
      throw error;
    }
  }
  
  // Get groups for a user
  static async getUserGroups(userId) {
    try {
      const result = await execute(`
        SELECT 
          g.id, 
          g.name, 
          g.description,
          g.created_by, 
          g.created_at,
          (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
          (
            SELECT content 
            FROM messages 
            WHERE group_id = g.id
            ORDER BY created_at DESC 
            LIMIT 1
          ) as last_message,
          (
            SELECT created_at 
            FROM messages 
            WHERE group_id = g.id
            ORDER BY created_at DESC 
            LIMIT 1
          ) as last_message_time,
          gm.is_admin
        FROM message_groups g
        JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = ?
        ORDER BY last_message_time DESC NULLS LAST, g.created_at DESC
      `, [userId]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows;
    } catch (error) {
      console.error('Error getting user groups:', error);
      throw error;
    }
  }
  
  // Create a group message
  static async createGroupMessage({ sender_id, group_id, content, has_attachment = false, attachment_url = null }) {
    try {
      const result = await execute(
        'INSERT INTO messages (sender_id, group_id, content, has_attachment, attachment_url) VALUES (?, ?, ?, ?, ?)',
        [sender_id, group_id, content, has_attachment, attachment_url]
      );
      
      const insertId = Array.isArray(result) ? 
        (result[0]?.insertId || result[0][0]?.insertId) : 
        result.insertId;
        
      return insertId;
    } catch (error) {
      console.error('Error creating group message:', error);
      throw error;
    }
  }
  
  // Get messages for a group
  static async getGroupMessages(groupId) {
    try {
      const result = await execute(`
        SELECT m.*, 
          sender.name as sender_name, 
          sender.avatar as sender_avatar
        FROM messages m
        JOIN users sender ON m.sender_id = sender.id
        WHERE m.group_id = ?
        ORDER BY m.created_at ASC
      `, [groupId]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows;
    } catch (error) {
      console.error('Error getting group messages:', error);
      throw error;
    }
  }
  
  // Add a member to a group
  static async addMemberToGroup({ group_id, user_id, is_admin = false }) {
    try {
      await execute(
        'INSERT INTO group_members (group_id, user_id, is_admin) VALUES (?, ?, ?)',
        [group_id, user_id, is_admin]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding member to group:', error);
      throw error;
    }
  }
  
  // Remove a member from a group
  static async removeMemberFromGroup(groupId, userId) {
    try {
      await execute(
        'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
        [groupId, userId]
      );
      
      return true;
    } catch (error) {
      console.error('Error removing member from group:', error);
      throw error;
    }
  }
  
  // Check if a user is a member of a group
  static async isGroupMember(groupId, userId) {
    try {
      const result = await execute(
        'SELECT COUNT(*) as count FROM group_members WHERE group_id = ? AND user_id = ?',
        [groupId, userId]
      );
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
      
      return rows[0]?.count > 0;
    } catch (error) {
      console.error('Error checking group membership:', error);
      throw error;
    }
  }
  
  // Check if a user is an admin of a group
  static async isGroupAdmin(groupId, userId) {
    try {
      const result = await execute(
        'SELECT COUNT(*) as count FROM group_members WHERE group_id = ? AND user_id = ? AND is_admin = true',
        [groupId, userId]
      );
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
      
      return rows[0]?.count > 0;
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
  }
  
  // Get members of a group
  static async getGroupMembers(groupId) {
    try {
      const result = await execute(`
        SELECT 
          u.id, 
          u.name, 
          u.avatar, 
          u.email,
          gm.is_admin,
          gm.joined_at
        FROM group_members gm
        JOIN users u ON gm.user_id = u.id
        WHERE gm.group_id = ?
        ORDER BY gm.is_admin DESC, gm.joined_at ASC
      `, [groupId]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows;
    } catch (error) {
      console.error('Error getting group members:', error);
      throw error;
    }
  }
  
  // Search for users to message
  static async searchUsers(query, currentUserId) {
    try {
      // Search by name or email, excluding current user
      const result = await execute(`
        SELECT id, name, email, avatar 
        FROM users 
        WHERE id != ? AND (
          LOWER(name) LIKE ? OR 
          LOWER(email) LIKE ?
        )
        LIMIT 10
      `, [currentUserId, `%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`]);
      
      const rows = Array.isArray(result) ? 
        (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
        result.rows || [];
        
      return rows;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export default MessageModel;
