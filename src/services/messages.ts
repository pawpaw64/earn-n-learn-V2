
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api/messages';

// Get direct messages between current user and another user
export const getDirectMessages = async (contactId: number) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/direct/${contactId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    return [];
  }
};

// Get recent chats
export const getRecentChats = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/chats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent chats:', error);
    return [];
  }
};

// Send a message
export const sendMessage = async (receiverId: number, content: string, hasAttachment = false, attachmentUrl = null) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/send`, {
      receiverId,
      content,
      hasAttachment,
      attachmentUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Create a group
export const createGroup = async (name: string, description: string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/groups`, {
      name,
      description
    });
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// Get user groups
export const getUserGroups = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/groups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }
};

// Get group messages
export const getGroupMessages = async (groupId: number) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/groups/${groupId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching group messages:', error);
    return [];
  }
};

// Send group message
export const sendGroupMessage = async (groupId: number, content: string, hasAttachment = false, attachmentUrl = null) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/groups/message`, {
      groupId,
      content,
      hasAttachment,
      attachmentUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error sending group message:', error);
    throw error;
  }
};

// Add user to group
export const addToGroup = async (groupId: number, userId: number, isAdmin = false) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/groups/members`, {
      groupId,
      userId,
      isAdmin
    });
    return response.data;
  } catch (error) {
    console.error('Error adding user to group:', error);
    throw error;
  }
};

// Remove user from group
export const removeFromGroup = async (groupId: number, userId: number) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.delete(`${API_URL}/groups/${groupId}/members/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing user from group:', error);
    throw error;
  }
};

// Get group members
export const getGroupMembers = async (groupId: number) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/groups/${groupId}/members`);
    return response.data;
  } catch (error) {
    console.error('Error fetching group members:', error);
    return [];
  }
};

// Search for users
export const searchUsers = async (query: string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};
