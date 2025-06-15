
import axios from 'axios';
import { setAuthToken } from './auth';
import { toast } from "sonner";

const API_URL = 'http://localhost:8080/api';

export const fetchMyContacts = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/my-contacts`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching my contacts:", error);
    toast.error("Failed to load your contacts");
    return [];
  }
};

export const fetchReceivedContacts = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/received`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching received contacts:", error);
    toast.error("Failed to load received contacts");
    return [];
  }
};

export const updateSkillContactStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.put(`${API_URL}/contacts/skill/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error("Update skill contact status error:", error);
    toast.error(error.response?.data?.message || "Failed to update contact status");
    throw error;
  }
};

export const updateMaterialContactStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.put(`${API_URL}/contacts/material/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error("Update material contact status error:", error);
    toast.error(error.response?.data?.message || "Failed to update contact status");
    throw error;
  }
};

export const getSkillContactDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/skill/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get skill contact details error:", error);
    throw error;
  }
};

export const getMaterialContactDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/contacts/material/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get material contact details error:", error);
    throw error;
  }
};
