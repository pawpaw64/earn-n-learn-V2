
// src/api/jobs.ts
import axios from 'axios';
import { JobType } from '@/types/marketplace';
import { setAuthToken, getUserIdFromToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const fetchJobs = async (excludeUserId?: number): Promise<JobType[]> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const url = excludeUserId 
      ? `${API_URL}/jobs?excludeUserId=${excludeUserId}`
      : `${API_URL}/jobs`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const createJob = async (jobData: Omit<JobType, 'id'>): Promise<{ jobId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

export const updateJob = async (id: number, jobData: Partial<JobType>): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  
  // Check if job can be deleted
  const checkResponse = await axios.get(`${API_URL}/jobs/${id}/delete-permission`);
  if (!checkResponse.data.canDelete) {
    throw new Error(checkResponse.data.reason || 'Cannot delete this job');
  }
  
  const response = await axios.delete(`${API_URL}/jobs/${id}`);
  return response.data;
};

export const getJobDetails = async (id: number): Promise<JobType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};

export const fetchJobsByUser = async (): Promise<JobType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/jobs/user/posted`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    return [];
  }
};
