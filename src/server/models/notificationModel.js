
import { execute } from '../config/db.js';

class NotificationModel {
  // Create new notification
  static async create(notificationData) {
    const { user_id, title, message, type, reference_id, reference_type } = notificationData;
    
    const result = await execute(
      'INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, title, message, type, reference_id, reference_type]
    );
    
    
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];
  }

  // Get user notifications
  static async getByUserId(userId) {
    const result = await execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
   const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];;
  }

  // Mark notification as read
  static async markAsRead(id) {
    const result = await execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [id]
    );
    const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];
  }

  // Mark all user notifications as read
  static async markAllAsRead(userId) {
    const result = await execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [userId]
    );
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];
  }

  // Get unread count for user
  static async getUnreadCount(userId) {
    const result= await execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];0;
  }

  // Delete notification
  static async delete(id) {
    const result = await execute(
      'DELETE FROM notifications WHERE id = ?',
      [id]
    );
    
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];
  }
}

export default NotificationModel;
