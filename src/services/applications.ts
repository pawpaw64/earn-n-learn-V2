// src/api/applications.ts
import axios from 'axios';
import { ApplicationType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const submitJobApplication = async (applicationData: { job_id: number, cover_letter: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/applications`, applicationData);
  return response.data;
};

export const updateApplicationStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/applications/${id}/status`, { status });
  return response.data;
};

export const getApplicationDetails = async (id: number): Promise<ApplicationType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/applications/${id}`);
  return response.data;
};

export const fetchUserApplications = async (): Promise<ApplicationType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/submitted`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return [];
  }
};

export const fetchJobApplications = async (): Promise<ApplicationType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/received`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return [];
  }
};

export const fetchMyApplications = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/submitted`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};