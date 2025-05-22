
import axios from 'axios';
import { setAuthToken } from './auth';
import { toast } from 'sonner';

const API_URL = 'http://localhost:8080/api';

/**
 * Get all conversations for the current user
 */
export const getConversations = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/conversations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    toast.error('Failed to load conversations');
    return [];
  }
};

/**
 * Get messages for a specific conversation
 */
export const getMessages = async (conversationId: number | string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to load messages');
    return [];
  }
};

/**
 * Send a message in a conversation
 */
export const sendMessage = async (conversationId: number | string, content: string, attachmentUrl?: string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/messages`, {
      conversation_id: conversationId,
      content,
      attachment_url: attachmentUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    throw error;
  }
};

/**
 * Create or get a direct conversation with another user
 */
export const createDirectConversation = async (recipientId: number | string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/messages/direct`, {
      recipient_id: recipientId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    toast.error('Failed to start conversation');
    throw error;
  }
};

/**
 * Search conversations
 */
export const searchConversations = async (term: string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/search?term=${encodeURIComponent(term)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching conversations:', error);
    return [];
  }
};
