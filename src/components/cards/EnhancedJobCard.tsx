import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, MapPin, Clock, Briefcase } from "lucide-react";
import { JobType } from "@/types/marketplace";
import { getJobDetails } from "@/services";

interface EnhancedJobCardProps {
  job: JobType;
  isApplied?: boolean;
  onApply: (jobId: number) => void;
  onViewDetails: (jobId: number) => void;
  onViewPoster?: (posterId: number) => void;
}

const EnhancedJobCard: React.FC<EnhancedJobCardProps> = ({
  job,
  isApplied = false,
  onApply,
  onViewDetails,
  onViewPoster,
}) => {
  const navigate = useNavigate();
  const formatPayment = (payment: string) => {
    if (payment.toLowerCase() === "free") return "Free";
    if (payment.toLowerCase() === "not specified") return "Not specified";
    if (/^\$?\d+(\/\w+)?$/.test(payment)) {
      return payment.replace('$', '') + (payment.includes('/') ? '' : 'tk/hr');
    }
    return payment;
  };
 

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Thumbnail placeholder - can be replaced with actual job image */}
      {/* <div className="h-32 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <Briefcase className="h-8 w-8 text-primary/40" />
      </div> */}
      
      <div className="p-4">
        {/* Title and Category */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
            {job.title}
          </h3>
          <Badge variant="secondary" className="text-xs shrink-0">
            {job.type}
          </Badge>
        </div>

        {/* Category Pills */}
        {job.category && (
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="outline" className="text-xs">
              {job.category}
            </Badge>
          </div>
        )}

        {/* Poster Info */}
        <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => onViewPoster?.(job.user_id || 0)}>
          <Avatar className="h-6 w-6">
            <AvatarImage src={job.posterAvatar} alt={job.poster} />
            <AvatarFallback className="text-xs">{job.poster?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {job.poster || 'Anonymous'}
          </span>
        </div>

        {/* Key Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-primary font-medium">{formatPayment(job.payment)}</span>
          </div>
          {job.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{job.location}</span>
            </div>
          )}
          {job.deadline && (
            <div className="text-xs text-muted-foreground">
              Deadline: {job.deadline}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/job/${job.id}`)}
            className="flex-1"
          >
            Details
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={() => onApply(job.id)}
            disabled={isApplied}
            className={`flex-1 ${
              isApplied
                ? "bg-muted text-muted-foreground hover:bg-muted"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isApplied ? "Applied" : "Apply"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobCard;