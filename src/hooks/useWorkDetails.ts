
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

  const renderDetailsContent = () => {
    if (!detailsItem) return null;
    
    switch (detailsType) {
      case 'application':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Job Title</p>
                <p>{detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Poster</p>
                <p>{detailsItem.poster_name || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.type}</p>
              </div>
              <div>
                <p className="font-semibold">Date Applied</p>
                <p>{new Date(detailsItem.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Payment</p>
                <p>{detailsItem.payment || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Cover Letter</p>
              <p className="text-muted-foreground whitespace-pre-line">{detailsItem.cover_letter}</p>
            </div>
            {detailsItem.description && (
              <div>
                <p className="font-semibold">Job Description</p>
                <p className="text-muted-foreground">{detailsItem.description}</p>
              </div>
            )}
          </div>
        );
      case 'job':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.type}</p>
              </div>
              <div>
                <p className="font-semibold">Payment</p>
                <p>{detailsItem.payment}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge>{detailsItem.status}</Badge>
              </div>
              {detailsItem.deadline && (
                <div>
                  <p className="font-semibold">Deadline</p>
                  <p>{new Date(detailsItem.deadline).toLocaleDateString()}</p>
                </div>
              )}
              {detailsItem.location && (
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{detailsItem.location}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.description}</p>
            </div>
            {detailsItem.requirements && (
              <div>
                <p className="font-semibold">Requirements</p>
                <p className="text-muted-foreground">{detailsItem.requirements}</p>
              </div>
            )}
            {detailsItem.applicationsCount !== undefined && (
              <div>
                <p className="font-semibold">Applications</p>
                <p>{detailsItem.applicationsCount} applicant(s)</p>
              </div>
            )}
          </div>
        );
      case 'skill':
      case 'material':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.skill_name || detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Price/Rate</p>
                <p>{detailsItem.pricing || detailsItem.price}</p>
              </div>
              <div>
                <p className="font-semibold">Availability</p>
                <p>{detailsItem.availability}</p>
              </div>
              {detailsItem.condition && (
                <div>
                  <p className="font-semibold">Condition</p>
                  <p>{detailsItem.condition}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.description}</p>
            </div>
          </div>
        );
      case 'work':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.job_title || detailsItem.skill_name || detailsItem.material_title || detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.job_type || detailsItem.type || (detailsItem.skill_name ? 'Skill Service' : 'Material')}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  detailsItem.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Start Date</p>
                <p>{new Date(detailsItem.start_date).toLocaleDateString()}</p>
              </div>
              {detailsItem.end_date && (
                <div>
                  <p className="font-semibold">End Date</p>
                  <p>{new Date(detailsItem.end_date).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">Payment/Price</p>
                <p>{detailsItem.job_payment || detailsItem.skill_pricing || detailsItem.material_price || detailsItem.payment}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.job_description || detailsItem.skill_description || detailsItem.material_description || detailsItem.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Provider</p>
                <p>{detailsItem.provider_name}</p>
              </div>
              <div>
                <p className="font-semibold">Client</p>
                <p>{detailsItem.client_name}</p>
              </div>
            </div>
            {detailsItem.notes && (
              <div>
                <p className="font-semibold">Notes</p>
                <p className="text-muted-foreground">{detailsItem.notes}</p>
              </div>
            )}
          </div>
        );
      case 'invoice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Invoice Number</p>
                <p>{detailsItem.invoiceNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Client</p>
                <p>{detailsItem.client}</p>
              </div>
              <div>
                <p className="font-semibold">Amount</p>
                <p className="font-medium text-emerald-600">{detailsItem.amount}</p>
              </div>
              <div>
                <p className="font-semibold">Issue Date</p>
                <p>{detailsItem.date}</p>
              </div>
              <div>
                <p className="font-semibold">Due Date</p>
                <p>{detailsItem.dueDate}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Paid' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Item</p>
                <p>{detailsItem.skill_name || detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Price</p>
                <p>{detailsItem.pricing || detailsItem.price}</p>
              </div>
              <div>
                <p className="font-semibold">Contact</p>
                <p>{detailsItem.contact_name || detailsItem.provider_name || detailsItem.seller_name}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Agreement Reached' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Declined' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Date</p>
                <p>{new Date(detailsItem.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Message</p>
              <p className="text-muted-foreground whitespace-pre-line">{detailsItem.message}</p>
            </div>
          </div>
        );
      default:
        return <p>No details available</p>;
    }
  };

  const renderActionButtons = () => {
    if (!detailsItem) return null;
    
    switch (detailsType) {
      case 'application':
        // Only show withdraw button if status is Applied or Reviewing
        if (['Applied', 'Reviewing'].includes(detailsItem.status)) {
          return (
            <Button 
              variant="outline" 
              className="gap-1 text-red-600"
              onClick={() => handleStatusChange(detailsItem.id, 'job_application', 'Withdrawn')}
            >
              <X className="h-4 w-4" /> Withdraw Application
            </Button>
          );
        }
        return null;
        
      case 'job':
        return (
          <Button 
            onClick={() => handleEdit(detailsItem, 'job')}
            className="gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Job
          </Button>
        );
        
      case 'skill':
        return (
          <Button 
            onClick={() => handleEdit(detailsItem, 'skill')}
            className="gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Skill
          </Button>
        );
        
      case 'material':
        return (
          <Button 
            onClick={() => handleEdit(detailsItem, 'material')}
            className="gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Material
          </Button>
        );
        
      case 'work':
        // Only show status change buttons if the work is not completed or cancelled
        if (!['Completed', 'Cancelled'].includes(detailsItem.status)) {
          return (
            <div className="flex gap-2 flex-wrap">
              {detailsItem.status !== 'In Progress' && (
                <Button 
                  variant="outline" 
                  className="gap-1 text-blue-600"
                  onClick={() => handleStatusChange(detailsItem.id, 'work', 'In Progress')}
                >
                  <Clock className="h-4 w-4" /> Mark In Progress
                </Button>
              )}
              {detailsItem.status !== 'Paused' && (
                <Button 
                  variant="outline" 
                  className="gap-1 text-yellow-600"
                  onClick={() => handleStatusChange(detailsItem.id, 'work', 'Paused')}
                >
                  <Clock className="h-4 w-4" /> Pause Work
                </Button>
              )}
              <Button 
                variant="outline" 
                className="gap-1 text-green-600"
                onClick={() => handleStatusChange(detailsItem.id, 'work', 'Completed')}
              >
                <Check className="h-4 w-4" /> Mark Complete
              </Button>
              <Button 
                variant="outline" 
                className="gap-1 text-red-600"
                onClick={() => handleStatusChange(detailsItem.id, 'work', 'Cancelled')}
              >
                <X className="h-4 w-4" /> Cancel Work
              </Button>
            </div>
          );
        }
        return null;
        
      case 'contact':
        // Only show status change options for received contacts
        if (detailsItem.contact_name) {
          const contactType = detailsItem.skill_id ? 'skill_contact' : 'material_contact';
          // Only show options if not already in final states
          if (!['Agreement Reached', 'Declined', 'Completed'].includes(detailsItem.status)) {
            return (
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  className="gap-1 text-blue-600"
                  onClick={() => handleStatusChange(detailsItem.id, contactType, 'Responded')}
                >
                  <Clock className="h-4 w-4" /> Mark Responded
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 text-blue-600"
                  onClick={() => handleStatusChange(detailsItem.id, contactType, 'In Discussion')}
                >
                  <Clock className="h-4 w-4" /> In Discussion
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 text-green-600"
                  onClick={() => handleCreateWork(detailsItem.id, contactType)}
                >
                  <UserCheck className="h-4 w-4" /> Create Agreement
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 text-red-600"
                  onClick={() => handleStatusChange(detailsItem.id, contactType, 'Declined')}
                >
                  <X className="h-4 w-4" /> Decline
                </Button>
              </div>
            );
          } else if (detailsItem.status === 'Agreement Reached') {
            // If agreement reached but work not created yet
            return (
              <Button 
                className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleCreateWork(
                  detailsItem.id, 
                  detailsItem.skill_id ? 'skill_contact' : 'material_contact'
                )}
              >
                <UserCheck className="h-4 w-4" /> Create Work Assignment
              </Button>
            );
          }
        }
        return null;

      default:
        return null;
    }
  };

  return {
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleCreateWork,
    renderDetailsContent,
    renderActionButtons,
  };
};
