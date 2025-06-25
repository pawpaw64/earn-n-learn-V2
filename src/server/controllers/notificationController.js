
import NotificationModel from '../models/notificationModel.js';

// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.getByUserId(req.user.id);
    res.json(notifications);
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await NotificationModel.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const updated = await NotificationModel.markAsRead(req.params.id);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to mark notification as read' });
    }
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const updated = await NotificationModel.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await NotificationModel.delete(req.params.id);
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete notification' });
    }
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
