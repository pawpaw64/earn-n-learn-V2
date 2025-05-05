
import axios from 'axios';
import { setAuthToken } from './auth';
import { getUserIdFromToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Return empty posts data structure
 */
function emptyPosts() {
  return { jobs: [], skills: [], materials: [] };
}

/**
 * Fetch all postings made by the current user
 * @returns Promise with user posts including jobs, skills, and materials
 */
export const fetchMyPosts = async (): Promise<{
  jobs: any[];
  skills: any[];
  materials: any[];
}> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const userId = getUserIdFromToken(localStorage.getItem('token'));
    if (!userId) return emptyPosts();

    // Fetch all user posts in parallel
    const [jobs, skills, materials] = await Promise.all([
      axios.get(`${API_URL}/jobs/user/${userId}`),
      axios.get(`${API_URL}/skills/user/${userId}`),
      axios.get(`${API_URL}/materials/user/${userId}`)
    ]);
    
    // Also fetch applications for jobs
    const applications = await axios.get(`${API_URL}/applications/user/received`);
    
    // Add application counts to jobs
    const jobsWithAppCounts = jobs.data.map(job => {
      const jobApps = applications.data.filter(app => app.job_id === job.id);
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
