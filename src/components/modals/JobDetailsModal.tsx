
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobType } from "@/types/marketplace";

interface JobDetailsModalProps {
  job: JobType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (jobId: number) => void;
}

const JobDetailsModal = ({ job, isOpen, onOpenChange, onApply }: JobDetailsModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 my-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={job.posterAvatar} alt={job.poster} />
              <AvatarFallback>{job.poster?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Posted by: {job.poster}</h3>
              <p className="text-sm text-muted-foreground">{job.posterEmail || "No email provided"}</p>
            </div>
            <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-800 font-medium">
              {job.type}
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Payment</h3>
              <p className="text-emerald-600 font-medium">{job.payment}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Location</h3>
              <p>{job.location || "Remote"}</p>
            </div>
            {job.deadline && (
              <div>
                <h3 className="font-semibold mb-1">Deadline</h3>
                <p>{job.deadline}</p>
              </div>
            )}
            {job.requirements && (
              <div>
                <h3 className="font-semibold mb-1">Requirements</h3>
                <p>{job.requirements}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </DialogClose>
          <Button 
            onClick={() => onApply(job.id)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
