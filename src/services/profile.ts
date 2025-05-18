
// src/services/profile.ts
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

// Interface for the profile data structure
export interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    student_id?: string;
    university?: string;
    course?: string;
    program?: string;
    graduation_year?: string;
    mobile?: string;
    created_at?: string;
  };
  skills: Array<{
    id: string;
    name: string;
    description?: string;
    acquiredFrom?: string;
    user_id: string;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    description?: string;
    url: string;
    type?: string;
    user_id: string;
  }>;
  websites: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string;
    user_id: string;
  }>;
}

export const fetchUserProfile = async (): Promise<ProfileData | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    console.log('Profile data fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const fetchUserById = async (userId: string): Promise<ProfileData | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/user/${userId}`);
    console.log('User profile fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId} profile:`, error);
    return null;
  }
};

export const updateUserProfile = async (profileData: any) => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/users/profile`, profileData);
  return response.data;
};

export const uploadProfileImage = async (imageFile: File) => {
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
