import { JobType, SkillType, MaterialType } from '@/types/marketplace';

// Mock data for My Work section
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

// Mock API functions
export const fetchMyApplications = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockApplications;
};

export const fetchMyWorks = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockWorks;
};

export const fetchMyPosts = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockPosts;
};

export const fetchMyInvoices = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockInvoices;
};

// Mock user profile data
export const fetchUserProfile = async (userId?: string) => {
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
  // TODO: Replace with actual API call when backend is implemented
  return profileData;
};

export const uploadProfileImage = async (userId: string, imageFile: File) => {
  // TODO: Replace with actual API call when backend is implemented
  return URL.createObjectURL(imageFile);
};

// Mock job-related functions
export const fetchJobs = async (): Promise<JobType[]> => {
  // TODO: Replace with actual API call when backend is implemented
  return [];
};

export const createJob = async (jobData: Omit<JobType, 'id'>): Promise<{ jobId: number }> => {
  // TODO: Replace with actual API call when backend is implemented
  return { jobId: Math.floor(Math.random() * 1000) };
};
