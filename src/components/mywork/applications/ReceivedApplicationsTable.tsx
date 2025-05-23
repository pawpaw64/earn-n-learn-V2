
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
import { Check, X, Eye, MessageSquare, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { useNavigate } from "react-router-dom";

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
  onStatusChange,
  
}) => {
  const navigate = useNavigate();

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

  const handleContactUser = (userId: number) => {
    navigate(`/dashboard/messages?userId=${userId}`);
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  // Group applications by job
  const jobGroups = applications.reduce((groups: any, app: any) => {
    if (!groups[app.job_id]) {
      groups[app.job_id] = {
        jobId: app.job_id,
        title: app.title,
        applications: []
      };
    }
    groups[app.job_id].applications.push(app);
    return groups;
  }, {});

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No applications received for your jobs
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.values(jobGroups).map((group: any) => (
        <div key={group.jobId} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{group.title}</h3>
            {group.applications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(group.applications[0], 'job')}
              >
                <Eye className="w-4 h-4" />Job details
              </Button>)}
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.applications.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleViewProfile(app.user_id)}>
                          <AvatarImage src={app.applicant_avatar} />
                          <AvatarFallback>{app.applicant_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium cursor-pointer hover:underline" onClick={() => handleViewProfile(app.user_id)}>
                            {app.applicant_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{app.applicant_email}</p>
                        </div>
                      </div>
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
                          onClick={() => handleContactUser(app.user_id)}
                        >
                          <MessageSquare className="w-4 h-4" />Contact
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
        </div>
      ))}
    </div>
  );
}
