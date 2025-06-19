
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const fetchJobApplications = async () => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const response = await axios.get(`${API_URL}/applications/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return [];
  }
};

export const fetchContacts = async () => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const response = await axios.get(`${API_URL}/contacts/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

export const updateApplicationStatus = async (id: number, status: string): Promise<boolean> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    await axios.put(`${API_URL}/applications/${id}/status`, { status });
    return true;
  } catch (error) {
    console.error("Error updating application status:", error);
    return false;
  }
};

export const updateContactStatus = async (id: number, status: string): Promise<boolean> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    await axios.put(`${API_URL}/contacts/${id}/status`, { status });
    return true;
  } catch (error) {
    console.error("Error updating contact status:", error);
    return false;
  }
};

export const checkDeletePermission = async (id: number, type: string): Promise<{ canDelete: boolean; reason?: string }> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const response = await axios.get(`${API_URL}/${type}s/${id}/delete-permission`);
    return response.data;
  } catch (error) {
    console.error("Error checking delete permission:", error);
    return { canDelete: false, reason: "Unable to verify delete permission" };
  }
};
