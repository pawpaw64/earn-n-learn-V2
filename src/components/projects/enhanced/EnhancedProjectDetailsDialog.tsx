
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
import { Calendar, DollarSign, User, Clock, Target, CheckSquare, MessageSquare, Upload, Timer } from "lucide-react";
import { Project } from "@/types/marketplace";
import { TaskManager } from "./TaskManager";
import { ResourceSharing } from "./ResourceSharing";
import { TimeTracking } from "./TimeTracking";
import { ProjectComments } from "./ProjectComments";

interface EnhancedProjectDetailsDialogProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdate?: () => void;
}

export function EnhancedProjectDetailsDialog({
  project,
  isOpen,
  onOpenChange,
  onProjectUpdate
}: EnhancedProjectDetailsDialogProps) {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'paused': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getProgressPercentage = () => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completedMilestones = project.milestones.filter(m => m.status === 'completed' || m.status === 'approved').length;
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

  const collaboratorName = project.provider_id === parseInt(localStorage.getItem('userId') || '0') 
    ? project.client_name 
    : project.provider_name;

  const userRole = project.provider_id === parseInt(localStorage.getItem('userId') || '0') ? 'provider' : 'client';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{project.title}</span>
            <Badge variant={getStatusColor(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Time
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <div className="flex-grow overflow-y-auto py-4">
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Project Info */}
              <div className="space-y-4">
                {project.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Collaborator: {collaboratorName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-600">
                      {formatAmount(project.total_amount, project.hourly_rate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Start: {formatDate(project.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Due: {formatDate(project.expected_end_date)}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span>{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>

              {/* Milestones */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Milestones
                  </h4>
                  <div className="space-y-3">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            Phase {milestone.phase_number}: {milestone.title}
                          </span>
                          <Badge variant={milestone.status === 'completed' ? 'default' : 'outline'}>
                            {milestone.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {milestone.description}
                          </p>
                        )}
                        {milestone.notes && (
                          <p className="text-sm text-blue-600 mb-2">
                            Notes: {milestone.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <TaskManager projectId={project.id} userRole={userRole} />
            </TabsContent>

            <TabsContent value="time" className="mt-0">
              <TimeTracking projectId={project.id} userRole={userRole} />
            </TabsContent>

            <TabsContent value="resources" className="mt-0">
              <ResourceSharing projectId={project.id} userRole={userRole} />
            </TabsContent>

            <TabsContent value="communication" className="mt-0">
              <ProjectComments projectId={project.id} userRole={userRole} />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          
          <div className="flex gap-2">
            {project.status === 'active' && (
              <>
                <Button variant="outline">
                  Pause Project
                </Button>
                <Button>
                  Complete Project
                </Button>
              </>
            )}
            {project.status === 'paused' && (
              <Button>
                Resume Project
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
