
// src/api/materials.ts
import axios from 'axios';
import { MaterialType } from '@/types/marketplace';
import { setAuthToken } from './auth';

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

export const createMaterial = async (materialData: any, imageFile?: File): Promise<{ materialId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  
  const formData = new FormData();
  formData.append('title', materialData.title);
  formData.append('description', materialData.description);
  formData.append('conditions', materialData.condition || '');
  formData.append('price', materialData.price || '');
  formData.append('availability', materialData.availability || '');
  
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  const response = await axios.post(`${API_URL}/materials`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateMaterial = async (id: number, materialData: any, imageFile?: File): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  
  const formData = new FormData();
  formData.append('title', materialData.title);
  formData.append('description', materialData.description);
  formData.append('conditions', materialData.condition || '');
  formData.append('price', materialData.price || '');
  formData.append('availability', materialData.availability || '');
  
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  const response = await axios.put(`${API_URL}/materials/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
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

export const uploadMaterialImage = async (imageFile: File): Promise<{ imageUrl: string }> => {
  setAuthToken(localStorage.getItem('token'));
  
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axios.post(`${API_URL}/materials/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
