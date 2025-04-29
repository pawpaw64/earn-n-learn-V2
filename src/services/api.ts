
import axios from 'axios';
import { JobType, SkillType, MaterialType } from '@/types/marketplace';

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
export const fetchJobs = async (): Promise<JobType[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found');
    return [];
  }
  
  setAuthToken(token);
  try {
    const response = await axios.get(`${API_URL}/jobs`);
    console.log('API Response:', response.data);
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
export const fetchSkills = async (): Promise<SkillType[]> => {
  try {
    const response = await axios.get(`${API_URL}/skills`);
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
export const fetchMaterials = async (): Promise<MaterialType[]> => {
  try {
    const response = await axios.get(`${API_URL}/materials`);
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

export const fetchMyApplications = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/applications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const fetchMyWorks = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/users/works`);
    return response.data;
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

    return {
      jobs: jobs.data || [],
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


function validateResponse(res) {
  if (!res.data) throw new Error('Empty response');
  return Array.isArray(res.data) ? res.data : [res.data];
}
export const fetchMyInvoices = async () => {
  setAuthToken(localStorage.getItem('token'));
  // TODO: Replace with actual API call when backend is implemented
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      title: "Website Development",
      amount: "$500",
      status: "Paid",
      date: "2024-04-01",
      client: "Student Union",
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      title: "Tutoring Services",
      amount: "$300",
      status: "Pending",
      date: "2024-04-15",
      client: "CS Department",
    }
  ];
  return mockInvoices;
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

function getUserIdFromToken(token: string): number | null {
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

