
import axios from 'axios';
import { JobType, SkillType, MaterialType } from '@/types/marketplace';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Jobs API
export const fetchJobs = async (): Promise<JobType[]> => {
  const response = await api.get('/jobs');
  return response.data;
};

export const createJob = async (jobData: Omit<JobType, 'id'>): Promise<{ jobId: number }> => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// Example function to update useBrowseData hook to fetch from API
export const updateBrowseDataWithApi = async () => {
  try {
    const jobs = await fetchJobs();
    return { jobs };
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return { error };
  }
};

// Test database connection
export const testDatabaseConnection = async (): Promise<{ message: string }> => {
  const response = await api.get('/test-connection');
  return response.data;
};
