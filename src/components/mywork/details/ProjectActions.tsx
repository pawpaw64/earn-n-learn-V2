
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  MessageSquare, 
  UserPlus, 
  Share2, 
  BarChart3,
  Plus,
  Send,
  Upload,
  Link,
  Clock,
  AlertCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProjectTasks, 
  createProjectTask, 
  updateTaskStatus,
  assignTask 
} from "@/services/projectTasks";
import { toast } from "sonner";
import { ResourceSharing } from "@/components/projects/enhanced/ResourceSharing";

interface ProjectActionsProps {
  project: any;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  
  // Task creation state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
    assigned_to: ''
  });

  // Resource sharing state
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'link' as 'file' | 'link',
    url: '',
    description: ''
  });

  // Fetch project tasks with user role information
  const { data: tasksData } = useQuery({
    queryKey: ['projectTasks', project.id],
    queryFn: () => getProjectTasks(project.id),
    enabled: !!project.id
  });

  const tasks = tasksData?.tasks || [];
  const userRole = tasksData?.userRole || 'client';
  const currentUserId = tasksData?.currentUserId || 0;
  const isProvider = userRole === 'provider';

  console.log('ProjectActions - User role:', userRole, 'Is provider:', isProvider, 'Current user ID:', currentUserId);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: any) => createProjectTask(project.id, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', project.id] });
      toast.success('Task created successfully');
      setIsTaskDialogOpen(false);
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
    },
    onError: () => {
      toast.error('Failed to create task');
    }
  });

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) => 
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', project.id] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    }
  });

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    createTaskMutation.mutate(newTask);
  };

  const handleUpdateTaskStatus = (taskId: number, status: string) => {
    updateTaskMutation.mutate({ taskId, status });
  };

  const handleResourceShare = () => {
    if (!newResource.name.trim() || !newResource.url.trim()) {
      toast.error('Resource name and URL are required');
      return;
    }
    // Here you would call your resource sharing API
    toast.success('Resource shared successfully');
    setIsResourceDialogOpen(false);
    setNewResource({ name: '', type: 'link', url: '', description: '' });
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Actions</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 ">
          <TabsTrigger value="overview" className="px-2">
      <FileText className="w-4 h-4 mr-1" />
      Overview
    </TabsTrigger>
    <TabsTrigger value="progress" className="px-2">
      <BarChart3 className="w-4 h-4 mr-1" />
      Progress
    </TabsTrigger>
    <TabsTrigger value="tasks" className="px-2">
      <UserPlus className="w-4 h-4 mr-1" />
      Tasks
    </TabsTrigger>
    <TabsTrigger value="resources" className="px-2">
      <Share2 className="w-4 h-4 mr-1" />
      Resources
    </TabsTrigger>
          
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Project Type</label>
                  <p className="text-sm text-muted-foreground capitalize">{project.project_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Source</label>
                  <p className="text-sm text-muted-foreground capitalize">{project.source_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Phase</label>
                  <p className="text-sm text-muted-foreground">Phase {project.current_phase}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Your Role</label>
                  <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tasks Completed</span>
                  <span>{tasks.filter((t: any) => t.status === 'completed').length}/{tasks.length}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Progress</span>
                    <span>{tasks.length > 0 ? Math.round((tasks.filter((t: any) => t.status === 'completed').length / tasks.length) * 100) : 0}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Project Tasks</h4>
          {/* Show Add Task button if user is provider */}
            {isProvider && (
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Task title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Due Date</label>
                        <Input
                          type="date"
                          value={newTask.due_date}
                          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask}>
                        Create Task
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="space-y-2">
                <div className="text-4xl">📋</div>
                <p>No tasks yet</p>
                {isProvider && <p className="text-sm">Create tasks to organize your project work</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task: any) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
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
                            {task.status === 'pending' && !isProvider && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                              >
                                Start
                              </Button>
                            )}
                            {task.status === 'in_progress' && (
                              <Button 
                                size="sm"
                                onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <ResourceSharing 
            projectId={project.id} 
            userRole={userRole}
          />
        </TabsContent>

       
      </Tabs>
    </div>
  );
}
