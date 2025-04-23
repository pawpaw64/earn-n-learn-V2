
import { JobType } from '@/types/marketplace';

export const fetchJobs = async (): Promise<JobType[]> => {
  // TODO: Replace with actual API call when backend is implemented
  return [];
};

export const createJob = async (jobData: Omit<JobType, 'id'>): Promise<{ jobId: number }> => {
  // TODO: Replace with actual API call when backend is implemented
  return { jobId: Math.floor(Math.random() * 1000) };
};
