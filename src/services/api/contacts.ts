
import axios from 'axios';
import { ContactType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

/**
 * Submit a contact request for a skill
 */
export const submitSkillContact = async (contactData: { skill_id: number, message: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/contacts/skill`, contactData);
  return response.data;
};

/**
 * Submit a contact request for a material
 */
export const submitMaterialContact = async (contactData: { material_id: number, message: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/contacts/material`, contactData);
  return response.data;
};

/**
 * Update status of a skill contact
 */
export const updateSkillContactStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/contacts/skill/${id}/status`, { status });
  return response.data;
};

/**
 * Update status of a material contact
 */
export const updateMaterialContactStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/contacts/material/${id}/status`, { status });
  return response.data;
};

/**
 * Fetch skill contacts sent by current user
 */
export const fetchUserSkillContacts = async (): Promise<ContactType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/user/skill`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user skill contacts:", error);
    return [];
  }
};

/**
 * Fetch material contacts sent by current user
 */
export const fetchUserMaterialContacts = async (): Promise<ContactType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/user/material`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user material contacts:", error);
    return [];
  }
};

/**
 * Fetch skill contacts received for user's skills
 */
export const fetchSkillContacts = async (): Promise<ContactType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/received/skill`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skill contacts:", error);
    return [];
  }
};

/**
 * Fetch material contacts received for user's materials
 */
export const fetchMaterialContacts = async (): Promise<ContactType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/received/material`);
    return response.data;
  } catch (error) {
    console.error("Error fetching material contacts:", error);
    return [];
  }
};
