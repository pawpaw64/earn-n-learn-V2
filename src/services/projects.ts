
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

export const createProjectFromWork = async (workId: number, projectData: any): Promise<Project> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/projects/from-work`, {
    workId,
    ...projectData
  });
  return response.data;
};

export const getUserProjects = async (): Promise<Project[]> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/projects/my-projects`);
  return response.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

export const updateProjectStatus = async (id: number, status: string): Promise<Project> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/projects/${id}/status`, { status });
  return response.data;
};

export const updateMilestone = async (milestoneId: number, status: string, notes?: string): Promise<Project> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/projects/milestone/${milestoneId}`, { 
    status, 
    notes 
  });
  return response.data;
};

export const getProjectActivity = async (projectId: number): Promise<ProjectUpdate[]> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/projects/${projectId}/activity`);
  return response.data;
};
