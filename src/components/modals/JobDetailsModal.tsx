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
import { ArrowLeft, Bookmark, Share2, MessageCircle, Star, Trophy, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { JobType } from "@/types/marketplace";

interface JobDetailsModalProps {
  job: JobType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (jobId: number) => void;
  onContact?: (jobId: number) => void;
  onSave?: (jobId: number) => void;
  onShare?: (jobId: number) => void;
  applicationStatus?: 'none' | 'applied' | 'accepted' | 'rejected';
  showApply?: boolean;
}

const JobDetailsModal = ({ 
  job, 
  isOpen, 
  onOpenChange, 
  onApply, 
  onContact,
  onSave,
  onShare,
  applicationStatus = 'none',
  showApply = true 
}: JobDetailsModalProps) => {
  if (!job) return null;

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

  const posterName = job.poster || localStorage.getItem('userName') || 'You';
  const posterEmail = job.posterEmail || localStorage.getItem('userEmail') || 'No email provided';
  
  const getApplicationButtonText = () => {
    switch (applicationStatus) {
      case 'applied': return 'Application Sent';
      case 'accepted': return 'Go to Project';
      case 'rejected': return 'Application Declined';
      default: return 'Apply Now';
    }
  };

  const getApplicationButtonClass = () => {
    switch (applicationStatus) {
      case 'applied': return 'bg-amber-500 hover:bg-amber-600 text-white cursor-not-allowed';
      case 'accepted': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'rejected': return 'bg-red-500 hover:bg-red-600 text-white cursor-not-allowed';
      default: return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {/* Hero Section */}
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold pr-4">{job.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-medium">
                  {job.type}
                </Badge>
                <span className="text-emerald-600 font-semibold text-lg">{job.payment}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              {onSave && (
                <Button variant="outline" size="sm" onClick={() => onSave(job.id)}>
                  <Bookmark className="w-4 h-4" />
                </Button>
              )}
              {onShare && (
                <Button variant="outline" size="sm" onClick={() => onShare(job.id)}>
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid gap-6 my-4">
          {/* Poster Details Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all">
                <AvatarImage src={job.posterAvatar} alt={posterName} />
                <AvatarFallback className="text-lg bg-emerald-100 text-emerald-800">
                  {posterName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg cursor-pointer hover:text-emerald-600 transition-colors">
                  {posterName}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{posterEmail}</p>
                
                {/* Poster stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">4.8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>1,250 points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>#15 on leaderboard</span>
                  </div>
                </div>
              </div>
              
              {onContact && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onContact(job.id)}
                  className="gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Button>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>
          
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Payment</h4>
                <p className="text-emerald-600 font-medium">{job.payment}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p>{job.location || "Remote"}</p>
              </div>
            </div>
            <div className="space-y-3">
              {job.deadline && (
                <div>
                  <h4 className="font-semibold mb-1">Deadline</h4>
                  <p>{job.deadline}</p>
                </div>
              )}
              {job.requirements && (
                <div>
                  <h4 className="font-semibold mb-1">Requirements</h4>
                  <p className="text-sm">{job.requirements}</p>
                </div>
              )}
            </div>
          </div>

          {/* Application Progress Section */}
          {applicationStatus !== 'none' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Application Status</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  {applicationStatus === 'applied' && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Application submitted - pending review</span>
                    </div>
                  )}
                  {applicationStatus === 'accepted' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Application accepted - project created</span>
                    </div>
                  )}
                  {applicationStatus === 'rejected' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Application was not accepted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <DialogFooter className="flex items-center justify-between sm:justify-between pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </DialogClose>
          {showApply && (
            <Button 
              onClick={() => onApply(job.id)} 
              className={getApplicationButtonClass()}
              disabled={applicationStatus === 'applied' || applicationStatus === 'rejected'}
            >
              {getApplicationButtonText()}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
