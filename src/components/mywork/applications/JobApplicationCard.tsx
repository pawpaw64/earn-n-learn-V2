
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X, Calendar, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobApplicationCardProps {
  app: any;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

/**
 * Enhanced card component for displaying job applications
 * Styled similarly to the explore cards for consistency
 */
export const JobApplicationCard: React.FC<JobApplicationCardProps> = ({ app, onViewDetails, onStatusChange }) => {
  // Format the date for better readability
  const formattedDate = app.created_at ? formatDistanceToNow(new Date(app.created_at), { addSuffix: true }) : 'Unknown date';
  
  // Determine the status badge variant
  const getBadgeVariant = (status: string) => {
    switch(status) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800';
      case 'Reviewing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{app.title}</h3>
            <p className="text-sm text-muted-foreground">{app.poster_name || 'Unknown poster'}</p>
          </div>
          <Badge className={getBadgeVariant(app.status)}>
            {app.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow py-4">
        {/* Cover letter preview */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {app.cover_letter?.substring(0, 150)}...
          </p>
        </div>
        
        {/* Information Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {/* Job Type */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs py-0 h-5">
              {app.type || 'Unspecified '}
            </Badge>
          </div>
          
          {/* Payment */}
          <div className=" flex items-center gap-1.5 text-sm text-emerald-600 font-bold font-weight-500 ">
            <span className="text-sm text-muted-foreground">Payment:</span>
            {app.payment || 'Payment not specified'}-tk/hr
          </div>
          
          {/* Location if available */}
          {app.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground col-span-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{app.location}</span>
            </div>
          )}
          
          {/* Date applied */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground col-span-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Applied: {formattedDate}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex justify-between border-t bg-gray-50">
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1.5"
          onClick={() => onViewDetails(app, 'application')}
        >
          <Eye className="w-3.5 h-3.5" /> View Details
        </Button>
        
        {app.status === 'Applied' && (
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1.5 text-black-600  hover:bg-emerald-600 hover:text-white"
            onClick={() => onStatusChange(app.id, 'job_application', 'Withdrawn')}
          >
            <X className="w-3.5 h-3.5" /> Withdraw
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
