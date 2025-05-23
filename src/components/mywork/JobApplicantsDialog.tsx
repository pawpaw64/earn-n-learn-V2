
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicantsList } from "./applications/ApplicantsList";
import { getJobApplicants } from "@/services/applications";

interface JobApplicantsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number | null;
  jobTitle: string;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

export function JobApplicantsDialog({
  isOpen,
  onOpenChange,
  jobId,
  jobTitle,
  onViewDetails,
  onStatusChange,
}: JobApplicantsDialogProps) {
  // Fetch applicants for the specific job
  const { 
    data: applicants = [], 
    isLoading 
  } = useQuery({
    queryKey: ['jobApplicants', jobId],
    queryFn: () => jobId ? getJobApplicants(jobId) : Promise.resolve([]),
    enabled: isOpen && jobId !== null,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Applicants for: {jobTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 flex-grow overflow-y-auto">
          <ApplicantsList 
            applications={applicants}
            isLoading={isLoading}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
            jobTitle={jobTitle}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
