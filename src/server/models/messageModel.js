
import db from '../config/db.js';

class MessageModel {
  // Get direct messages between two users
  static async getDirectMessages(userId, contactId) {
    try {
        console.log('getDirectMessages - userId:', userId, 'contactId:', contactId);
      const [rows] = await db.query(
        `SELECT m.*, 
          u1.name as sender_name, 
          u1.avatar as sender_avatar
        FROM messages m
        JOIN users u1 ON m.sender_id = u1.id
        WHERE (m.sender_id = ? AND m.receiver_id = ?) 
          OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC`,
        [userId, contactId, contactId, userId]
      );
    // Ensure sender_id is returned as a number
      const processedRows = rows.map(row => ({
        ...row,
        sender_id: Number(row.sender_id),
        receiver_id: row.receiver_id ? Number(row.receiver_id) : null,
        group_id: row.group_id ? Number(row.group_id) : null
      }));
      
      console.log('getDirectMessages - returning rows:', processedRows.length, 'first row:', processedRows[0]);
      return processedRows;
    } catch (error) {
      console.error('Error in getDirectMessages:', error);
      throw error;
    }
  }

  // Get recent contacts/chats for a user
  static async getRecentChats(userId) {
    try {
      const [rows] = await db.query(
        `SELECT 
          u.id, 
          u.name, 
          u.avatar,
          (SELECT m.content FROM messages m 
           WHERE (m.sender_id = u.id AND m.receiver_id = ?)
           OR (m.sender_id = ? AND m.receiver_id = u.id)
           ORDER BY m.created_at DESC LIMIT 1) as last_message,
          (SELECT m.created_at FROM messages m 
           WHERE (m.sender_id = u.id AND m.receiver_id = ?)
           OR (m.sender_id = ? AND m.receiver_id = u.id)
           ORDER BY m.created_at DESC LIMIT 1) as last_message_time,
          (SELECT COUNT(*) FROM messages m 
           WHERE m.sender_id = u.id AND m.receiver_id = ? AND m.is_read = false) as unread_count
        FROM users u
        WHERE u.id IN (
          SELECT DISTINCT 
            CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
          FROM messages m
          WHERE m.sender_id = ? OR m.receiver_id = ?
        )
        ORDER BY last_message_time DESC`,
        [userId, userId, userId, userId, userId, userId, userId, userId]
      );
      return rows;
    } catch (error) {
      console.error('Error in getRecentChats:', error);
      throw error;
    }
  }

  // Send a message
  static async sendMessage(senderId, receiverId, content, hasAttachment = false, attachmentUrl = null) {
    try {
         console.log('sendMessage - senderId:', senderId, 'receiverId:', receiverId);
      const [result] = await db.query(
        'INSERT INTO messages (sender_id, receiver_id, content, has_attachment, attachment_url) VALUES (?, ?, ?, ?, ?)',
        [senderId, receiverId, content, hasAttachment, attachmentUrl]
      );
      
      const [newMessage] = await db.query(
        `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.id = ?`,
        [result.insertId]
      );
      
     // Ensure proper number formatting
      const processedMessage = {
        ...newMessage[0],
        sender_id: Number(newMessage[0].sender_id),
        receiver_id: newMessage[0].receiver_id ? Number(newMessage[0].receiver_id) : null,
        group_id: newMessage[0].group_id ? Number(newMessage[0].group_id) : null
      };
      
      console.log('sendMessage - returning message:', processedMessage);
      return processedMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }

  // Mark messages as read
  static async markAsRead(senderId, receiverId) {
    try {
      const [result] = await db.query(
        'UPDATE messages SET is_read = true WHERE sender_id = ? AND receiver_id = ? AND is_read = false',
        [senderId, receiverId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  }

  // Create a group
  static async createGroup(name, description, createdBy) {
    try {
      const [result] = await db.query(
        'INSERT INTO message_groups (name, description, created_by) VALUES (?, ?, ?)',
        [name, description, createdBy]
      );
      
      // Add creator as admin
      await db.query(
        'INSERT INTO group_members (group_id, user_id, is_admin) VALUES (?, ?, true)',
        [result.insertId, createdBy]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error in createGroup:', error);
      throw error;
    }
  }

  // Get user groups
  static async getUserGroups(userId) {
    try {
      const [rows] = await db.query(
        `SELECT g.*, 
          (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) as member_count,
          (SELECT m.content FROM messages m 
           WHERE m.group_id = g.id
           ORDER BY m.created_at DESC LIMIT 1) as last_message,
          (SELECT m.created_at FROM messages m 
           WHERE m.group_id = g.id
           ORDER BY m.created_at DESC LIMIT 1) as last_message_time,
          gm.is_admin
        FROM message_groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?
        ORDER BY last_message_time DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error in getUserGroups:', error);
      throw error;
    }
  }

  // Get group messages
  static async getGroupMessages(groupId) {
    try {
           console.log('getGroupMessages - groupId:', groupId);
      const [rows] = await db.query(
        `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.group_id = ?
         ORDER BY m.created_at ASC`,
        [groupId]
      );
 
      // Ensure sender_id is returned as a number
      const processedRows = rows.map(row => ({
        ...row,
        sender_id: Number(row.sender_id),
        receiver_id: row.receiver_id ? Number(row.receiver_id) : null,
        group_id: row.group_id ? Number(row.group_id) : null
      }));
      
      console.log('getGroupMessages - returning rows:', processedRows.length);
      return processedRows;
    } catch (error) {
      console.error('Error in getGroupMessages:', error);
      throw error;
    }
  }

  // Send group message
  static async sendGroupMessage(senderId, groupId, content, hasAttachment = false, attachmentUrl = null) {
    try {   console.log('sendGroupMessage - senderId:', senderId, 'groupId:', groupId);
      const [result] = await db.query(
        'INSERT INTO messages (sender_id, group_id, content, has_attachment, attachment_url) VALUES (?, ?, ?, ?, ?)',
        [senderId, groupId, content, hasAttachment, attachmentUrl]
      );
      
      const [newMessage] = await db.query(
        `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.id = ?`,
        [result.insertId]
      );
      
     // Ensure proper number formatting
      const processedMessage = {
        ...newMessage[0],
        sender_id: Number(newMessage[0].sender_id),
        receiver_id: newMessage[0].receiver_id ? Number(newMessage[0].receiver_id) : null,
        group_id: newMessage[0].group_id ? Number(newMessage[0].group_id) : null
      };
      
      console.log('sendGroupMessage - returning message:', processedMessage);
      return processedMessage;
    } catch (error) {
      console.error('Error in sendGroupMessage:', error);
      throw error;
    }
  }

  // Add user to group
  static async addToGroup(groupId, userId, isAdmin = false) {
    try {
      const [result] = await db.query(
        'INSERT INTO group_members (group_id, user_id, is_admin) VALUES (?, ?, ?)',
        [groupId, userId, isAdmin]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in addToGroup:', error);
      throw error;
    }
  }

  // Remove user from group
  static async removeFromGroup(groupId, userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
        [groupId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in removeFromGroup:', error);
      throw error;
    }
  }

  // Get group members
  static async getGroupMembers(groupId) {
    try {
      const [rows] = await db.query(
        `SELECT u.id, u.name, u.avatar, u.email, gm.is_admin, gm.joined_at
         FROM users u
         JOIN group_members gm ON u.id = gm.user_id
         WHERE gm.group_id = ?`,
        [groupId]
      );
      return rows;
    } catch (error) {
      console.error('Error in getGroupMembers:', error);
      throw error;
    }
  }

  // Search for users to message
  static async searchUsers(query, currentUserId) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.query(
        `SELECT id, name, email, avatar 
         FROM users 
         WHERE (name LIKE ? OR email LIKE ?) AND id != ?
         LIMIT 10`,
        [searchTerm, searchTerm, currentUserId]
      );
      return rows;
    } catch (error) {
      console.error('Error in searchUsers:', error);
      throw error;
    }
  }
}

export default MessageModel;
