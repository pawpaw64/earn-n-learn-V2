
import axios from 'axios';
import { SkillType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Fetch all available skills
 * @param excludeUserId - The user ID whose skills should be excluded from the results
 * @returns A promise resolving to an array of skills
 */
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

/**
 * Create a new skill offering
 * @param skillData - The skill data to create
 * @returns A promise resolving to the created skill ID
 */
export const createSkill = async (skillData: Partial<SkillType>): Promise<{ skillId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/skills`, skillData);
  return response.data;
};

/**
 * Update an existing skill
 * @param id - The ID of the skill to update
 * @param skillData - The new skill data
 * @returns A promise resolving to the updated skill data
 */
export const updateSkill = async (id: number, skillData: Partial<SkillType>): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/skills/${id}`, skillData);
  return response.data;
};

/**
 * Delete a skill offering
 * @param id - The ID of the skill to delete
 * @returns A promise resolving to the deleted skill data
 */
export const deleteSkill = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/skills/${id}`);
  return response.data;
};

/**
 * Get detailed information for a specific skill
 * @param id - The ID of the skill to get details for
 * @returns A promise resolving to the skill details
 */
export const getSkillDetails = async (id: number): Promise<SkillType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/skills/${id}`);
  return response.data;
};
