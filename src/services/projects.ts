
import axios from 'axios';
import { setAuthToken } from './auth';
import { Project, ProjectUpdate } from '@/types/marketplace';


const API_URL = 'http://localhost:8080/api';

export const createProjectFromApplication = async (applicationId: number): Promise<Project> => {
  try {
    console.log('[project.ts] application with ID:', applicationId); 
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/projects/${applicationId}/from-application`);
    return response.data;
  } catch (error) {
    console.error('Error creating project from application:', error);
    throw error;
  }2
};

export const createProjectFromContact = async (contactId: number, contactType: string, projectData: any): Promise<Project> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/projects/from-contact`, {
      contactId,
      contactType,
      ...projectData
    });
    console.log('Created project from contact:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating project from contact:', error);
    throw error;
  }
};

export const getUserProjects = async (): Promise<Project[]> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    console.log('Fetching user projects...');
    const response = await axios.get(`${API_URL}/projects/my-projects`);
    console.log('User projects response:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user projects:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    throw error;
  }
};

export const getProjectById = async (id: number): Promise<Project> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(`${API_URL}/projects/${id}`);
    console.log('Project details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

export const updateProjectStatus = async (id: number, status: string): Promise<Project> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.put(`${API_URL}/projects/${id}/status`, { status });
    console.log('Updated project status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
};

export const updateMilestone = async (milestoneId: number, status: string, notes?: string): Promise<Project> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.put(`${API_URL}/projects/milestone/${milestoneId}`, { 
      status, 
      notes 
    });
    console.log('Updated milestone:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

export const getProjectActivity = async (projectId: number): Promise<ProjectUpdate[]> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(`${API_URL}/projects/${projectId}/activity`);
    console.log('Project activity:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching project activity:', error);
    throw error;
  }
};
