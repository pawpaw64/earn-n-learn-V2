
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
import { ArrowLeft, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobType } from "@/types/marketplace";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "@/services/auth";

interface JobDetailsModalProps {
  job: JobType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (jobId: number) => void;
}

const JobDetailsModal = ({ job, isOpen, onOpenChange, onApply }: JobDetailsModalProps) => {
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken(localStorage.getItem('token'));
  
  if (!job) return null;
  
  // Determine if the current user is the owner of this job
  const isOwnJob = job.user_id === currentUserId;

  // Store user info in localStorage when they view a job so it's available in the application modal
  React.useEffect(() => {
    if (isOpen) {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      
      if (!storedName || !storedEmail) {
        // If user info isn't already stored, try to get it from auth context or state
        // For now, we'll use placeholder values
        localStorage.setItem('userName', 'Current User');
        localStorage.setItem('userEmail', 'user@example.com');
      }
    }
  }, [isOpen]);

  // Function to view the job poster's profile
  const viewPosterProfile = () => {
    if (job.user_id) {
      onOpenChange(false); // Close modal first
      navigate(`/dashboard/profile/${job.user_id}`);
    }
  };

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
              {job.user_id && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-600" 
                  onClick={viewPosterProfile}
                >
                  <User className="h-3 w-3 mr-1" />
                  View Profile
                </Button>
              )}
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
          {!isOwnJob && (
            <Button 
              onClick={() => onApply(job.id)} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Apply Now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
