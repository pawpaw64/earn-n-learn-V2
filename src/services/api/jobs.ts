
import axios from 'axios';
import { JobType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Fetch all available jobs
 * @param excludeUserId - The user ID whose jobs should be excluded from the results
 * @returns A promise resolving to an array of jobs
 */
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

/**
 * Create a new job listing
 * @param jobData - The job data to create
 * @returns A promise resolving to the created job ID
 */
export const createJob = async (jobData: Omit<JobType, 'id'>): Promise<{ jobId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

/**
 * Update an existing job
 * @param id - The ID of the job to update
 * @param jobData - The new job data
 * @returns A promise resolving to the updated job data
 */
export const updateJob = async (id: number, jobData: Partial<JobType>): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
  return response.data;
};

/**
 * Delete a job listing
 * @param id - The ID of the job to delete
 * @returns A promise resolving to the deleted job data
 */
export const deleteJob = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/jobs/${id}`);
  return response.data;
};

/**
 * Get detailed information for a specific job
 * @param id - The ID of the job to get details for
 * @returns A promise resolving to the job details
 */
export const getJobDetails = async (id: number): Promise<JobType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};
