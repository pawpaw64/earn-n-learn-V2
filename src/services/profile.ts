// src/api/profile.ts
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const fetchUserProfile = async (userId?: string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (profileData: any) => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/users/profile`, profileData);
  return response.data;
};

export const uploadProfileImage = async (userId: string, imageFile: File) => {
  setAuthToken(localStorage.getItem('token'));
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axios.post(`${API_URL}/users/upload-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.imageUrl;
};