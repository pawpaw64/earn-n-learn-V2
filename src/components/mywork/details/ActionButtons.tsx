
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, UserCheck, Edit } from "lucide-react";

interface ActionButtonsProps {
  type: string;
  item: any;
  onStatusChange?: (id: number, type: string, status: string) => void;
  onCreateWork?: (id: number, type: string) => void;
  onEdit?: (item: any, type: string) => void;
}

/**
 * Renders appropriate action buttons based on item type and status
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  type, 
  item, 
  onStatusChange, 
  onCreateWork, 
  onEdit 
}) => {
  if (!item) return null;
  
  switch (type) {
    case 'application':
      // Only show withdraw button if status is Applied or Reviewing
      if (['Applied', 'Reviewing'].includes(item.status)) {
        return (
          <Button 
            variant="outline" 
            className="gap-1 text-red-600"
            onClick={() => onStatusChange && onStatusChange(item.id, 'job_application', 'Withdrawn')}
          >
            <X className="h-4 w-4" /> Withdraw Application
          </Button>
        );
      }
      return null;
      
    case 'job':
      return (
        <Button 
          onClick={() => onEdit && onEdit(item, 'job')}
          className="gap-1"
        >
          <Edit className="h-4 w-4" /> Edit Job
        </Button>
      );
      
    case 'skill':
      return (
        <Button 
          onClick={() => onEdit && onEdit(item, 'skill')}
          className="gap-1"
        >
          <Edit className="h-4 w-4" /> Edit Skill
        </Button>
      );
      
    case 'material':
      return (
        <Button 
          onClick={() => onEdit && onEdit(item, 'material')}
          className="gap-1"
        >
          <Edit className="h-4 w-4" /> Edit Material
        </Button>
      );
      
    case 'work':
      // Only show status change buttons if the work is not completed or cancelled
      if (!['Completed', 'Cancelled'].includes(item.status)) {
        return (
          <div className="flex gap-2 flex-wrap">
            {item.status !== 'In Progress' && (
              <Button 
                variant="outline" 
                className="gap-1 text-blue-600"
                onClick={() => onStatusChange && onStatusChange(item.id, 'work', 'In Progress')}
              >
                <Clock className="h-4 w-4" /> Mark In Progress
              </Button>
            )}
            {item.status !== 'Paused' && (
              <Button 
                variant="outline" 
                className="gap-1 text-yellow-600"
                onClick={() => onStatusChange && onStatusChange(item.id, 'work', 'Paused')}
              >
                <Clock className="h-4 w-4" /> Pause Work
              </Button>
            )}
            <Button 
              variant="outline" 
              className="gap-1 text-green-600"
              onClick={() => onStatusChange && onStatusChange(item.id, 'work', 'Completed')}
            >
              <Check className="h-4 w-4" /> Mark Complete
            </Button>
            <Button 
              variant="outline" 
              className="gap-1 text-red-600"
              onClick={() => onStatusChange && onStatusChange(item.id, 'work', 'Cancelled')}
            >
              <X className="h-4 w-4" /> Cancel Work
            </Button>
          </div>
        );
      }
      return null;
      
    case 'contact':
      // Only show status change options for received contacts
      if (item.contact_name) {
        const contactType = item.skill_id ? 'skill_contact' : 'material_contact';
        // Only show options if not already in final states
        if (!['Agreement Reached', 'Declined', 'Completed'].includes(item.status)) {
          return (
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                className="gap-1 text-blue-600"
                onClick={() => onStatusChange && onStatusChange(item.id, contactType, 'Responded')}
              >
                <Clock className="h-4 w-4" /> Mark Responded
              </Button>
              <Button 
                variant="outline" 
                className="gap-1 text-blue-600"
                onClick={() => onStatusChange && onStatusChange(item.id, contactType, 'In Discussion')}
              >
                <Clock className="h-4 w-4" /> In Discussion
              </Button>
              <Button 
                variant="outline" 
                className="gap-1 text-green-600"
                onClick={() => onCreateWork && onCreateWork(item.id, contactType)}
              >
                <UserCheck className="h-4 w-4" /> Create Agreement
              </Button>
              <Button 
                variant="outline" 
                className="gap-1 text-red-600"
                onClick={() => onStatusChange && onStatusChange(item.id, contactType, 'Declined')}
              >
                <X className="h-4 w-4" /> Decline
              </Button>
            </div>
          );
        } else if (item.status === 'Agreement Reached') {
          // If agreement reached but work not created yet
          return (
            <Button 
              className="gap-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onCreateWork && onCreateWork(
                item.id, 
                item.skill_id ? 'skill_contact' : 'material_contact'
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
