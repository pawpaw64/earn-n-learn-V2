
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, DollarSign, User, Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { Project, updateProjectStatus, updateMilestone } from "@/services/projects";
import { useToast } from "@/hooks/use-toast";

interface ProjectDetailsDialogProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdate?: () => void;
}

export function ProjectDetailsDialog({ 
  project, 
  isOpen, 
  onOpenChange, 
  onProjectUpdate 
}: ProjectDetailsDialogProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!project) return null;

  const getProgressPercentage = () => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completedMilestones = project.milestones.filter(m => 
      m.status === 'completed' || m.status === 'approved'
    ).length;
    return (completedMilestones / project.milestones.length) * 100;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount?: number, hourlyRate?: number) => {
    if (project.project_type === 'hourly' && hourlyRate) {
      return `$${hourlyRate}/hr`;
    }
    if (amount) {
      return `$${amount.toFixed(2)}`;
    }
    return 'Not specified';
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await updateProjectStatus(project.id, newStatus);
      toast({
        title: "Success",
        description: `Project status updated to ${newStatus}`
      });
      onProjectUpdate?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMilestoneUpdate = async (milestoneId: number, newStatus: string) => {
    try {
      setIsUpdating(true);
      await updateMilestone(milestoneId, newStatus);
      toast({
        title: "Success",
        description: "Milestone updated successfully"
      });
      onProjectUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const collaboratorName = project.provider_id === parseInt(localStorage.getItem('userId') || '0') 
    ? project.client_name 
    : project.provider_name;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl">{project.title}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Collaborating with {collaboratorName}</span>
              </div>
            </div>
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Start Date: {formatDate(project.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Due Date: {formatDate(project.expected_end_date)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600">
                      {formatAmount(project.total_amount, project.hourly_rate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm capitalize">{project.project_type}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(getProgressPercentage())}% Complete
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-3" />
              </div>

              {/* Description */}
              {project.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4 mt-6">
              {project.milestones && project.milestones.length > 0 ? (
                <div className="space-y-3">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getMilestoneIcon(milestone.status)}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{milestone.title}</h4>
                            {milestone.description && (
                              <p className="text-sm text-muted-foreground">{milestone.description}</p>
                            )}
                            {milestone.due_date && (
                              <p className="text-xs text-muted-foreground">
                                Due: {formatDate(milestone.due_date)}
                              </p>
                            )}
                          </div>
                          {milestone.status === 'in_progress' && (
                            <Button
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleMilestoneUpdate(milestone.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No milestones defined for this project.
                </p>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-6">
              <p className="text-center text-muted-foreground py-8">
                Activity feed coming soon...
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {project.status === 'active' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('paused')}
              >
                Pause Project
              </Button>
              <Button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('completed')}
              >
                Complete Project
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
