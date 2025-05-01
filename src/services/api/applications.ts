
import axios from 'axios';
import { ApplicationType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Submit a new job application
 */
export const submitJobApplication = async (applicationData: { job_id: number, cover_letter: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/applications`, applicationData);
  return response.data;
};

/**
 * Update status of an application
 */
export const updateApplicationStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/applications/${id}/status`, { status });
  return response.data;
};

/**
 * Get detailed information for a specific application
 */
export const getApplicationDetails = async (id: number): Promise<ApplicationType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/applications/${id}`);
  return response.data;
};

/**
 * Fetch applications submitted by current user
 */
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

/**
 * Fetch applications received for user's job postings
 */
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

/**
 * Alias for fetchUserApplications
 */
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
