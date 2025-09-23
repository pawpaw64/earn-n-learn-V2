import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  AlertCircle,
  Calendar,
  Users,
  Target,
  Activity
} from "lucide-react";
import { TaskManager } from "@/components/projects/enhanced/TaskManager";

interface ProjectProgressSectionProps {
  projectId: number;
}

// Dummy project data
const generateDummyProject = (id: number) => ({
  id,
  title: "Website Redesign Project",
  description: "Complete redesign of company website with modern UI/UX",
  provider_id: 2,
  client_id: 1,
  source_type: 'job' as const,
  source_id: 1,
  project_type: 'fixed' as const,
  total_amount: 2500,
  current_phase: 2,
  status: 'active' as const,
  start_date: "2024-01-15",
  expected_end_date: "2024-03-15",
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-01-20T00:00:00Z",
  provider_name: "John Developer",
  client_name: "Tech Corp",
  milestones: [
    {
      id: 1,
      project_id: id,
      phase_number: 1,
      title: "Requirements Analysis",
      description: "Gather and analyze project requirements",
      status: 'completed' as const,
      due_date: "2024-01-25",
      completion_date: "2024-01-23",
      notes: "All requirements documented and approved"
    },
    {
      id: 2,
      project_id: id,
      phase_number: 2,
      title: "UI/UX Design",
      description: "Create wireframes and design mockups",
      status: 'in_progress' as const,
      due_date: "2024-02-10",
      completion_date: null,
      notes: "Working on responsive design layouts"
    },
    {
      id: 3,
      project_id: id,
      phase_number: 3,
      title: "Frontend Development",
      description: "Implement the designed interface",
      status: 'pending' as const,
      due_date: "2024-02-28",
      completion_date: null,
      notes: null
    },
    {
      id: 4,
      project_id: id,
      phase_number: 4,
      title: "Testing & Deployment",
      description: "Test the application and deploy to production",
      status: 'pending' as const,
      due_date: "2024-03-15",
      completion_date: null,
      notes: null
    }
  ]
});

export function ProjectProgressSection({ projectId }: ProjectProgressSectionProps) {
  const [showTasks, setShowTasks] = useState(false);
  
  // Use dummy data
  const project = generateDummyProject(projectId);
  
  const completedMilestones = project.milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-amber-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="border-t pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </Badge>
      </div>

      {/* Project Overview */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-900">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium">{project.provider_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium text-green-700">${project.total_amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600">Due:</span>
              <span className="font-medium">{new Date(project.expected_end_date!).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{completedMilestones}/{totalMilestones} milestones</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">{Math.round(progressPercentage)}% completed</p>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.milestones?.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    </div>
                    <Badge className={`${getStatusColor(milestone.status)} text-xs ml-2 flex-shrink-0`}>
                      {milestone.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Due: {new Date(milestone.due_date!).toLocaleDateString()}</span>
                    {milestone.completion_date && (
                      <span>Completed: {new Date(milestone.completion_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  {milestone.notes && (
                    <p className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded border">
                      {milestone.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Project Tasks</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTasks(!showTasks)}
            >
              <Activity className="w-4 h-4 mr-1" />
              {showTasks ? 'Hide Tasks' : 'Show Tasks'}
            </Button>
          </div>
        </CardHeader>
        {showTasks && (
          <CardContent>
            <TaskManager 
              project={project} 
              isProvider={true} // You can adjust this based on user role
              onTaskUpdate={() => {
                // Refresh project data if needed
                console.log('Task updated');
              }}
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
}