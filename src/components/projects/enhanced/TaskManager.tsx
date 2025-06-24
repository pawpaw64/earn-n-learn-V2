
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Project } from "@/types/marketplace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProjectTasks, 
  createProjectTask, 
  updateProjectTask,
  updateTaskStatus,
  deleteProjectTask,
  assignTask 
} from "@/services/projectTasks";
import { toast } from "sonner";

interface TaskManagerProps {
  project: Project;
  isProvider: boolean;
  onTaskUpdate?: () => void;
}

export function TaskManager({ project, isProvider, onTaskUpdate }: TaskManagerProps) {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  // Fetch project tasks with user role information
  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['projectTasks', project.id],
    queryFn: () => getProjectTasks(project.id),
    enabled: !!project.id
  });

  const tasks = tasksData?.tasks || [];
  const userRole = tasksData?.userRole || 'client';
  const actualIsProvider = userRole === 'provider';

  console.log('TaskManager - User role:', userRole, 'Is provider (from prop):', isProvider, 'Actual is provider:', actualIsProvider);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: any) => createProjectTask(project.id, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', project.id] });
      toast.success('Task created successfully');
      setIsCreateDialogOpen(false);
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
      onTaskUpdate?.();
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }: { taskId: number; taskData: any }) => 
      updateProjectTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', project.id] });
      toast.success('Task updated successfully');
      setEditingTask(null);
      onTaskUpdate?.();
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  });

  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status, notes }: { taskId: number; status: string; notes?: string }) => 
      updateTaskStatus(taskId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', project.id] });
      toast.success('Task status updated');
      onTaskUpdate?.();
    },
    onError: (error) => {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => deleteProjectTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', project.id] });
      toast.success('Task deleted successfully');
      onTaskUpdate?.();
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  });

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    createTaskMutation.mutate(newTask);
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;
    updateTaskMutation.mutate({ taskId: editingTask.id, taskData });
  };

  const handleUpdateTaskStatus = async (taskId: number, status: string) => {
    updateTaskStatusMutation.mutate({ taskId, status });
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        {/* Show Add Task button if user is provider based on backend response */}
        {actualIsProvider && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                        <SelectItem value="urgent">Urgent</SelectItem>
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
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
            {actualIsProvider && <p className="text-sm">Create tasks to organize your project work</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: any) => (
            <Card key={task.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                  </div>
                  {actualIsProvider && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditingTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(task.status)} className="flex items-center gap-1">
                      {getStatusIcon(task.status)}
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.due_date && (
                    <span className="text-sm text-muted-foreground">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {task.creator_name && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Created by: {task.creator_name}
                  </p>
                )}
                
                <div className="flex gap-2">
                  {task.status !== 'completed' && task.status !== 'verified' && (
                    <>
                      {task.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}>
                          Start
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button size="sm" onClick={() => handleUpdateTaskStatus(task.id, 'completed')}>
                          Complete
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Task Dialog - Only show if user is provider */}
      {editingTask && actualIsProvider && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={editingTask.priority} onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={editingTask.due_date || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingTask(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateTask(editingTask)}>
                  Update Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
