
import { execute } from '../config/db.js';

class MessageModel {
  // Create a new conversation
  static async createConversation(userData) {
    const { title, creator_id, participants } = userData;
    try {
      // First create the conversation
      const result = await execute(
        'INSERT INTO conversations (title, creator_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [title, creator_id]
      );
      
      const conversationId = result[0].insertId;
      
      // Then add participants
      for (const participantId of participants) {
        await execute(
          'INSERT INTO conversation_participants (conversation_id, user_id, joined_at) VALUES (?, ?, NOW())',
          [conversationId, participantId]
        );
      }
      
      // Make sure to add creator as participant if not already in the list
      if (!participants.includes(creator_id)) {
        await execute(
          'INSERT INTO conversation_participants (conversation_id, user_id, joined_at) VALUES (?, ?, NOW())',
          [conversationId, creator_id]
        );
      }
      
      return { conversationId };
    } catch (error) {
      console.error('MessageModel.createConversation() - Error:', error);
      throw new Error('Failed to create conversation');
    }
  }

  // Create a direct message conversation between two users
  static async createOrGetDirectConversation(userId1, userId2) {
    try {
      // Check if direct conversation already exists
      const existingConvo = await execute(`
        SELECT c.id 
        FROM conversations c
        JOIN conversation_participants p1 ON c.id = p1.conversation_id AND p1.user_id = ?
        JOIN conversation_participants p2 ON c.id = p2.conversation_id AND p2.user_id = ?
        WHERE c.is_group = 0 AND (
          SELECT COUNT(*) FROM conversation_participants WHERE conversation_id = c.id
        ) = 2
      `, [userId1, userId2]);
      
      if (existingConvo[0] && existingConvo[0].length > 0) {
        return { conversationId: existingConvo[0][0].id, isNew: false };
      }
      
      // Create new direct conversation
      const result = await execute(
        'INSERT INTO conversations (title, creator_id, is_group, created_at, updated_at) VALUES (?, ?, 0, NOW(), NOW())',
        ['Direct Message', userId1]
      );
      
      const conversationId = result[0].insertId;
      
      // Add both users as participants
      await execute(
        'INSERT INTO conversation_participants (conversation_id, user_id, joined_at) VALUES (?, ?, NOW()), (?, ?, NOW())',
        [conversationId, userId1, conversationId, userId2]
      );
      
      return { conversationId, isNew: true };
    } catch (error) {
      console.error('MessageModel.createOrGetDirectConversation() - Error:', error);
      throw new Error('Failed to create or get direct conversation');
    }
  }

  // Send a message
  static async sendMessage(messageData) {
    const { conversation_id, sender_id, content, attachment_url, is_system_message } = messageData;
    try {
      // First insert the message
      const result = await execute(
        'INSERT INTO messages (conversation_id, sender_id, content, attachment_url, is_system_message, sent_at, is_read) VALUES (?, ?, ?, ?, ?, NOW(), 0)',
        [conversation_id, sender_id, content, attachment_url || null, is_system_message || 0]
      );
      
      // Update conversation's updated_at timestamp
      await execute(
        'UPDATE conversations SET updated_at = NOW(), last_message = ? WHERE id = ?',
        [content, conversation_id]
      );
      
      return { messageId: result[0].insertId };
    } catch (error) {
      console.error('MessageModel.sendMessage() - Error:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get all conversations for a user
  static async getConversationsByUserId(userId) {
    try {
      const result = await execute(`
        SELECT 
          c.id, 
          c.title,
          c.is_group,
          c.created_at,
          c.updated_at,
          c.last_message,
          (
            SELECT COUNT(*) 
            FROM messages m 
            JOIN conversation_participants cp ON cp.conversation_id = c.id
            WHERE m.conversation_id = c.id AND m.is_read = 0 AND m.sender_id != ? AND cp.user_id = ?
          ) as unread_count,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', u.id,
                'name', u.name,
                'avatar', u.avatar
              )
            )
            FROM conversation_participants cp
            JOIN users u ON cp.user_id = u.id
            WHERE cp.conversation_id = c.id AND u.id != ?
            LIMIT 3
          ) as participants
        FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        WHERE cp.user_id = ?
        ORDER BY c.updated_at DESC
      `, [userId, userId, userId, userId]);
      
      return Array.isArray(result[0]) ? result[0] : [];
    } catch (error) {
      console.error('MessageModel.getConversationsByUserId() - Error:', error);
      return [];
    }
  }

  // Get messages from a conversation
  static async getMessagesByConversationId(conversationId, userId) {
    try {
      // First verify user is a participant
      const isParticipant = await execute(
        'SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?',
        [conversationId, userId]
      );
      
      if (isParticipant[0].length === 0) {
        throw new Error('User is not a participant in this conversation');
      }
      
      // Get messages
      const result = await execute(`
        SELECT 
          m.id,
          m.sender_id,
          u.name as sender_name,
          u.avatar as sender_avatar,
          m.content,
          m.attachment_url,
          m.is_system_message,
          m.sent_at,
          m.is_read
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.sent_at ASC
      `, [conversationId]);
      
      // Mark messages as read
      await execute(`
        UPDATE messages 
        SET is_read = 1 
        WHERE conversation_id = ? AND sender_id != ? AND is_read = 0
      `, [conversationId, userId]);
      
      return Array.isArray(result[0]) ? result[0] : [];
    } catch (error) {
      console.error('MessageModel.getMessagesByConversationId() - Error:', error);
      return [];
    }
  }

  // Get conversation details
  static async getConversationDetails(conversationId, userId) {
    try {
      // First verify user is a participant
      const isParticipant = await execute(
        'SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?',
        [conversationId, userId]
      );
      
      if (isParticipant[0].length === 0) {
        throw new Error('User is not a participant in this conversation');
      }
      
      // Get conversation details
      const convoResult = await execute(`
        SELECT 
          c.id,
          c.title,
          c.is_group,
          c.creator_id,
          c.created_at
        FROM conversations c
        WHERE c.id = ?
      `, [conversationId]);
      
      if (convoResult[0].length === 0) {
        throw new Error('Conversation not found');
      }
      
      // Get participants
      const participantsResult = await execute(`
        SELECT 
          u.id,
          u.name,
          u.avatar,
          cp.joined_at
        FROM conversation_participants cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = ?
      `, [conversationId]);
      
      return {
        ...convoResult[0][0],
        participants: Array.isArray(participantsResult[0]) ? participantsResult[0] : []
      };
    } catch (error) {
      console.error('MessageModel.getConversationDetails() - Error:', error);
      throw error;
    }
  }
  
  // Create a system message (e.g., for notifications about a job application)
  static async createSystemMessage(conversationId, content) {
    try {
      const result = await execute(
        'INSERT INTO messages (conversation_id, sender_id, content, is_system_message, sent_at, is_read) VALUES (?, NULL, ?, 1, NOW(), 0)',
        [conversationId, content]
      );
      
      await execute(
        'UPDATE conversations SET updated_at = NOW(), last_message = ? WHERE id = ?',
        [content, conversationId]
      );
      
      return { messageId: result[0].insertId };
    } catch (error) {
      console.error('MessageModel.createSystemMessage() - Error:', error);
      throw new Error('Failed to create system message');
    }
  }
  
  // Search conversations
  static async searchConversations(userId, searchTerm) {
    try {
      const result = await execute(`
        SELECT DISTINCT
          c.id, 
          c.title,
          c.is_group,
          c.last_message,
          c.updated_at
        FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        LEFT JOIN users u ON cp.user_id = u.id
        WHERE cp.user_id = ? AND (
          c.title LIKE ? OR 
          u.name LIKE ? OR
          c.last_message LIKE ?
        )
        ORDER BY c.updated_at DESC
      `, [userId, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
      
      return Array.isArray(result[0]) ? result[0] : [];
    } catch (error) {
      console.error('MessageModel.searchConversations() - Error:', error);
      return [];
    }
  }
}

export default MessageModel;
