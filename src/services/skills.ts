
// src/api/skills.ts
import axios from 'axios';
import { SkillType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const fetchSkills = async (excludeUserId?: number): Promise<SkillType[]> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const url = excludeUserId 
      ? `${API_URL}/skills?excludeUserId=${excludeUserId}`
      : `${API_URL}/skills`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};

export const createSkill = async (skillData: any): Promise<{ skillId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/skills`, skillData);
  return response.data;
};

export const updateSkill = async (id: number, skillData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/skills/${id}`, skillData);
  return response.data;
};

export const deleteSkill = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  
  // Check if skill can be deleted
  const checkResponse = await axios.get(`${API_URL}/skills/${id}/delete-permission`);
  if (!checkResponse.data.canDelete) {
    throw new Error(checkResponse.data.reason || 'Cannot delete this skill');
  }
  
  const response = await axios.delete(`${API_URL}/skills/${id}`);
  return response.data;
};

export const getSkillDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/skills/${id}`);
  return response.data;
};
