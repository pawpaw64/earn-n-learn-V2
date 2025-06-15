
// src/api/applications.ts
import axios from 'axios';
import { ApplicationType } from '@/types/marketplace';
import { setAuthToken } from './auth';
import { toast } from "sonner";

const API_URL = 'http://localhost:8080/api';

/**
 * Submit a new job application
 * @param applicationData Application data including job_id and cover_letter
 */
export const submitJobApplication = async (applicationData: { job_id: number, cover_letter: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.post(`${API_URL}/applications`, applicationData);
    toast.success("Application submitted successfully");
    return response.data;
  } catch (error: any) {
    console.error("Submit application error:", error);
    toast.error(error.response?.data?.message || "Failed to submit application");
    throw error;
  }
};

/**
 * Update the status of an application
 * @param id Application ID
 * @param status New status value
 */
export const updateApplicationStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    console.log(`Updating application ${id} status to ${status}`);
    const response = await axios.put(`${API_URL}/applications/${id}/status`, { status });
    
    // Show appropriate toast based on status
    if (status === 'Withdrawn') {
      toast.success("Application withdrawn successfully");
    } else {
      toast.success(`Application status updated to ${status}`);
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Update application status error:", error);
    toast.error(error.response?.data?.message || "Failed to update application status");
    throw error;
  }
};

/**
 * Get details of a specific application
 * @param id Application ID
 */
export const getApplicationDetails = async (id: number): Promise<ApplicationType> => {
  setAuthToken(localStorage.getItem('token'));
  
  try {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get application details error:", error);
    toast.error(error.response?.data?.message || "Failed to fetch application details");
    throw error;
  }
};

export const getmyApplicationDetails = async (id: number): Promise<ApplicationType> => {
  setAuthToken(localStorage.getItem('token')); 
  try {
    const response = await axios.get(`${API_URL}/applications/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get my application details error:", error);
    toast.error(error.response?.data?.message || "Failed to fetch application details");
    throw error;
  }
};

/**
 * Get all applicants for a specific job
 * @param jobId Job ID
 */
export const getJobApplicants = async (jobId: number): Promise<any[]> => {
  setAuthToken(localStorage.getItem('token'));
  
  try {
    const response = await axios.get(`${API_URL}/applications/job/${jobId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching job applicants:", error);
    toast.error("Failed to load applicants");
    return [];
  }
};

/**
 * Fetch all applications submitted by the current user
 */
export const fetchMyApplications = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/submitted`);
    console.log("My Applications:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    toast.error("Failed to load your applications");
    return [];
  }
};

/**
 * Fetch all applications received for jobs posted by the current user
 */
export const fetchJobApplications = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/received`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching job applications:", error);
    toast.error("Failed to load received applications");
    return [];
  }
};
