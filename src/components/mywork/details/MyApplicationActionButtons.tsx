
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MyApplicationActionButtonsProps {
  item: any;
  onStatusChange?: (id: number, type: string, status: string) => Promise<void>;
}

/**
 * Action buttons for user's own applications
 */
export function MyApplicationActionButtons({ item, onStatusChange }: MyApplicationActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!onStatusChange || !item) return;
    
    try {
      setIsLoading(true);
      await onStatusChange(item.id, 'job_application', 'Withdrawn');
    } catch (error) {
      console.error("Withdraw error:", error);
    } finally {
      setIsLoading(false);
    }
  };
 
  if (!item) return null;

  // Only show withdraw button if application is still pending
  if (item.status === 'Applied') {
    return (
      <Button 
        variant="destructive"
        disabled={isLoading}
        onClick={handleWithdraw}
      >
        <X className="mr-1 h-4 w-4" /> Withdraw Application
      </Button>
    );
  }
  
  return null;
}
