
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
