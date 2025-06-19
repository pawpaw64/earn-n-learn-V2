import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DetailsHeader } from "./details/DetailsHeader";
import { DetailContent } from "./details/DetailContent";
import { ActionButtons } from "./details/ActionButtons";
import { ProjectActions } from "./details/ProjectActions";
import { updateProjectStatus } from "@/services/projects";
import { toast } from "sonner";

interface DetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  detailsItem: any;
  detailsType: string;
  onStatusChange?: (id: number, type: string, status: string) => Promise<void>;
}

/**
 * Main details dialog component that displays information about various items
 * Uses smaller components for different sections and item types
 */
export function DetailsDialog({
  isOpen,
  onOpenChange,
  detailsItem,
  detailsType,
  onStatusChange,
}: DetailsDialogProps) {
  // Get appropriate title for the dialog
  const getDialogTitle = () => {
    if (!detailsItem) return "Details";
    
    if (detailsType === 'contact') {
      return detailsItem.skill_name 
        ? `Skill Inquiry: ${detailsItem.skill_name}`
        : `Material Inquiry: ${detailsItem.title}`;
    }
    
    return detailsItem?.title || 
           detailsItem?.skill_name || 
           detailsItem?.invoiceNumber || 
           "Details";
  };

  const handleProjectStatusUpdate = async (newStatus: string) => {
    if (!detailsItem?.id) return;
    
    try {
      await updateProjectStatus(detailsItem.id, newStatus);
      toast.success(`Project status updated to ${newStatus}`);
      onOpenChange(false);
      // Refresh the page or trigger a refetch
      window.location.reload();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DetailsHeader title={getDialogTitle()} />
        
        <div className="py-4 flex-grow overflow-y-auto">
          <DetailContent detailsItem={detailsItem} detailsType={detailsType} />
          
          {/* Add Project Actions for project type */}
          {detailsType === 'project' && (
            <div className="mt-6 border-t pt-4">
              <ProjectActions project={detailsItem} />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          
          {/* Project specific actions */}
          {detailsType === 'project' && detailsItem && (
            <div className="flex gap-2">
              {detailsItem.status === 'active' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleProjectStatusUpdate('paused')}
                  >
                    Pause
                  </Button>
                  <Button
                    onClick={() => handleProjectStatusUpdate('completed')}
                  >
                    Complete
                  </Button>
                </>
              )}
              {detailsItem.status === 'paused' && (
                <Button
                  onClick={() => handleProjectStatusUpdate('active')}
                >
                  Resume
                </Button>
              )}
            </div>
          )}
          
          {/* Other action buttons for non-project types */}
          {detailsType !== 'project' && (
            <ActionButtons 
              type={detailsType} 
              item={detailsItem} 
              onStatusChange={onStatusChange}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
