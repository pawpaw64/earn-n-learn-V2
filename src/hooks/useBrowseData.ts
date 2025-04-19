
interface Teacher {
  name: string;
  email: string;
  rating: number;
  memberSince: string;
}

interface Job {
  id: number;
  title: string;
  type: string;
  description: string;
  payment: string;
  poster: {
    name: string;
    email: string;
    rating: number;
    memberSince: string;
    completedProjects: number;
  };
  deadline: string;
  requiredSkills: string[];
  timeline: string;
  category: string;
}

interface Skill {
  id: number;
  name: string;
  skillName: string;
  pricingType: "paid" | "free" | "trade";
  price: string;
  description: string;
  methodology: string;
  prerequisites: string[];
  availability: string;
  teacher: Teacher;
}

interface Material {
  id: number;
  materialName: string;
  condition: string;
  type: "sale" | "rent" | "borrow";
  price: string;
  description: string;
  availability: string;
  photos: string[];
  owner: Teacher;
}

export const useBrowseData = () => {
  const jobs: Job[] = [{
    id: 1,
    title: "Web Developer Needed",
    type: "Remote",
    description: "Looking for a skilled web developer to create a portfolio website. Experience with React required.",
    payment: "$20-30/hr",
    poster: {
      name: "Jane Doe",
      email: "jane@example.com",
      rating: 4.8,
      memberSince: "Jan 2023",
      completedProjects: 15
    },
    deadline: "2024-05-01",
    requiredSkills: ["React", "TypeScript", "UI Design"],
    timeline: "2-3 weeks",
    category: "Web Development"
  }];
  
  const skills: Skill[] = [{
    id: 1,
    name: "Alex Chen",
    skillName: "Python Tutoring",
    pricingType: "paid",
    price: "$15/hr",
    description: "Interactive Python lessons for beginners and intermediate learners. Focus on practical applications and problem-solving.",
    methodology: "Project-based learning with hands-on exercises and real-world examples.",
    prerequisites: ["Basic computer skills", "Eagerness to learn"],
    availability: "Weekday evenings and weekends",
    teacher: {
      name: "Alex Chen",
      email: "alex@example.com",
      rating: 4.9,
      memberSince: "Mar 2023"
    }
  }];
  
  const materials: Material[] = [{
    id: 1,
    materialName: "Textbooks (Economics 101)",
    condition: "Like New",
    type: "sale",
    price: "$30",
    description: "Complete set of Economics 101 textbooks, includes study guides. Barely used, no markings or highlights.",
    availability: "Available immediately",
    photos: ["/placeholder.svg", "/placeholder.svg"],
    owner: {
      name: "David Kim",
      email: "david@example.com",
      rating: 4.7,
      memberSince: "Sep 2023"
    }
  }];

  return {
    jobs,
    skills,
    materials
  };
};

export type { Job, Skill, Material, Teacher };
