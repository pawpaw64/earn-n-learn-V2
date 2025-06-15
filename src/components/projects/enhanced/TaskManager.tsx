
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

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: number;
  due_date?: string;
  created_at: string;
}

interface TaskManagerProps {
  project: Project;
  isProvider: boolean;
  onTaskUpdate?: () => void;
}

export function TaskManager({ project, isProvider, onTaskUpdate }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  const handleCreateTask = async () => {
    try {
      // API call would go here
      console.log('Creating task:', newTask);
      setIsCreateDialogOpen(false);
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: string) => {
    try {
      // API call would go here
      console.log('Updating task status:', taskId, status);
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      // API call would go here
      console.log('Deleting task:', taskId);
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
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
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        {isProvider && (
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
                    <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}>
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
            {isProvider && <p className="text-sm">Create tasks to organize your project work</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  {isProvider && (
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
                <div className="flex items-center justify-between">
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
                <div className="flex gap-2 mt-3">
                  {task.status !== 'completed' && (
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
    </div>
  );
}
