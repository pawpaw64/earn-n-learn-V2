
import axios from 'axios';
import { WorkType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Create work assignment from a job application
 */
export const createWorkFromApplication = async (applicationId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/works/from-application`, { application_id: applicationId });
  return response.data;
};

/**
 * Create work assignment from a skill contact
 */
export const createWorkFromSkillContact = async (contactId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/works/from-skill-contact`, { contact_id: contactId });
  return response.data;
};

/**
 * Create work assignment from a material contact
 */
export const createWorkFromMaterialContact = async (contactId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/works/from-material-contact`, { contact_id: contactId });
  return response.data;
};

/**
 * Update status of a work assignment
 */
export const updateWorkStatus = async (id: number, status: string, notes?: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/works/${id}/status`, { status, notes });
  return response.data;
};

/**
 * Fetch work assignments where user is the provider
 */
export const fetchProviderWorks = async (): Promise<WorkType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/works/as-provider`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provider works:", error);
    return [];
  }
};

/**
 * Fetch work assignments where user is the client
 */
export const fetchClientWorks = async (): Promise<WorkType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/works/as-client`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client works:", error);
    return [];
  }
};

/**
 * Get detailed information for a specific work assignment
 */
export const getWorkDetails = async (id: number): Promise<WorkType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/works/${id}`);
  return response.data;
};

/**
 * Fetch all work assignments for current user (both as provider and client)
 */
export const fetchMyWorks = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    // Fetch works where user is either provider or client
    const [asProvider, asClient] = await Promise.all([
      axios.get(`${API_URL}/works/as-provider`),
      axios.get(`${API_URL}/works/as-client`)
    ]);
    
    // Combine and format results
    const works = [...asProvider.data, ...asClient.data].map(work => ({
      id: work.id,
      title: work.job_title || work.skill_name || work.material_title || 'Untitled Work',
      company: work.provider_id === parseInt(localStorage.getItem('userId') || '0') 
        ? work.client_name : work.provider_name,
      type: work.job_type || (work.skill_id ? 'Skill' : 'Material'),
      status: work.status,
      description: work.job_description || work.skill_description || work.material_description || '',
      startDate: new Date(work.start_date).toLocaleDateString(),
      endDate: work.end_date ? new Date(work.end_date).toLocaleDateString() : null,
      payment: work.job_payment || work.skill_pricing || work.material_price
    }));
    
    return works;
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
};
