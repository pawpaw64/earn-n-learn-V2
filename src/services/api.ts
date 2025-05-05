
import axios from 'axios';
import { JobType, SkillType, MaterialType, ApplicationType, ContactType, WorkType, InvoiceType, NotificationType } from '@/types/marketplace';

const API_URL = 'http://localhost:8080/api'; // Backend runs on port 8080

// Set up axios with token
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Auth types
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  message: string;
}

// Auth services
export const registerUser = async (userData: any): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: any): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/users/me`);
  return response.data;
};

// Job services
export const fetchJobs = async (excludeUserId?: number): Promise<JobType[]> => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  try {
    const url = excludeUserId 
      ? `${API_URL}/jobs?excludeUserId=${excludeUserId}`
      : `${API_URL}/jobs`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
export const createJob = async (jobData: Omit<JobType, 'id'>): Promise<{ jobId: number }> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

export const updateJob = async (id: number, jobData: Partial<JobType>): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/jobs/${id}`);
  return response.data;
};

export const getJobDetails = async (id: number): Promise<JobType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};

// Skill services
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
  const response = await axios.delete(`${API_URL}/skills/${id}`);
  return response.data;
};

export const getSkillDetails = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/skills/${id}`);
  return response.data;
};

// Material services
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
  const response = await axios.post(`${API_URL}/materials`, materialData);
  return response.data;
};

export const updateMaterial = async (id: number, materialData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/materials/${id}`, materialData);
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

// Application services
export const submitJobApplication = async (applicationData: { job_id: number, cover_letter: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/applications`, applicationData);
  return response.data;
};

export const updateApplicationStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/applications/${id}/status`, { status });
  return response.data;
};

export const getApplicationDetails = async (id: number): Promise<ApplicationType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/applications/${id}`);
  return response.data;
};

export const fetchUserApplications = async (): Promise<ApplicationType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/submitted`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return [];
  }
};

export const fetchJobApplications = async (): Promise<ApplicationType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/received`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return [];
  }
};

// Contact services
export const submitSkillContact = async (contactData: { skill_id: number, message: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/contacts/skill`, contactData);
  return response.data;
};

export const submitMaterialContact = async (contactData: { material_id: number, message: string }): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/contacts/material`, contactData);
  return response.data;
};

export const updateSkillContactStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/contacts/skill/${id}/status`, { status });
  return response.data;
};

export const updateMaterialContactStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/contacts/material/${id}/status`, { status });
  return response.data;
};

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

// Work services
export const createWorkFromApplication = async (applicationId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/works/from-application`, { application_id: applicationId });
  return response.data;
};

export const createWorkFromSkillContact = async (contactId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/works/from-skill-contact`, { contact_id: contactId });
  return response.data;
};

export const createWorkFromMaterialContact = async (contactId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/works/from-material-contact`, { contact_id: contactId });
  return response.data;
};

export const updateWorkStatus = async (id: number, status: string, notes?: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/works/${id}/status`, { status, notes });
  return response.data;
};

export const fetchProviderWorks = async (): Promise<WorkType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/works/as-provider`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provider works:", error);
    return [];
  }
};

export const fetchClientWorks = async (): Promise<WorkType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/works/as-client`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client works:", error);
    return [];
  }
};

export const getWorkDetails = async (id: number): Promise<WorkType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/works/${id}`);
  return response.data;
};

// Notification services
export const fetchNotifications = async (): Promise<NotificationType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const fetchUnreadNotificationCount = async (): Promise<number> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/notifications/unread-count`);
    return response.data.count;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return 0;
  }
};

export const markNotificationAsRead = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/notifications/read-all`);
  return response.data;
};

export const deleteNotification = async (id: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/notifications/${id}`);
  return response.data;
};

// Invoice services
export const fetchInvoices = async (): Promise<InvoiceType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/invoices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

export const createInvoice = async (invoiceData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/invoices`, invoiceData);
  return response.data;
};

export const updateInvoiceStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/invoices/${id}/status`, { status });
  return response.data;
};

export const getInvoiceDetails = async (id: number): Promise<InvoiceType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/invoices/${id}`);
  return response.data;
};

export const fetchMyApplications = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/applications/user/submitted`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const fetchMyWorks = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    // Fetch works where user is either provider or client
    const [asProvider, asClient] = await Promise.all([
      axios.get(`${API_URL}/works/as-provider`),
      axios.get(`${API_URL}/works/as-client`)
    ]);
    
    // Combine and format results
    const works = [...asProvider.data, ...asClient.data].map(work => ({
      id: work.id,
      title: work.job_title || work.skill_name || work.material_title || 'Untitled Work',
      company: work.provider_id === parseInt(localStorage.getItem('userId') || '0') 
        ? work.client_name : work.provider_name,
      type: work.job_type || (work.skill_id ? 'Skill' : 'Material'),
      status: work.status,
      description: work.job_description || work.skill_description || work.material_description || '',
      startDate: new Date(work.start_date).toLocaleDateString(),
      endDate: work.end_date ? new Date(work.end_date).toLocaleDateString() : null,
      payment: work.job_payment || work.skill_pricing || work.material_price
    }));
    
    return works;
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
};

export const fetchMyPosts = async (): Promise<{
  jobs: any[];
  skills: any[];
  materials: any[];
}> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const userId = getUserIdFromToken(localStorage.getItem('token'));
    if (!userId) return emptyPosts();

    const [jobs, skills, materials] = await Promise.all([
      axios.get(`${API_URL}/jobs/user/${userId}`),
      axios.get(`${API_URL}/skills/user/${userId}`),
      axios.get(`${API_URL}/materials/user/${userId}`)
    ]);
    
    // Also fetch applications for jobs
    const applications = await axios.get(`${API_URL}/applications/user/received`);
    
    // Add application counts to jobs
    const jobsWithAppCounts = jobs.data.map(job => {
      const jobApps = applications.data.filter(app => app.job_id === job.id);
      return {
        ...job,
        applicationsCount: jobApps.length
      };
    });

    return {
      jobs: jobsWithAppCounts || [],
      skills: skills.data || [],
      materials: materials.data || []
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return emptyPosts();
  }
};

function emptyPosts() {
  return { jobs: [], skills: [], materials: [] };
}

export const fetchMyInvoices = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/invoices`);
    
    // Format the data for the UI
    const invoices = response.data.map((invoice: InvoiceType) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      title: invoice.title,
      client: invoice.client,
      amount: `$${invoice.amount}`,
      date: new Date(invoice.issued_date).toLocaleDateString(),
      status: invoice.status,
      dueDate: new Date(invoice.due_date).toLocaleDateString()
    }));
    
    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

// User profile data
export const fetchUserProfile = async (userId?: string) => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (profileData: any) => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/users/profile`, profileData);
  return response.data;
};

export const uploadProfileImage = async (userId: string, imageFile: File) => {
  setAuthToken(localStorage.getItem('token'));
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axios.post(`${API_URL}/users/upload-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.imageUrl;
};

function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  
  try {
    // JWT tokens are made of 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // The middle part contains the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Most JWT implementations store user ID as 'id', 'sub', or 'userId'
    const userId = payload.id || payload.sub || payload.userId;
    return userId ? Number(userId) : null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
