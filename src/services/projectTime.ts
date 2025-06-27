
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export interface ProjectTimeEntry {
  id: number;
  project_id: number;
  task_id?: number;
  user_id: number;
  description: string;
  hours: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  user_name: string;
  task_title?: string;
  created_at: string;
  updated_at: string;
}

export const getProjectTimeEntries = async (projectId: number): Promise<ProjectTimeEntry[]> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(`${API_URL}/projects/${projectId}/time-entries`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching project time entries:', error);
    throw error;
  }
};

export const createTimeEntry = async (projectId: number, entryData: {
  task_id?: string;
  description: string;
  hours: number;
  date: string;
}): Promise<ProjectTimeEntry> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/projects/${projectId}/time-entries`, entryData);
    return response.data;
  } catch (error) {
    console.error('Error creating time entry:', error);
    throw error;
  }
};

export const updateTimeEntry = async (entryId: number, entryData: {
  description?: string;
  hours?: number;
  date?: string;
  status?: string;
}): Promise<ProjectTimeEntry> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.put(`${API_URL}/projects/time-entries/${entryId}`, entryData);
    return response.data;
  } catch (error) {
    console.error('Error updating time entry:', error);
    throw error;
  }
};

export const deleteTimeEntry = async (entryId: number): Promise<void> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    await axios.delete(`${API_URL}/projects/time-entries/${entryId}`);
  } catch (error) {
    console.error('Error deleting time entry:', error);
    throw error;
  }
};
