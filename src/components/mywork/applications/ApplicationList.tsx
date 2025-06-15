
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
import { Eye, MessageSquare, UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { useNavigate } from "react-router-dom";

interface ApplicantsListProps {
  applications: any[];
  isLoading: boolean;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
  jobTitle?: string;
}

export const ApplicantsList: React.FC<ApplicantsListProps> = ({
  applications,
  isLoading,
  onViewDetails,
  onStatusChange,
  jobTitle
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleViewProfile = (userId: number) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  const handleMessage = (userId: number) => {
    // This will be implemented through the messaging system
    navigate(`/dashboard/messages?userId=${userId}`);
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No applications received for {jobTitle ? `"${jobTitle}"` : "this job"}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(app, 'application')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(app.user_id)}
                  >
                    <UserRound className="w-4 h-4 mr-1" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMessage(app.user_id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
