
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
import { 
  createProjectFromApplication, 
  createProjectFromContact 
} from "@/services/projects";

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

  const handleStatusChange = async (id: number, type: string, newStatus: string) => {
    try {
      setIsProcessing(true);
      
      if (type === 'job_application') {
        await updateApplicationStatus(id, newStatus);
        // Create project when status is accepted
        if (newStatus === 'accepted') {
          try {
            await createProjectFromApplication(id, {});
            toast.success('Work assignment accepted and project created successfully');
          } catch (error) {
            console.error('Error creating project from application:', error);
            toast.error('Work assignment accepted but failed to create project');
          }
        }
      } 
      else if (type === 'skill_contact') {
        await updateSkillContactStatus(id, newStatus);
        // Create project when status is accepted
        if (newStatus === 'accepted') {
          try {
            await createProjectFromContact(id, 'skill', {});
            toast.success('Skill contact accepted and project created successfully');
          } catch (error) {
            console.error('Error creating project from skill contact:', error);
            toast.error('Skill contact accepted but failed to create project');
          }
        }
      }
      else if (type === 'material_contact') {
        await updateMaterialContactStatus(id, newStatus);
        // Create project when status is accepted
        if (newStatus === 'accepted') {
          try {
            await createProjectFromContact(id, 'material', {});
            toast.success('Material contact accepted and project created successfully');
          } catch (error) {
            console.error('Error creating project from material contact:', error);
            toast.error('Material contact accepted but failed to create project');
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
