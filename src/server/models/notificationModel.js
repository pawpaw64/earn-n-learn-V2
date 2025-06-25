import { execute } from '../config/db.js';

class NotificationModel {
  // Create new notification
  static async create(notificationData) {
    const { user_id, title, message, type, reference_id, reference_type } = notificationData;
    
    try {
      const result = await execute(
        'INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, message, type, reference_id, reference_type]
      );
      
      // Handle different result formats
      const insertId = Array.isArray(result) 
        ? result[0]?.insertId || result.insertId 
        : result.insertId;
      
      return insertId;
    } catch (error) {
      console.error('NotificationModel.create() - Error:', error);
      throw error;
    }
  }

  // Get user notifications
  static async getByUserId(userId) {
    try {
      const result = await execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      
      // Handle different result formats
      const rows = Array.isArray(result) 
        ? result[0] && Array.isArray(result[0]) 
          ? result[0] 
          : result 
        : [];
      
      return rows;
    } catch (error) {
      console.error('NotificationModel.getByUserId() - Error:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(id) {
    try {
      const result = await execute(
        'UPDATE notifications SET is_read = TRUE WHERE id = ?',
        [id]
      );
      
      const affectedRows = Array.isArray(result) 
        ? result[0]?.affectedRows || result.affectedRows 
        : result.affectedRows;
      
      return affectedRows > 0;
    } catch (error) {
      console.error('NotificationModel.markAsRead() - Error:', error);
      throw error;
    }
  }

  // Mark all user notifications as read
  static async markAllAsRead(userId) {
    try {
      const result = await execute(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
        [userId]
      );
      
      const affectedRows = Array.isArray(result) 
        ? result[0]?.affectedRows || result.affectedRows 
        : result.affectedRows;
      
      return affectedRows > 0;
    } catch (error) {
      console.error('NotificationModel.markAllAsRead() - Error:', error);
      throw error;
    }
  }

  // Get unread count for user
  static async getUnreadCount(userId) {
    try {
      const result = await execute(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
        [userId]
      );
      
      const rows = Array.isArray(result) 
        ? result[0] && Array.isArray(result[0]) 
          ? result[0] 
          : result 
        : [];
      
      return rows[0]?.count || 0;
    } catch (error) {
      console.error('NotificationModel.getUnreadCount() - Error:', error);
      throw error;
    }
  }

  // Delete notification
  static async delete(id) {
    try {
      const result = await execute(
        'DELETE FROM notifications WHERE id = ?',
        [id]
      );
      
      const affectedRows = Array.isArray(result) 
        ? result[0]?.affectedRows || result.affectedRows 
        : result.affectedRows;
      
      return affectedRows > 0;
    } catch (error) {
      console.error('NotificationModel.delete() - Error:', error);
      throw error;
    }
  }
}

export default NotificationModel;