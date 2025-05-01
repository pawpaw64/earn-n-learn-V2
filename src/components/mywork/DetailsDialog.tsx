
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
  onStatusChange?: (id: number, type: string, status: string) => void;
  onCreateWork?: (id: number, type: string) => void;
  onEdit?: (item: any, type: string) => void;
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
  onCreateWork,
  onEdit
}: DetailsDialogProps) {
  // Get appropriate title for the dialog
  const dialogTitle = detailsItem?.title || 
                      detailsItem?.skill_name || 
                      detailsItem?.invoiceNumber || 
                      "Details";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DetailsHeader title={dialogTitle} />
        
        <div className="py-4 max-h-[70vh] overflow-y-auto">
          <DetailContent detailsItem={detailsItem} detailsType={detailsType} />
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
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
            onEdit={onEdit}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
