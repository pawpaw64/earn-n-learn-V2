
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export interface Project {
  id: number;
  title: string;
  description?: string;
  provider_id: number;
  client_id: number;
  source_type: 'job' | 'skill' | 'material';
  source_id: number;
  project_type: 'fixed' | 'hourly';
  total_amount?: number;
  hourly_rate?: number;
  current_phase: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string;
  expected_end_date?: string;
  actual_end_date?: string;
  created_at: string;
  updated_at: string;
  provider_name?: string;
  client_name?: string;
  milestones?: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: number;
  project_id: number;
  phase_number: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  due_date?: string;
  completion_date?: string;
  notes?: string;
}

export interface ProjectUpdate {
  id: number;
  project_id: number;
  milestone_id?: number;
  user_id: number;
  update_type: 'status_change' | 'progress_update' | 'milestone_complete' | 'note';
  message?: string;
  old_status?: string;
  new_status?: string;
  created_at: string;
  user_name?: string;
}

export const createProjectFromApplication = async (applicationId: number, projectData: any): Promise<Project> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/projects/from-application`, {
      applicationId,
      ...projectData
    });
    console.log('Created project from application:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating project from application:', error);
    throw error;
  }
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
