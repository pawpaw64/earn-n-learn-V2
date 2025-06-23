
import { useState } from "react";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";
import { getApplicationDetails, updateApplicationStatus } from "@/services/applications";

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
  createProjectFromApplication

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

  const handleViewDetails = async (item: any, type: string): Promise<void> => {
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

  const handleDelete = async (id: number, type: string): Promise<boolean> => {
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
      toast.error(` Cannot delete ${type} with accepted applications until project is completed `);
      setIsProcessing(false);
      return false;
    }
  };
  
const handleStatusChange = async (id: number, type: string, newStatus: string): Promise<{ success: boolean; projectId?: number }> => {
  try {
    setIsProcessing(true);

    if (type === 'job_application') {
      await updateApplicationStatus(id, newStatus);
      

      if (newStatus === 'Accepted') {
        try {
          const project = await createProjectFromApplication(id);
          toast.success('Project created successfully', {
            description: `Project #${project.id} has been created`,





          });
          
          return { success: true, projectId: project.id };
        } catch (projectError) {
          console.error('Project creation failed:', projectError);
          toast.error('Project creation failed', {
            description: 'The application was accepted but project creation failed'




          });
          return { success: false };
        }
      }
    }
    return { success: true };









  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false };
  } finally {
    setIsProcessing(false);

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