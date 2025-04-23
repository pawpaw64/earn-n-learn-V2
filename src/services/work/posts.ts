
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

export const fetchMyPosts = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockPosts;
};
