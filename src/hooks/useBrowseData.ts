
import { useState, useMemo, useEffect } from "react";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import { fetchJobs, fetchMaterials, fetchSkills } from "@/services/api"; 
import { getUserIdFromToken } from "@/services/api/auth";

/**
 * Custom hook for managing browse data and filters
 * Handles fetching, filtering, and sorting of marketplace listings
 */
const useBrowseData = () => {
  // State for search and filter parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  
  // State for marketplace data
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  
  // State for tracking loading and error states
  const [loading, setLoading] = useState({
    jobs: false,
    skills: false,
    materials: false,
  });
  const [error, setError] = useState({
    jobs: null,
    skills: null,
    materials: null,
  });

  // Get current user ID from token
  const currentUserId = getUserIdFromToken(localStorage.getItem('token'));
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, jobs: true, skills: true, materials: true }));
        
        // Get current user ID to exclude their own listings
        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        
        // Fetch data from API with user ID to exclude their own listings
        const jobsData = await fetchJobs(userId || undefined);
        const skillsData = await fetchSkills(userId || undefined);   
        const materialsData = await fetchMaterials(userId || undefined);
       
        setJobs(jobsData);
        setSkills(skillsData);
        setMaterials(materialsData);
        
      } catch (err: any) {
        setError({
          jobs: err.message,
          skills: err.message,
          materials: err.message
        });
      } finally {
        setLoading(prev => ({
          ...prev,
          jobs: false,
          skills: false,
          materials: false
        }));
      }
    };
    fetchData();
  }, []); // Added empty dependency array to prevent infinite renders

  // Filter jobs based on search query and category filter
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
    } else if (sortBy === "recent") {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    }
    
    return filtered;
  }, [jobs, searchQuery, categoryFilter, sortBy]);

  // Filter skills based on search query and category filter
  const filteredSkills = useMemo(() => {
    let filtered = skills;
    
    if (searchQuery) {
      filtered = filtered.filter(skill => {
        const skillName = skill.skill || skill.skill_name || skill.name || '';
        return skillName.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (skill.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    if (categoryFilter !== "all" && categoryFilter !== "skills") {
      return [];
    }
    
    // Sort logic
    if (sortBy === "price-low" || sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = a.pricing?.includes("Free") ? 0 : parseInt((a.pricing || '0').replace(/[^0-9]/g, '')) || 0;
        const bPrice = b.pricing?.includes("Free") ? 0 : parseInt((b.pricing || '0').replace(/[^0-9]/g, '')) || 0;
        return sortBy === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      });
    } else if (sortBy === "recent") {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    }
    
    return filtered;
  }, [skills, searchQuery, categoryFilter, sortBy]);

  // Filter materials based on search query and category filter
  const filteredMaterials = useMemo(() => {
    let filtered = materials;
    
    if (searchQuery) {
      filtered = filtered.filter(material => {
        const materialName = material.material || material.title || material.name || '';
        return materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (material.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    if (categoryFilter !== "all" && categoryFilter !== "materials") {
      return [];
    }
    
    // Sort logic
    if (sortBy === "price-low" || sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = (a.price || '').includes("Free") ? 0 : parseInt((a.price || '0').replace(/[^0-9]/g, '')) || 0;
        const bPrice = (b.price || '').includes("Free") ? 0 : parseInt((b.price || '0').replace(/[^0-9]/g, '')) || 0;
        return sortBy === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      });
    } else if (sortBy === "recent") {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
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
    filteredMaterials,
    loading,
    error,
  };
};

export default useBrowseData;
