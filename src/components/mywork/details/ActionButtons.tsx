import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, PlayCircle, DollarSign } from "lucide-react";
import { EscrowDialog } from "../dialogs/EscrowDialog";
import { MyApplicationActionButtons } from "./MyApplicationActionButtons";

interface ActionButtonsProps {
  type: string;
  item: any;
  onStatusChange?: (id: number, type: string, status: string) => Promise<boolean>;
  onCreateWork?: (id: number, type: string) => Promise<boolean>;
}

/**
 * Renders appropriate action buttons based on item type and status
 */
export function ActionButtons({ type, item, onStatusChange, onCreateWork }: ActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEscrowDialog, setShowEscrowDialog] = useState(false);
  const [acceptedApplication, setAcceptedApplication] = useState<any>(null);

  const handleStatusChange = async (id: number, itemType: string, newStatus: string) => {
    if (!onStatusChange) return;
    
    try {
      setIsLoading(true);
      const success = await onStatusChange(id, itemType, newStatus);
      
      // If successfully accepted, show escrow dialog
      if (success && newStatus === 'Accepted' && type === 'application') {
        setAcceptedApplication(item);
        setShowEscrowDialog(true);
      }
    } catch (error) {
      console.error("Status change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWork = async (id: number, itemType: string) => {
    if (!onCreateWork) return;
    
    try {
      setIsLoading(true);
      await onCreateWork(id, itemType);
    } catch (error) {
      console.error("Create work error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscrowCreated = () => {
    setAcceptedApplication(null);
    // Optionally trigger a refresh of the applications list
  };

  if (!item) return null;

  // User's own application actions
  if (type === 'my_application') {
    return (
      <MyApplicationActionButtons 
        item={item} 
        onStatusChange={onStatusChange}
      />
    );
  }

  // Received application actions
  if (type === 'application') {
    if (item.status === 'Applied' && item.poster_email === localStorage.getItem('userEmail')) {
      return (
        <>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              disabled={isLoading}
              onClick={() => handleStatusChange(item.id, 'job_application', 'Accepted')}
            >
              <Check className="mr-1 h-4 w-4" /> Accept
            </Button>
            <Button 
              variant="destructive" 
              disabled={isLoading}
              onClick={() => handleStatusChange(item.id, 'job_application', 'Rejected')}
            >
              <X className="mr-1 h-4 w-4" /> Reject
            </Button>
          </div>
          
          <EscrowDialog
            isOpen={showEscrowDialog}
            onOpenChange={setShowEscrowDialog}
            application={acceptedApplication}
            onEscrowCreated={handleEscrowCreated}
          />
        </>
      );
    }
    
    if (item.status === 'Accepted' && item.poster_email === localStorage.getItem('userEmail')) {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setAcceptedApplication(item);
              setShowEscrowDialog(true);
            }}
          >
            <DollarSign className="mr-1 h-4 w-4" /> Set Up Escrow
          </Button>
          <Button 
            variant="default" 
            disabled={isLoading}
            onClick={() => handleCreateWork(item.id, 'job_application')}
          >
            <PlayCircle className="mr-1 h-4 w-4" /> Create Work
          </Button>
        </div>
      );
    }
  }
  
  // Contact actions (skill or material)
  if (type === 'contact') {
    // For the provider of the skill/material
    if ((item.provider_email === localStorage.getItem('userEmail') || 
        item.seller_email === localStorage.getItem('userEmail')) && 
        item.status === 'Pending') {
      return (
        <>
          <div className="flex gap-2">
            <Button 
              variant="default"
              disabled={isLoading}
              onClick={() => {
                const contactType = item.skill_id ? 'skill_contact' : 'material_contact';
                handleStatusChange(item.id, contactType, 'Accepted');
              }}
            >
              <Check className="mr-1 h-4 w-4" /> Accept
            </Button>
            <Button 
              variant="destructive"
              disabled={isLoading}
              onClick={() => {
                const contactType = item.skill_id ? 'skill_contact' : 'material_contact';
                handleStatusChange(item.id, contactType, 'Rejected');
              }}
            >
              <X className="mr-1 h-4 w-4" /> Reject
            </Button>
          </div>
          
          <EscrowDialog
            isOpen={showEscrowDialog}
            onOpenChange={setShowEscrowDialog}
            application={acceptedApplication}
            onEscrowCreated={handleEscrowCreated}
          />
        </>
      );
    }
    
    // For approved contacts, show create work button to provider
    if ((item.provider_email === localStorage.getItem('userEmail') || 
        item.seller_email === localStorage.getItem('userEmail')) && 
        item.status === 'Accepted') {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setAcceptedApplication(item);
              setShowEscrowDialog(true);
            }}
          >
            <DollarSign className="mr-1 h-4 w-4" /> Set Up Escrow
          </Button>
          <Button 
            variant="default"
            disabled={isLoading}
            onClick={() => {
              const contactType = item.skill_id ? 'skill_contact' : 'material_contact';
              handleCreateWork(item.id, contactType);
            }}
          >
            <PlayCircle className="mr-1 h-4 w-4" /> Create Work
          </Button>
        </div>
      );
    }
  }
  
  // Work actions
  if (type === 'work') {
    return (
      <div className="flex gap-2">
        <Button 
          variant={item.status === 'Completed' ? 'secondary' : 'default'}
          disabled={isLoading || item.status === 'Completed'}
          onClick={() => handleStatusChange(item.id, 'work', 'Completed')}
        >
          <Check className="mr-1 h-4 w-4" /> Mark as Complete
        </Button>
      </div>
    );
  }
  
  return null;
}
