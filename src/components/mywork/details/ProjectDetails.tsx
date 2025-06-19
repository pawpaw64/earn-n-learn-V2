
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, User, Clock, Target } from "lucide-react";

interface ProjectDetailsProps {
  item: any;
}

export function ProjectDetails({ item }: ProjectDetailsProps) {
  if (!item) return null;

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
    if (!item.milestones || item.milestones.length === 0) return 0;
    const completedMilestones = item.milestones.filter((m: any) => m.status === 'completed' || m.status === 'approved').length;
    return (completedMilestones / item.milestones.length) * 100;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

 const formatAmount = (amount?: number | string, hourlyRate?: number | string) => {
    // Convert string numbers to numbers if needed
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const numHourlyRate = typeof hourlyRate === 'string' ? parseFloat(hourlyRate) : hourlyRate;

    if (item.project_type === 'hourly' && numHourlyRate) {
      return `$${numHourlyRate.toFixed(2)}/hr`;
    }
    if (numAmount) {
      return `$${numAmount.toFixed(2)}`;
    }
    return 'Not specified';
  };


  const collaboratorName = item.provider_id === parseInt(localStorage.getItem('userId') || '0') 
    ? item.client_name 
    : item.provider_name;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <Badge variant={getStatusColor(item.status)}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      </div>

      {item.description && (
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground">{item.description}</p>
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
            {formatAmount(item.total_amount, item.hourly_rate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Start: {formatDate(item.start_date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Due: {formatDate(item.expected_end_date)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Overall Progress</span>
          <span>{Math.round(getProgressPercentage())}% Complete</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      {item.milestones && item.milestones.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Milestones
          </h4>
          <div className="space-y-3">
            {item.milestones.map((milestone: any) => (
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
                  <p className="text-sm text-blue-600">
                    Notes: {milestone.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
