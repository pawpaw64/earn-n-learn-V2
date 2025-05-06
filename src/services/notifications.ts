// src/api/notifications.ts
import axios from 'axios';
import { NotificationType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const fetchNotifications = async (): Promise<NotificationType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const fetchUnreadNotificationCount = async (): Promise<number> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/notifications/unread-count`);
    return response.data.count;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return 0;
  }
};

export const markNotificationAsRead = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/notifications/read-all`);
  return response.data;
};

export const deleteNotification = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/notifications/${id}`);
  return response.data;
};