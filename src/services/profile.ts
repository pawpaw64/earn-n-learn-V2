
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

// Interface for the work history data structure
export interface WorkHistoryData {
  jobs: Array<{
    id: number;
    title: string;
    type: string;
    description: string;
    payment: string;
    status: string;
    application_count: number;
    created_at: string;
  }>;
  skills: Array<{
    id: number;
    skill_name: string;
    description: string;
    pricing: string;
    created_at: string;
  }>;
  materials: Array<{
    id: number;
    title: string;
    description: string;
    price: string;
    created_at: string;
  }>;
}

// Interface for the user details data structure
export interface UserDetailsData {
  user: {
    id: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    university?: string;
    program?: string;
  };
  ratings: {
    average: string;
    count: number;
    detail: Array<{
      id: number;
      rating: number;
      comment: string;
      rater_name: string;
      rater_avatar?: string;
      created_at: string;
    }>;
  };
  completedJobs: Array<{
    id: number;
    job_title: string;
    job_description: string;
    job_type: string;
    job_payment: string;
    completed_date: string;
    client_name: string;
    client_avatar?: string;
  }>;
  verifications: Array<{
    id: number;
    type: string;
    verified_at: string;
    status: string;
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

export const fetchUserWorkHistory = async (userId: string): Promise<WorkHistoryData | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/user/${userId}/work-history`);
    console.log(`Work history for user ${userId} fetched:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId} work history:`, error);
    return null;
  }
};

export const fetchUserDetails = async (userId: string): Promise<UserDetailsData | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/user/${userId}/details`);
    console.log(`User details for ${userId} fetched:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId} details:`, error);
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
