
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

interface DetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  detailsItem: any;
  detailsType: string;
  onStatusChange?: (id: number, type: string, status: string) => Promise<boolean>;
  onCreateWork?: (id: number, type: string) => Promise<boolean>;
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
  onCreateWork
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DetailsHeader title={getDialogTitle()} />
        
        <div className="py-4 flex-grow overflow-y-auto">
          <DetailContent detailsItem={detailsItem} detailsType={detailsType} />
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          
          <ActionButtons 
            type={detailsType} 
            item={detailsItem} 
            onStatusChange={onStatusChange}
            onCreateWork={onCreateWork}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
