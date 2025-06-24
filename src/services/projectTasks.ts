import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export interface ProjectTask {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'rejected';
  assigned_to?: number;
  created_by: number;
  due_date?: string;
  notes?: string;
  creator_name?: string;
  assignee_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTasksResponse {
  tasks: ProjectTask[];
  userRole: 'provider' | 'client';
  currentUserId: number;
}

export const getProjectTasks = async (projectId: number): Promise<ProjectTasksResponse> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`);
    
    console.log('Task API Response:', response.data);
    
    // Handle both old and new response formats for backward compatibility
    if (Array.isArray(response.data)) {
      // Old format - just return tasks array with default values
      return {
        tasks: response.data,
        userRole: 'client',
        currentUserId: 0
      };
    } else {
      // New format with user role information
      const result = {
        tasks: response.data.tasks || [],
        userRole: response.data.userRole || 'client',
        currentUserId: response.data.currentUserId || 0
      };
      console.log('Parsed task data:', result);
      return result;
    }
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }
};

export const createProjectTask = async (projectId: number, taskData: Partial<ProjectTask>): Promise<ProjectTask> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating project task:', error);
    throw error;
  }
};

export const updateProjectTask = async (taskId: number, taskData: Partial<ProjectTask>): Promise<ProjectTask> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.put(`${API_URL}/projects/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating project task:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId: number, status: string, notes?: string): Promise<ProjectTask> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.put(`${API_URL}/projects/tasks/${taskId}/status`, { status, notes });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

export const deleteProjectTask = async (taskId: number): Promise<void> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    await axios.delete(`${API_URL}/projects/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting project task:', error);
    throw error;
  }
};

export const assignTask = async (taskId: number, assignedTo: number): Promise<ProjectTask> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.put(`${API_URL}/projects/tasks/${taskId}/assign`, { assignedTo });
    return response.data;
  } catch (error) {
    console.error('Error assigning task:', error);
    throw error;
  }
};
