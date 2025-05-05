
import axios from 'axios';
import { MaterialType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Fetch all available materials
 * @param excludeUserId - The user ID whose materials should be excluded from the results
 * @returns A promise resolving to an array of materials
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
 * @param materialData - The material data to create
 * @returns A promise resolving to the created material ID
 */
export const createMaterial = async (materialData: Partial<MaterialType>): Promise<{ materialId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/materials`, materialData);
  return response.data;
};

/**
 * Update an existing material
 * @param id - The ID of the material to update
 * @param materialData - The new material data
 * @returns A promise resolving to the updated material data
 */
export const updateMaterial = async (id: number, materialData: Partial<MaterialType>): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/materials/${id}`, materialData);
  return response.data;
};

/**
 * Delete a material listing
 * @param id - The ID of the material to delete
 * @returns A promise resolving to the deleted material data
 */
export const deleteMaterial = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/materials/${id}`);
  return response.data;
};

/**
 * Get detailed information for a specific material
 * @param id - The ID of the material to get details for
 * @returns A promise resolving to the material details
 */
export const getMaterialDetails = async (id: number): Promise<MaterialType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/materials/${id}`);
  return response.data;
};
