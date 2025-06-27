
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export interface ProjectResource {
  id: number;
  project_id: number;
  name: string;
  type: string;
  url: string;
  description?: string;
  category: string;
  size: number;
  uploaded_by: number;
  uploaded_by_name: string;
  created_at: string;
}

export const getProjectResources = async (projectId: number): Promise<ProjectResource[]> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(`${API_URL}/projects/${projectId}/resources`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching project resources:', error);
    throw error;
  }
};

export const uploadProjectResource = async (projectId: number, resourceData: {
  name: string;
  type: string;
  url: string;
  description?: string;
  category: string;
  size?: number;
}): Promise<ProjectResource> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/projects/${projectId}/resources`, resourceData);
    return response.data;
  } catch (error) {
    console.error('Error uploading project resource:', error);
    throw error;
  }
};

export const uploadProjectFile = async (projectId: number, formData: FormData): Promise<ProjectResource> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`${API_URL}/projects/${projectId}/resources/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading project file:', error);
    throw error;
  }
};

export const deleteProjectResource = async (resourceId: number): Promise<void> => {
  try {
    setAuthToken(localStorage.getItem('token'));
    await axios.delete(`${API_URL}/projects/resources/${resourceId}`);
  } catch (error) {
    console.error('Error deleting project resource:', error);
    throw error;
  }
};

export const downloadProjectResource = async (resourceId: number) => {
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(`${API_URL}/projects/resources/${resourceId}/download`);
    return response.data;
  } catch (error) {
    console.error('Error downloading project resource:', error);
    throw error;
  }
};
