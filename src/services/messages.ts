
import axios from 'axios';
import { setAuthToken } from './auth';
import { MessageType, ChatType, GroupType, GroupMemberType } from '@/types/messages';

const API_URL = 'http://localhost:8080/api';

// Get direct messages with a specific contact
export const getDirectMessages = async (contactId: number): Promise<MessageType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/direct/${contactId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching direct messages:", error);
    return [];
  }
};

// Get recent chats
export const getRecentChats = async (): Promise<ChatType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/chats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    return [];
  }
};

// Send a direct message
export const sendMessage = async (receiverId: number, content: string, attachment?: File): Promise<MessageType | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    let attachmentUrl = undefined;
    let hasAttachment = false;
    
    if (attachment) {
      const formData = new FormData();
      formData.append('attachment', attachment);
      const uploadResponse = await axios.post(`${API_URL}/uploads/message-attachment`, formData);
      attachmentUrl = uploadResponse.data.url;
      hasAttachment = true;
    }
    
    const response = await axios.post(`${API_URL}/messages/send`, {
      receiver_id: receiverId,
      content,
      has_attachment: hasAttachment,
      attachment_url: attachmentUrl
    });
    
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

// Initiate a conversation from a job/skill/material contact
export const initiateDirectMessage = async (
  recipientId: number, 
  initialMessage?: string
): Promise<{ success: boolean; recipient: any; message: string } | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/messages/initiate`, {
      recipient_id: recipientId,
      initial_message: initialMessage
    });
    
    return response.data;
  } catch (error) {
    console.error("Error initiating conversation:", error);
    return null;
  }
};

// Get user groups
export const getUserGroups = async (): Promise<GroupType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/groups`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
};

// Get group messages
export const getGroupMessages = async (groupId: number): Promise<MessageType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/groups/${groupId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return [];
  }
};

// Create a new group
export const createGroup = async (
  name: string, 
  description: string, 
  members: number[]
): Promise<GroupType | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/messages/groups`, {
      name,
      description,
      members
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

// Send a group message
export const sendGroupMessage = async (
  groupId: number, 
  content: string, 
  attachment?: File
): Promise<MessageType | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    let attachmentUrl = undefined;
    let hasAttachment = false;
    
    if (attachment) {
      const formData = new FormData();
      formData.append('attachment', attachment);
      const uploadResponse = await axios.post(`${API_URL}/uploads/message-attachment`, formData);
      attachmentUrl = uploadResponse.data.url;
      hasAttachment = true;
    }
    
    const response = await axios.post(`${API_URL}/messages/groups/message`, {
      group_id: groupId,
      content,
      has_attachment: hasAttachment,
      attachment_url: attachmentUrl
    });
    
    return response.data;
  } catch (error) {
    console.error("Error sending group message:", error);
    return null;
  }
};

// Get group members
export const getGroupMembers = async (groupId: number): Promise<GroupMemberType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/groups/${groupId}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching group members:", error);
    return [];
  }
};

// Add user to group
export const addUserToGroup = async (
  groupId: number, 
  userId: number, 
  isAdmin: boolean = false
): Promise<boolean> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    await axios.post(`${API_URL}/messages/groups/members`, {
      group_id: groupId,
      user_id: userId,
      is_admin: isAdmin
    });
    
    return true;
  } catch (error) {
    console.error("Error adding user to group:", error);
    return false;
  }
};

// Remove user from group
export const removeUserFromGroup = async (groupId: number, userId: number): Promise<boolean> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    await axios.delete(`${API_URL}/messages/groups/${groupId}/members/${userId}`);
    return true;
  } catch (error) {
    console.error("Error removing user from group:", error);
    return false;
  }
};

// Search for users
export const searchUsers = async (query: string): Promise<any[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/messages/users/search/${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
