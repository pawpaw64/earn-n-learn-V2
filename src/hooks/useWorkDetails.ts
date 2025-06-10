
import { useState } from "react";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";
import { getApplicationDetails, updateApplicationStatus } from "@/services/applications";
import { 
  createWorkFromApplication, 
  createWorkFromSkillContact,
  getWorkDetails, 
  updateWorkStatus 
} from "@/services/works";
import { deleteJob } from "@/services/jobs";
import { deleteSkill } from "@/services/skills";
import { deleteMaterial } from "@/services/materials";
import { 
  updateSkillContactStatus, 
  updateMaterialContactStatus,
  getSkillContactDetails,
  getMaterialContactDetails 
} from "@/services/contacts";

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleViewDetails = async (item: any, type: string) => {
    // For certain types, we need to fetch more details
    let detailItem = item;
    
    try {
      setIsProcessing(true);
     
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
      else if (type === 'contact') {
        if (item.skill_id || item.skill_name) {
          const details = await getSkillContactDetails(item.id);
          if (details) {
            detailItem = { ...item, ...details };
          }
        } else if (item.material_id || item.title) {
          const details = await getMaterialContactDetails(item.id);
          if (details) {
            detailItem = { ...item, ...details };
          }
        }
      }
      
      setDetailsItem(detailItem);
      setDetailsType(type);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      toast.error(`Failed to load details. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (item: any, type: string) => {
    localStorage.setItem("editItem", JSON.stringify(item));
    localStorage.setItem("editType", type);
    navigate(`/dashboard/browse?tab=post&type=${type}`);
  };

  const handleDelete = async (id: number, type: string) => {
    try {
      setIsProcessing(true);
      
      if (type === 'job') {
        await deleteJob(id);
      } else if (type === 'skill') {
        await deleteSkill(id);
      } else if (type === 'material') {
        await deleteMaterial(id);
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
      setIsProcessing(false);
      return false;
    }
  };
// In useWorkDetails.ts, modify the handleStatusChange function:

const handleStatusChange = async (id: number, type: string, newStatus: string) => {
  try {
    setIsProcessing(true);
    
    if (type === 'job_application') {
      await updateApplicationStatus(id, newStatus);
      // Create work and project only when status is accepted
      if (newStatus === 'accepted') {
        const work = await createWorkFromApplication(id);
        if (work) {
          await createProjectFromWork(work.id, {});
          toast.success('Work assignment and project created successfully');
        }
      }
    } 
    else if (type === 'skill_contact') {
      await updateSkillContactStatus(id, newStatus);
      // Create work and project only when status is accepted
      if (newStatus === 'accepted') {
        const work = await createWorkFromSkillContact(id);
        if (work) {
          await createProjectFromWork(work.id, {});
          toast.success('Work assignment and project created successfully');
        }
      }
    }
    else if (type === 'material_contact') {
      await updateMaterialContactStatus(id, newStatus);
      // Create work and project only when status is accepted
      if (newStatus === 'accepted') {
        const work = await createWorkFromSkillContact(id);
        if (work) {
          await createProjectFromWork(work.id, {});
          toast.success('Work assignment and project created successfully');
        }
      }
    }
    else if (type === 'work') {
      await updateWorkStatus(id, newStatus);
    }
    
    if (newStatus !== 'accepted') {
      toast.success(`Status updated to ${newStatus}`);
    }
    
    if (isDetailsOpen && detailsItem?.id === id) {
      setIsDetailsOpen(false);
    }
    
    setIsProcessing(false);
    return true;
  } catch (error) {
    console.error(`Error updating ${type} status:`, error);
    toast.error('Failed to update status');
    setIsProcessing(false);
    return false;
  }
};

  return {
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleStatusChange,
    isProcessing
  };
};
function createProjectFromWork(id: any, arg1: {}) {
  throw new Error("Function not implemented.");
}

