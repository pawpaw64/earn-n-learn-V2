
import axios from 'axios';
import { SkillType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Fetch all available skills
 */
export const fetchSkills = async (): Promise<SkillType[]> => {
  try {
    const response = await axios.get(`${API_URL}/skills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};

/**
 * Create a new skill offering
 */
export const createSkill = async (skillData: any): Promise<{ skillId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/skills`, skillData);
  return response.data;
};

/**
 * Update an existing skill
 */
export const updateSkill = async (id: number, skillData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/skills/${id}`, skillData);
  return response.data;
};

/**
 * Delete a skill offering
 */
export const deleteSkill = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/skills/${id}`);
  return response.data;
};

/**
 * Get detailed information for a specific skill
 */
export const getSkillDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/skills/${id}`);
  return response.data;
};
