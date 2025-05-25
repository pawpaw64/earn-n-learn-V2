// src/api/materials.ts
import axios from 'axios';
import { MaterialType } from '@/types/marketplace';
import { setAuthToken } from './auth';
import { uploadImage } from './imageUpload';

const API_URL = 'http://localhost:8080/api';

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

export const createMaterial = async (materialData: any): Promise<{ materialId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  
  let imageUrl = '';
  if (materialData.image && materialData.image instanceof File) {
    try {
      imageUrl = await uploadImage(materialData.image, 'material');
    } catch (error) {
      console.error('Error uploading material image:', error);
      // Continue without image if upload fails
    }
  }
  
  const dataToSend = {
    ...materialData,
    image_url: imageUrl,
    image: undefined // Remove the file object
  };
  
  const response = await axios.post(`${API_URL}/materials`, dataToSend);
  return response.data;
};

export const updateMaterial = async (id: number, materialData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  
  let imageUrl = materialData.image_url || '';
  if (materialData.image && materialData.image instanceof File) {
    try {
      imageUrl = await uploadImage(materialData.image, 'material');
    } catch (error) {
      console.error('Error uploading material image:', error);
      // Keep existing image if upload fails
    }
  }
  
  const dataToSend = {
    ...materialData,
    image_url: imageUrl,
    image: undefined // Remove the file object
  };
  
  const response = await axios.put(`${API_URL}/materials/${id}`, dataToSend);
  return response.data;
};

export const deleteMaterial = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/materials/${id}`);
  return response.data;
};

export const getMaterialDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/materials/${id}`);
  return response.data;
};
