// src/services/index.ts
export * from './auth';
export * from './jobs';
export * from './skills';
export * from './materials';
export * from './applications';
export * from './contacts';
export * from './works';
export * from './notifications';
export * from './invoices';
export * from './profile';
import axios from 'axios';
import { getUserIdFromToken, setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api'; 

/**
 * Fetch all posts (jobs, skills, materials) created by the current user
 * @returns Object containing arrays of user's jobs, skills, and materials
 */
export const fetchMyPosts = async (): Promise<{
  jobs: any[];
  skills: any[];
  materials: any[];
}> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  const userId = getUserIdFromToken(token);
  if (!userId) return { jobs: [], skills: [], materials: [] };

  try {
    const [jobs, skills, materials] = await Promise.all([
      axios.get(`${API_URL}/jobs/user/${userId}`),
      axios.get(`${API_URL}/skills/user/skills`),
      axios.get(`${API_URL}/materials/user/materials`)
    ]);
    
    const applications = await axios.get(`${API_URL}/applications/user/received`);
    
    const jobsWithAppCounts = jobs.data.map((job: any) => {
      const jobApps = applications.data.filter((app: any) => app.job_id === job.id);
      return {
        ...job,
        applicationsCount: jobApps.length
      };
    });

    return {
      jobs: jobsWithAppCounts || [],
      skills: skills.data || [],
      materials: materials.data || []
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { jobs: [], skills: [], materials: [] };
  }
};
