
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, MessageSquare, Calendar, DollarSign, User, Clock, Edit } from "lucide-react";
import { Project } from "@/types/marketplace";
import { Action } from "@radix-ui/react-toast";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onOpenChat?: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails, onOpenChat }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'paused':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
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

const formatAmount = (amount?: number | string, hourlyRate?: number | string) => {
  // Convert string amounts to numbers if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const numHourlyRate = typeof hourlyRate === 'string' ? parseFloat(hourlyRate) : hourlyRate;

  if (project.project_type === 'hourly' && numHourlyRate) {
    return `$${numHourlyRate.toFixed(2)}/hr`;
  }
  if (numAmount) {
    return `$${numAmount.toFixed(2)}`;
  }
  return 'Not specified';
}; 
  const collaboratorName = project.provider_id === parseInt(localStorage.getItem('userId') || '0') 
    ? project.client_name 
    : project.provider_name;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold line-clamp-1">{project.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{collaboratorName || 'Unknown'}</span>
            </div>
          </div>
          <Badge variant={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Start: {formatDate(project.start_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span className="font-medium text-emerald-600">
              {formatAmount(project.total_amount, project.hourly_rate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Due: {formatDate(project.expected_end_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Type:</span>
            <span className="capitalize">{project.project_type}</span>
          </div>
        </div>
{/* 
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div> */}

        {project.milestones && project.milestones.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Current Phase:</p>
            <p className="text-sm text-muted-foreground">
              {project.milestones.find(m => m.phase_number === project.current_phase)?.title || 'Phase not found'}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={() => onViewDetails(project)}
        >
          <Edit className="h-4 w-4" />
          <span>Actions</span>
        </Button>
        
      </CardFooter>
    </Card>
  );
}
