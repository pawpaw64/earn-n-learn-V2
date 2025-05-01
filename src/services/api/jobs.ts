
import axios from 'axios';
import { JobType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Fetch all available jobs
 */
export const fetchJobs = async (): Promise<JobType[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found');
    return [];
  }
  
  setAuthToken(token);
  try {
    const response = await axios.get(`${API_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

/**
 * Create a new job listing
 */
export const createJob = async (jobData: Omit<JobType, 'id'>): Promise<{ jobId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

/**
 * Update an existing job
 */
export const updateJob = async (id: number, jobData: Partial<JobType>): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
  return response.data;
};

/**
 * Delete a job listing
 */
export const deleteJob = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/jobs/${id}`);
  return response.data;
};

/**
 * Get detailed information for a specific job
 */
export const getJobDetails = async (id: number): Promise<JobType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};
