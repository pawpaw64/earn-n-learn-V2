
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ActionButtonsProps {
  type: string;
  item: any;
  onStatusChange?: (id: number, type: string, status: string) => void;
  onCreateWork?: (id: number, type: string) => void;
}

/**
 * Renders appropriate action buttons based on item type and status
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  type, 
  item, 
  onStatusChange, 
  onCreateWork
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!item) return null;
  
  // Confirm withdrawal before proceeding
  const handleWithdraw = () => {
    if (window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      setIsLoading(true);
      onStatusChange && onStatusChange(item.id, 'job_application', 'Withdrawn')
        .finally(() => setIsLoading(false));
    }
  };

  // Handle agreement creation
  const handleCreateAgreement = () => {
    if (window.confirm("Are you sure you want to create an agreement? This will initiate a work assignment.")) {
      setIsLoading(true);
      onCreateWork && onCreateWork(item.id, type === 'contact' ? 
        (item.skill_id ? 'skill_contact' : 'material_contact') : type)
        .finally(() => setIsLoading(false));
    }
  };

  // Handle status change with confirmation
  const handleStatusChange = (itemId: number, itemType: string, status: string) => {
    const statusMessages = {
      'Responded': 'respond to',
      'In Discussion': 'mark in discussion with',
      'Declined': 'decline',
      'In Progress': 'mark as in progress',
      'Paused': 'pause',
      'Completed': 'mark as completed',
      'Cancelled': 'cancel'
    };
    
    const message = `Are you sure you want to ${statusMessages[status] || 'update the status of'} this ${itemType}?`;
    
    if (window.confirm(message)) {
      setIsLoading(true);
      onStatusChange && onStatusChange(itemId, itemType, status)
        .finally(() => setIsLoading(false));
    }
  };
  
  // Determine if the current user is the provider/seller/recipient (vs the initiator)
  const isReceivedItem = Boolean(item.contact_name || item.applicant_name);
  
  switch (type) {
    case 'application':
      // Only show withdraw button if status is Applied or Reviewing
      if (['Applied', 'Reviewing'].includes(item.status)) {
        return (
          <Button 
            variant="outline" 
            className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleWithdraw}
            disabled={isLoading}
          >
            <X className="h-4 w-4" /> Withdraw Application
          </Button>
        );
      }
      return null;
      
    case 'work':
      // Only show status change buttons if the work is not completed or cancelled
      if (!['Completed', 'Cancelled'].includes(item.status)) {
        return (
          <div className="flex gap-2 flex-wrap">
            {item.status !== 'In Progress' && (
              <Button 
                variant="outline" 
                className="gap-1.5 text-blue-600"
                onClick={() => handleStatusChange(item.id, 'work', 'In Progress')}
                disabled={isLoading}
              >
                <Clock className="h-4 w-4" /> Mark In Progress
              </Button>
            )}
            {item.status !== 'Paused' && (
              <Button 
                variant="outline" 
                className="gap-1.5 text-yellow-600"
                onClick={() => handleStatusChange(item.id, 'work', 'Paused')}
                disabled={isLoading}
              >
                <Clock className="h-4 w-4" /> Pause Work
              </Button>
            )}
            <Button 
              variant="outline" 
              className="gap-1.5 text-green-600"
              onClick={() => handleStatusChange(item.id, 'work', 'Completed')}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" /> Mark Complete
            </Button>
            <Button 
              variant="outline" 
              className="gap-1.5 text-red-600"
              onClick={() => handleStatusChange(item.id, 'work', 'Cancelled')}
              disabled={isLoading}
            >
              <X className="h-4 w-4" /> Cancel Work
            </Button>
          </div>
        );
      }
      return null;
      
    case 'contact':
      // Different options based on whether this is a received contact or one the user initiated
      const contactType = item.skill_id || item.skill_name ? 'skill_contact' : 'material_contact';
      
      // If this is a contact the user received (they are the provider/seller)
      if (isReceivedItem) {
        if (!['Agreement Reached', 'Declined', 'Completed'].includes(item.status)) {
          return (
            <div className="flex gap-2 flex-wrap">
              {item.status !== 'Responded' && (
                <Button 
                  variant="outline" 
                  className="gap-1.5 text-blue-600"
                  onClick={() => handleStatusChange(item.id, contactType, 'Responded')}
                  disabled={isLoading}
                >
                  <Clock className="h-4 w-4" /> Mark Responded
                </Button>
              )}
              
              {item.status !== 'In Discussion' && (
                <Button 
                  variant="outline" 
                  className="gap-1.5 text-blue-600"
                  onClick={() => handleStatusChange(item.id, contactType, 'In Discussion')}
                  disabled={isLoading}
                >
                  <Clock className="h-4 w-4" /> In Discussion
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="gap-1.5 text-green-600"
                onClick={handleCreateAgreement}
                disabled={isLoading}
              >
                <UserCheck className="h-4 w-4" /> Create Agreement
              </Button>
              
              <Button 
                variant="outline" 
                className="gap-1.5 text-red-600"
                onClick={() => handleStatusChange(item.id, contactType, 'Declined')}
                disabled={isLoading}
              >
                <X className="h-4 w-4" /> Decline
              </Button>
            </div>
          );
        } else if (item.status === 'Agreement Reached') {
          // If agreement reached but work not created yet
          return (
            <Button 
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCreateAgreement}
              disabled={isLoading}
            >
              <UserCheck className="h-4 w-4" /> Create Work Assignment
            </Button>
          );
        }
      } 
      // If this is a contact the user initiated
      else {
        if (item.status !== 'Withdrawn' && ['Contact Initiated', 'Responded', 'In Discussion'].includes(item.status)) {
          return (
            <Button 
              variant="outline" 
              className="gap-1.5 text-yellow-600"
              onClick={() => handleStatusChange(item.id, contactType, 'Withdrawn')}
              disabled={isLoading}
            >
              <AlertCircle className="h-4 w-4" /> Withdraw Interest
            </Button>
          );
        }
      }
      return null;

    default:
      return null;
  }
};
