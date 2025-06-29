import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, User, Clock, Target } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectTasks, updateTaskStatus } from "@/services/projectTasks";
import { toast } from "sonner";
import { parse } from "path";
import { getCurrentUserId } from "@/services/auth";

interface ProjectDetailsProps {
  item: any;
}

export function ProjectDetails({ item }: ProjectDetailsProps) {
  const queryClient = useQueryClient();
  
  // Fetch project tasks with user role information
  const { data: tasksData } = useQuery({
    queryKey: ['projectTasks', item.id],
    queryFn: () => getProjectTasks(item.id),
    enabled: !!item.id
  });

  const tasks = tasksData?.tasks || [];
  const userRole = tasksData?.userRole || 'client';
  const currentUserId = getCurrentUserId();
  const isProvider = userRole === 'provider';

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) => 
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', item.id] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    }
  });

  const handleUpdateTaskStatus = (taskId: number, status: string) => {
    updateTaskMutation.mutate({ taskId, status });
  };

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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'in_progress': return 'default';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount?: number | string, hourlyRate?: number | string) => {
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

  // Calculate progress based on both milestones and tasks
  const getMilestoneProgressPercentage = () => {
    if (!item.milestones || item.milestones.length === 0) return 0;
    const completedMilestones = item.milestones.filter((m: any) => m.status === 'completed' || m.status === 'approved').length;
    return (completedMilestones / item.milestones.length) * 100;
  };

  const getTaskProgressPercentage = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    return (completedTasks / tasks.length) * 100;
  };

  const getOverallProgress = () => {
    if (item.milestones && item.milestones.length > 0 && tasks.length > 0) {
      return (getMilestoneProgressPercentage() + getTaskProgressPercentage()) / 2;
    } else if (item.milestones && item.milestones.length > 0) {
      return getMilestoneProgressPercentage();
    } else if (tasks.length > 0) {
      return getTaskProgressPercentage();
    }
    return 0;
  };
  
 
  // Fix the collaborator name logic
  const collaboratorName = item.client_id === currentUserId 
    ? item.provider_name 
    : item.client_name;

  console.log('ProjectDetails - Current User ID:', currentUserId);
  console.log('ProjectDetails - Project client_id:', item.client_id);
  console.log('ProjectDetails - Project provider_id:', item.provider_id);
  console.log('ProjectDetails - Collaborator name:', collaboratorName);


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

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Overall Progress</span>
            <span>{Math.round(getOverallProgress())}% Complete</span>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
        </div>

        {item.milestones && item.milestones.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Milestone Progress</span>
              <span>{Math.round(getMilestoneProgressPercentage())}% Complete</span>
            </div>
            <Progress value={getMilestoneProgressPercentage()} className="h-2" />
          </div>
        )}

        {/* {tasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Task Progress</span>
              <span>{Math.round(getTaskProgressPercentage())}% Complete</span>
            </div>
            <Progress value={getTaskProgressPercentage()} className="h-2" />
          </div>
        )} */}
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

      {/* {tasks.length > 0 && (
        // <div className="space-y-4">
        //   <h4 className="font-medium flex items-center gap-2">
        //     <Target className="h-4 w-4" />
        //     Tasks
        //   </h4> */}
          {/* <div className="space-y-3">
            {tasks.map((task: any) => (
              <div key={task.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium">{task.title}</h5>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getTaskStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getTaskPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {task.status !== 'completed' && (
                      <>
                        {task.status === 'pending' && (
                          <button 
                            className="text-xs px-2 py-1 border rounded"
                            onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                          >
                            Start
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button 
                            className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded"
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        {/* </div> */}
      
    </div>
  );
}