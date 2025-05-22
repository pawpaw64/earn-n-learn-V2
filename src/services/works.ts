
import axios from 'axios';
import { setAuthToken } from './auth';

// Define types
export interface WorkType {
  id: number;
  title?: string;
  skill_name?: string;
  description?: string;
  type?: string;
  payment?: string;
  pricing?: string;
  price?: string;
  status?: string;
  created_at: string;
  end_date?: string;
  client_name?: string;
  client_avatar?: string;
  provider_name?: string;
  provider_avatar?: string;
  [key: string]: any;
}

const API_URL = 'http://localhost:8080/api';

// Fetch works where current user is the provider
export const fetchProviderWorks = async (): Promise<WorkType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/works/provider`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provider works:', error);
    return [];
  }
};

// Fetch works where current user is the client
export const fetchMyWorks = async (): Promise<any[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/works/client`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client works:', error);
    return [];
  }
};

// Get work details by ID
export const getWorkDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/works/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching work details:', error);
    throw error;
  }
};

// Update work status
export const updateWorkStatus = async (id: number, status: string): Promise<boolean> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.put(`${API_URL}/works/${id}/status`, { status });
    return response.data.success;
  } catch (error) {
    console.error('Error updating work status:', error);
    return false;
  }
};

// Create work from job application
export const createWorkFromApplication = async (applicationId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/works/from-application`, { 
      application_id: applicationId 
    });
    return response.data;
  } catch (error) {
    console.error('Error creating work from application:', error);
    throw error;
  }
};

// Create work from contact request
export const createWorkFromContact = async (contactId: number, contactType: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/works/from-contact`, { 
      contact_id: contactId,
      contact_type: contactType
    });
    return response.data;
  } catch (error) {
    console.error('Error creating work from contact:', error);
    throw error;
  }
};
