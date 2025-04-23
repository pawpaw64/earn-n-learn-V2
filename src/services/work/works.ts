
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

export const fetchMyWorks = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockWorks;
};
