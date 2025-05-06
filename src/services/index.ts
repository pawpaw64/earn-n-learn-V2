// src/api/index.ts
export * from './auth.ts';
export * from './jobs.ts';
export * from './skills.ts';
export * from './materials.ts';
export * from './applications.ts';
export * from './contacts.ts';
export * from './works.ts';
export * from './notifications.ts';
export * from './invoices.ts';
export * from './profile.ts';
import axios from 'axios';
import { getUserIdFromToken } from './auth.ts';

const API_URL = 'http://localhost:8080/api'; 
// Helper function
function emptyPosts() {
  return { jobs: [], skills: [], materials: [] };
}

export const fetchMyPosts = async (): Promise<{
  jobs: any[];
  skills: any[];
  materials: any[];
}> => {
  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken(token);
  if (!userId) return emptyPosts();

  try {
    const [jobs, skills, materials] = await Promise.all([
      axios.get(`${API_URL}/jobs/user/${userId}`),
      axios.get(`${API_URL}/skills/user/${userId}`),
      axios.get(`${API_URL}/materials/user/${userId}`)
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
    return emptyPosts();
  }
};