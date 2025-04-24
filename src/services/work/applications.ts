
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

export const fetchMyApplications = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockApplications;
};
