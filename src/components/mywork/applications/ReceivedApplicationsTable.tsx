
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye ,MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "../LoadingSkeleton";

interface ReceivedApplicationsTableProps {
  applications: any[];
  isLoading: boolean;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

/**
 * Table component for displaying applications received for user's jobs
 */
export const ReceivedApplicationsTable: React.FC<ReceivedApplicationsTableProps> = ({
  applications,
  isLoading,
  onViewDetails,
  onStatusChange
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleAcceptApplication = async (appId: number) => {
    try {
      await onStatusChange(appId, 'job_application', 'Accepted');
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handleRejectApplication = async (appId: number) => {
    try {
      await onStatusChange(appId, 'job_application', 'Rejected');
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No applications received for your jobs
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app: any) => (
            <TableRow key={app.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={app.applicant_avatar} />
                    <AvatarFallback>{app.applicant_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{app.applicant_name}</p>
                    <p className="text-xs text-muted-foreground">{app.applicant_email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium">{app.title}</p>
                <p className="text-xs text-muted-foreground">{app.type}</p>
              </TableCell>
              <TableCell>
                {new Date(app.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={
                  app.status === 'Accepted' ? 'secondary' : 
                  app.status === 'Rejected' ? 'destructive' : 
                  'outline'
                }>
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(app, 'application')}
                  >
                    <Eye className="w-4 h-4" />View Details
                  </Button>
                  <Button 
                        variant="outline" 
                        size="sm"
                        className="text-600"
                       // onClick={}
                      >
                        <MessageSquare className="w-4 h-4" /> Contact
                      </Button>
                  {app.status === 'Applied' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600"
                        onClick={() => handleAcceptApplication(app.id)}
                      >
                        <Check className="w-4 h-4"/> Accept
                        
                      </Button>
                      
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleRejectApplication(app.id)}
                      >
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </>
                    
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
