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
  try {
    const response = await axios.get(`${API_URL}/jobs`);
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

export const fetchMyApplications = async () => {
  setAuthToken(localStorage.getItem('token'));
  // TODO: Replace with actual API call when backend is implemented
  const mockApplications = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Inc",
      status: "Applied",
      dateApplied: "2024-04-15",
      description: "Applied for the frontend developer position focused on React and TypeScript development.",
      type: "Part-time",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Creative Studios",
      status: "In Review",
      dateApplied: "2024-04-10",
      description: "Applied for the UI/UX designer position for the campus mobile app project.",
      type: "Project-based",
    }
  ];
  return mockApplications;
};

export const fetchMyWorks = async () => {
  setAuthToken(localStorage.getItem('token'));
  // TODO: Replace with actual API call when backend is implemented
  const mockWorks = [
    {
      id: 1,
      title: "Website Development",
      company: "Student Union",
      status: "In Progress",
      startDate: "2024-03-01",
      deadline: "2024-05-01",
      description: "Developing the new student union website using React and Tailwind CSS.",
      type: "Project",
    },
    {
      id: 2,
      title: "Database Tutor",
      company: "Computer Science Department",
      status: "Completed",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      description: "Provided SQL and database design tutoring to junior students.",
      type: "Part-time",
    }
  ];
  return mockWorks;
};

export const fetchMyPosts = async () => {
  setAuthToken(localStorage.getItem('token'));
  // TODO: Replace with actual API call when backend is implemented
  const mockPosts = [
    {
      id: 1,
      title: "Math Tutor Needed",
      type: "Teaching",
      description: "Looking for a calculus tutor for freshman students.",
      payment: "$25/hour",
      status: "Active",
      postedDate: "2024-04-01",
    },
    {
      id: 2,
      title: "Campus Event Photographer",
      type: "Creative",
      description: "Need a photographer for the upcoming spring festival.",
      payment: "$150/event",
      status: "Closed",
      postedDate: "2024-03-25",
    }
  ];
  return mockPosts;
};

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

// Mock user profile data
export const fetchUserProfile = async (userId?: string) => {
  setAuthToken(localStorage.getItem('token'));
  // TODO: Replace with actual API call when backend is implemented
  return {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Student at Local University, passionate about technology and innovation.",
    avatar: "",
    program: "Computer Science",
    graduationYear: "2025",
    skills: [
      { id: "1", name: "React", description: "Frontend development with React", acquiredFrom: "Online course" },
      { id: "2", name: "MySQL", description: "Database management", acquiredFrom: "University course" }
    ],
    portfolio: [
      { id: "1", title: "Campus Marketplace", description: "A platform for students to buy and sell items", url: "https://github.com/johndoe/campus-marketplace", type: "github" }
    ],
    websites: [
      { id: "1", title: "GitHub", url: "https://github.com/johndoe", icon: "github" },
      { id: "2", title: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: "linkedin" }
    ]
  };
};

export const updateUserProfile = async (profileData: any) => {
  setAuthToken(localStorage.getItem('token'));
  // TODO: Replace with actual API call when backend is implemented
  return profileData;
};

export const uploadProfileImage = async (userId: string, imageFile: File) => {
  setAuthToken(localStorage.getItem('token'));
  // TODO: Replace with actual API call when backend is implemented
  return URL.createObjectURL(imageFile);
};
