
import { useState } from "react";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";
import {
  getApplicationDetails,
  getWorkDetails,
  updateApplicationStatus,
  updateWorkStatus,
  updateSkillContactStatus,
  updateMaterialContactStatus,
  createWorkFromApplication,
  createWorkFromSkillContact,
  createWorkFromMaterialContact,
  deleteJob,
  deleteSkill,
  deleteMaterial,
} from "@/services/api";
import { Badge } from "@/components/ui/badge";

interface UseWorkDetailsProps {
  setDetailsItem: React.Dispatch<React.SetStateAction<any>>;
  setDetailsType: React.Dispatch<React.SetStateAction<string>>;
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  isDetailsOpen: boolean;
  detailsItem: any;
}

export const useWorkDetails = ({
  setDetailsItem,
  setDetailsType,
  setIsDetailsOpen,
  navigate,
  isDetailsOpen,
  detailsItem,
}: UseWorkDetailsProps) => {
  
  const handleViewDetails = async (item: any, type: string) => {
    // For certain types, we need to fetch more details
    let detailItem = item;
    
    try {
      if (type === 'application' && item.id) {
        const details = await getApplicationDetails(item.id);
        if (details) {
          detailItem = { ...item, ...details };
        }
      }
      else if (type === 'work' && item.id) {
        const details = await getWorkDetails(item.id);
        if (details) {
          detailItem = { ...item, ...details };
        }
      }
      
      setDetailsItem(detailItem);
      setDetailsType(type);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      toast.error(`Failed to load details. Please try again.`);
    }
  };

  const handleEdit = (item: any, type: string) => {
    localStorage.setItem("editItem", JSON.stringify(item));
    localStorage.setItem("editType", type);
    navigate(`/dashboard/browse?tab=post&type=${type}`);
  };

  const handleDelete = async (id: number, type: string) => {
    try {
      if (type === 'job') {
        await deleteJob(id);
      } else if (type === 'skill') {
        await deleteSkill(id);
      } else if (type === 'material') {
        await deleteMaterial(id);
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      // This is handled by the component that calls this function
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleStatusChange = async (id: number, type: string, newStatus: string) => {
    try {
      if (type === 'job_application') {
        await updateApplicationStatus(id, newStatus);
      } 
      else if (type === 'skill_contact') {
        await updateSkillContactStatus(id, newStatus);
      }
      else if (type === 'material_contact') {
        await updateMaterialContactStatus(id, newStatus);
      }
      else if (type === 'work') {
        await updateWorkStatus(id, newStatus);
      }
      
      toast.success(`Status updated to ${newStatus}`);
      
      // Close the details dialog if open
      if (isDetailsOpen && detailsItem?.id === id) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      toast.error('Failed to update status');
    }
  };

  const handleCreateWork = async (id: number, type: string) => {
    try {
      if (type === 'job_application') {
        await createWorkFromApplication(id);
      } 
      else if (type === 'skill_contact') {
        await createWorkFromSkillContact(id);
      }
      else if (type === 'material_contact') {
        await createWorkFromMaterialContact(id);
      }
      
      toast.success('Work assignment created successfully');
      
      // Close the details dialog if open
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error(`Error creating work from ${type}:`, error);
      toast.error('Failed to create work assignment');
    }
  };

  // We'll move the JSX rendering to component files
  return {
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleCreateWork,
  };
};
