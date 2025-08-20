import { useState, useMemo, useEffect, useCallback } from "react";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import { fetchSkills } from "@/services/skills";
import { fetchJobs } from "@/services/jobs";
import { fetchMaterials } from "@/services/materials"; 
import { getUserIdFromToken } from "@/services/auth";

/**
 * Custom hook for managing browse data and filters
 */
const useBrowseData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [materials, setMaterials] = useState<MaterialType[]>([]);
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

  // Fetch data on component mount - FIXED: Added empty dependency array
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, jobs: true, skills: true, materials: true }));
        
        const token = localStorage.getItem('token');
        const userId = token ? getUserIdFromToken(token) : null;
        
        const [jobsData, skillsData, materialsData] = await Promise.all([
          fetchJobs(userId || undefined),
          fetchSkills(userId || undefined),
          fetchMaterials(userId || undefined)
        ]);
       
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
  }, []); // Empty dependency array to run only once on mount

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
        const aPrice = parseInt(a.payment?.replace(/[^0-9]/g, '') || '0') || 0;
        const bPrice = parseInt(b.payment?.replace(/[^0-9]/g, '') || '0') || 0;
        return aPrice - bPrice;
      });
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = parseInt(a.payment?.replace(/[^0-9]/g, '') || '0') || 0;
        const bPrice = parseInt(b.payment?.replace(/[^0-9]/g, '') || '0') || 0;
        return bPrice - aPrice;
      });
      
    } else if (sortBy === "recent") {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    }
    
    return filtered;
  }, [jobs, searchQuery, categoryFilter, sortBy]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    let filtered = skills;
    
    if (searchQuery) {
      filtered = filtered.filter(skill => {
        const skillName = skill.skill || skill.skill_name || '';
        return skillName.toLowerCase().includes(searchQuery.toLowerCase())
      });
    }
    
    if (categoryFilter !== "all" && categoryFilter !== "skills") {
      return [];
    }
    
    // Sort logic similar to jobs
    if (sortBy === "price-low" || sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = a.pricing?.includes("Free") ? 0 : parseInt((a.pricing || '0').replace(/[^0-9]/g, '')) || 0;
        const bPrice = b.pricing?.includes("Free") ? 0 : parseInt((b.pricing || '0').replace(/[^0-9]/g, '')) || 0;
        return sortBy === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      });
    }
    
    return filtered;
  }, [skills, searchQuery, categoryFilter, sortBy]);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    let filtered = materials;
    
    if (searchQuery) {
      filtered = filtered.filter(material => {
        const materialName = material.material || material.title || '';
        return materialName.toLowerCase().includes(searchQuery.toLowerCase())
      });
    }
    
    if (categoryFilter !== "all" && categoryFilter !== "materials") {
      return [];
    }
    
    // Sort logic similar to jobs and skills
    if (sortBy === "price-low" || sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = (a.price || '').includes("Free") ? 0 : parseInt((a.price || '0').replace(/[^0-9]/g, '')) || 0;
        const bPrice = (b.price || '').includes("Free") ? 0 : parseInt((b.price || '0').replace(/[^0-9]/g, '')) || 0;
        return sortBy === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      });
    }
    
    return filtered;
  }, [materials, searchQuery, categoryFilter, sortBy]);

  // Optional: Add a refetch function if you need to refresh data
  const refetch = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, jobs: true, skills: true, materials: true }));
      
      const token = localStorage.getItem('token');
      const userId = token ? getUserIdFromToken(token) : null;
      
      const [jobsData, skillsData, materialsData] = await Promise.all([
        fetchJobs(userId || undefined),
        fetchSkills(userId || undefined),
        fetchMaterials(userId || undefined)
      ]);
     
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
  }, []);

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
    refetch, // Add refetch function if needed
  };
};

export default useBrowseData;