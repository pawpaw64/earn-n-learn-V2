
import { useState, useMemo } from "react";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";

const useBrowseData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // This would come from an API in a real application
  const jobs: JobType[] = [
    {
      id: 1,
      title: "Web Developer Needed",
      type: "Remote",
      description: "Looking for a skilled web developer to create a portfolio website. Experience with React required.",
      payment: "$20-30/hr",
      poster: "Jane Doe",
      posterEmail: "jane.doe@example.com",
      posterAvatar: "https://i.pravatar.cc/150?img=1",
      location: "Remote",
      deadline: "May 15, 2025",
      requirements: "2+ years experience with React"
    },
    {
      id: 2,
      title: "Campus Tour Guide",
      type: "On-campus",
      description: "Seeking friendly students to lead campus tours for prospective students and their families.",
      payment: "$15/hr",
      poster: "University Events Team",
      posterEmail: "events@university.edu",
      posterAvatar: "https://i.pravatar.cc/150?img=2",
      location: "Main Campus",
      deadline: "May 1, 2025"
    },
    {
      id: 3,
      title: "Logo Designer",
      type: "Freelance",
      description: "Need a creative designer to create a logo for a new student club.",
      payment: "$50 flat rate",
      poster: "Student Club Association",
      posterEmail: "clubs@university.edu",
      posterAvatar: "https://i.pravatar.cc/150?img=3",
      location: "Remote or On-campus"
    }
  ];

  const skills: SkillType[] = [
    {
      id: 1,
      name: "Alex Chen",
      skill: "Python Tutoring",
      pricing: "$15/hr or skill exchange",
      description: "Computer Science major offering Python tutoring for beginners and intermediate students. Can help with homework and projects.",
      email: "alex.chen@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      experienceLevel: "Advanced",
      availability: "Weekday evenings"
    },
    {
      id: 2,
      name: "Maya Johnson",
      skill: "Graphic Design",
      pricing: "$20/hr",
      description: "Experienced in Adobe Creative Suite. Can help with logos, posters, and social media graphics.",
      email: "maya.johnson@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      experienceLevel: "Intermediate",
      availability: "Weekends"
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      skill: "Spanish Lessons",
      pricing: "Free",
      description: "Native Spanish speaker offering conversation practice and basic grammar lessons.",
      email: "carlos.rodriguez@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=6",
      experienceLevel: "Native",
      availability: "Flexible"
    }
  ];

  const materials: MaterialType[] = [
    {
      id: 1,
      name: "David Kim",
      material: "Textbooks (Economics 101)",
      condition: "Like New",
      price: "$30",
      availability: "For Sale",
      description: "Used for one semester, no highlights or notes. Includes study guide.",
      email: "david.kim@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=7",
      location: "University Library"
    },
    {
      id: 2,
      name: "Sarah Williams",
      material: "DSLR Camera",
      condition: "Good",
      price: "$15/day",
      availability: "For Rent",
      description: "Canon EOS 80D with 18-55mm lens. Great for photography class projects.",
      email: "sarah.williams@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
      duration: "1-7 days",
      location: "Campus Center"
    },
    {
      id: 3,
      name: "Jamal Thompson",
      material: "Chemistry Lab Equipment",
      condition: "Excellent",
      price: "Free",
      availability: "To Borrow",
      description: "Set of beakers, test tubes, and pipettes. Must be returned in same condition.",
      email: "jamal.thompson@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
      duration: "3 days max",
      location: "Science Building"
    }
  ];

  // Filter logic
  const filteredJobs = useMemo(() => {
    let filtered = jobs;
    
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all" && categoryFilter !== "jobs") {
      return [];
    }
    
    // Sort logic
    if (sortBy === "price-low") {
      // Simple sorting by extracting dollar amounts
      filtered = [...filtered].sort((a, b) => {
        const aPrice = parseInt(a.payment.replace(/[^0-9]/g, '')) || 0;
        const bPrice = parseInt(b.payment.replace(/[^0-9]/g, '')) || 0;
        return aPrice - bPrice;
      });
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = parseInt(a.payment.replace(/[^0-9]/g, '')) || 0;
        const bPrice = parseInt(b.payment.replace(/[^0-9]/g, '')) || 0;
        return bPrice - aPrice;
      });
    }
    
    return filtered;
  }, [jobs, searchQuery, categoryFilter, sortBy]);

  const filteredSkills = useMemo(() => {
    let filtered = skills;
    
    if (searchQuery) {
      filtered = filtered.filter(skill => 
        skill.skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all" && categoryFilter !== "skills") {
      return [];
    }
    
    // Sort logic similar to jobs
    if (sortBy === "price-low" || sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = a.pricing.includes("Free") ? 0 : parseInt(a.pricing.replace(/[^0-9]/g, '')) || 0;
        const bPrice = b.pricing.includes("Free") ? 0 : parseInt(b.pricing.replace(/[^0-9]/g, '')) || 0;
        return sortBy === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      });
    }
    
    return filtered;
  }, [skills, searchQuery, categoryFilter, sortBy]);

  const filteredMaterials = useMemo(() => {
    let filtered = materials;
    
    if (searchQuery) {
      filtered = filtered.filter(material => 
        material.material.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all" && categoryFilter !== "materials") {
      return [];
    }
    
    // Sort logic similar to jobs and skills
    if (sortBy === "price-low" || sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = a.price.includes("Free") ? 0 : parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
        const bPrice = b.price.includes("Free") ? 0 : parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
        return sortBy === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      });
    }
    
    return filtered;
  }, [materials, searchQuery, categoryFilter, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    jobs,
    skills,
    materials,
    filteredJobs,
    filteredSkills,
    filteredMaterials
  };
};

export default useBrowseData;
