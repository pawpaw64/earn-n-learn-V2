import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { EscrowDialog } from "../dialogs/EscrowDialog";
import { toast } from "sonner";
import { updateEscrowStatus } from "@/services/applications";
import { Eye, MessageSquare, Check, X, DollarSign } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ReceivedApplicationsTableProps {
  applications: any[];
  isLoading: boolean;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (
    id: number,
    type: string,
    status: string
  ) => Promise<{ success: boolean; projectId?: number }>;
}

/**
 * Table component for displaying applications received for user's jobs
 */
export const ReceivedApplicationsTable: React.FC<
  ReceivedApplicationsTableProps
> = ({ applications, isLoading, onViewDetails, onStatusChange }) => {
  const navigate = useNavigate();
  const [showEscrowDialog, setShowEscrowDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [escrowCreated, setEscrowCreated] = useState<Record<number, boolean>>(
    {}
  );
  const [projectCompleted, setProjectCompleted] = useState<
    Record<number, boolean>
  >({});
  const [projectIds, setProjectIds] = useState<Record<number, number>>({});

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleAcceptApplication = async (appId: number, app: any) => {
    try {
      setProcessingId(appId);
      const result = await onStatusChange(
        appId,
        "job_application",
        "Accepted"
      );
      
      if (result?.success && result?.projectId) {
        toast.success(`Application accepted and project #${result.projectId} created!`);
        setProjectIds(prev => ({
          ...prev,
          [appId]: result.projectId as number
        }));
      }
    } catch (error) {
      console.error("Error accepting application:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectApplication = async (appId: number) => {
    try {
      setProcessingId(appId);
      console.log(`[ReceivedApplicationsTable] Rejecting application ${appId}`);
      await onStatusChange(appId, "job_application", "Rejected");
    } catch (error) {
      console.error("Error rejecting application:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleContactUser = (userId: number) => {
    navigate(`/dashboard/messages?userId=${userId}`);
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  const handleSetupEscrow = (app: any) => {
    setSelectedApplication(app);
    setShowEscrowDialog(true);
  };

  const handleEscrowCreated = async (applicationId: number) => {
    try {
      await updateEscrowStatus(applicationId, "created");
      toast.success("Escrow successfully set up!");
    } catch (error) {
      console.error("Error updating escrow status:", error);
      toast.error("Failed to update escrow status");
    }
  };

  const handleGoToProject = (projectId: number) => {
    navigate(`/dashboard/mywork/projects/${projectId}`);
  };

  // Group applications by job
  const jobGroups = applications.reduce((groups: any, app: any) => {
    if (!groups[app.job_id]) {
      groups[app.job_id] = {
        jobId: app.job_id,
        title: app.title,
        applications: [],
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
    <>
      <div className="space-y-6">
        {Object.values(jobGroups).map((group: any) => (
          <div key={group.jobId} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{group.title}</h3>
              {group.applications.length > 0 && (
                <Button
                  className="bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-black"
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(group.applications[0], "job")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Job details
                </Button>
              )}
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
                          <Avatar
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => handleViewProfile(app.user_id)}
                          >
                            <AvatarImage src={app.applicant_avatar} />
                            <AvatarFallback>
                              {app.applicant_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p
                              className="font-medium cursor-pointer hover:underline"
                              onClick={() => handleViewProfile(app.user_id)}
                            >
                              {app.applicant_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {app.applicant_email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            app.status === "Accepted"
                              ? "secondary"
                              : app.status === "Rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            className="bg-white border border-black text-gray-700 hover:bg-gray-100 hover:text-black px-3 py-1 text-sm rounded-md flex items-center gap-1"
                            size="sm"
                            onClick={() => onViewDetails(app, "application")}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactUser(app.user_id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contact
                          </Button>

                          {app.status === "Pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white border border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                                onClick={() => handleAcceptApplication(app.id, app)}
                                disabled={processingId === app.id}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                {processingId === app.id
                                  ? "Processing..."
                                  : "Accept"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                                onClick={() => handleRejectApplication(app.id)}
                                disabled={processingId === app.id}
                              >
                                <X className="w-4 h-4 mr-1" />
                                {processingId === app.id
                                  ? "Processing..."
                                  : "Reject"}
                              </Button>
                            </>
                          )}
                          {app.status === "Accepted" &&
                            app.escrow_status === "pending" && 
                            (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetupEscrow(app)}
                              >
                                <DollarSign className="w-4 h-4 mr-1" /> Set Up
                                Escrow
                              </Button>
                            )}

                          {app.status === "Accepted" &&
                            app.escrow_status === "created" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleGoToProject(
                                    projectIds[app.id] || app.project_id
                                  )
                                }
                              >
                                <Check className="w-4 h-4 mr-1" /> Go to Project
                              </Button>
                            )}

                          {projectCompleted[app.id] && (
                            <Button variant="outline" size="sm" disabled>
                              Project Completed
                            </Button>
                          )}
                          {app.status === "Accepted" &&
                            app.escrow_status === "completed" && (
                              <Button disabled>Project Completed</Button>
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

      <EscrowDialog
        isOpen={showEscrowDialog}
        onOpenChange={setShowEscrowDialog}
        application={selectedApplication}
        onEscrowCreated={() =>
          selectedApplication && handleEscrowCreated(selectedApplication.id)
        }
      />
    </>
  );
};