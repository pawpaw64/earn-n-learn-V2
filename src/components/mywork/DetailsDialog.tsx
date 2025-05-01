
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  detailsItem: any;
  detailsType: string;
  renderDetailsContent: () => React.ReactNode;
  renderActionButtons: () => React.ReactNode;
}

export function DetailsDialog({
  isOpen,
  onOpenChange,
  detailsItem,
  detailsType,
  renderDetailsContent,
  renderActionButtons
}: DetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {detailsItem?.title || detailsItem?.skill_name || detailsItem?.invoiceNumber || "Details"}
          </DialogTitle>
          <DialogDescription>
            View detailed information
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto">
          {renderDetailsContent()}
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          
          {renderActionButtons()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
