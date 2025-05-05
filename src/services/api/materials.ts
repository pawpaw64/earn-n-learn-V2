
import axios from 'axios';
import { MaterialType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Fetch all available materials
 */
export const fetchMaterials = async (excludeUserId?: number): Promise<MaterialType[]> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const url = excludeUserId 
      ? `${API_URL}/materials?excludeUserId=${excludeUserId}`
      : `${API_URL}/materials`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return [];
  }
};

/**
 * Create a new material listing
 */
export const createMaterial = async (materialData: any): Promise<{ materialId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/materials`, materialData);
  return response.data;
};

/**
 * Update an existing material
 */
export const updateMaterial = async (id: number, materialData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/materials/${id}`, materialData);
  return response.data;
};

/**
 * Delete a material listing
 */
export const deleteMaterial = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/materials/${id}`);
  return response.data;
};

/**
 * Get detailed information for a specific material
 */
export const getMaterialDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/materials/${id}`);
  return response.data;
};
