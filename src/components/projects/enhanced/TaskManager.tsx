
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, CheckCircle, AlertCircle, User } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  estimatedHours: number;
  actualHours?: number;
  dueDate: string;
  createdBy: string;
  createdAt: string;
}

interface TaskManagerProps {
  projectId: number;
  userRole: 'provider' | 'client';
}

export function TaskManager({ projectId, userRole }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Setup project environment",
      description: "Initialize development environment and dependencies",
      status: 'completed',
      priority: 'high',
      assignee: 'John Provider',
      estimatedHours: 4,
      actualHours: 3.5,
      dueDate: '2024-06-20',
      createdBy: 'Client Name',
      createdAt: '2024-06-15'
    },
    {
      id: 2,
      title: "Design database schema",
      description: "Create comprehensive database design for the application",
      status: 'in_progress',
      priority: 'high',
      assignee: 'John Provider',
      estimatedHours: 8,
      actualHours: 5,
      dueDate: '2024-06-25',
      createdBy: 'Client Name',
      createdAt: '2024-06-16'
    },
    {
      id: 3,
      title: "Implement user authentication",
      description: "Build secure login and registration system",
      status: 'pending',
      priority: 'medium',
      assignee: 'John Provider',
      estimatedHours: 12,
      dueDate: '2024-07-01',
      createdBy: 'John Provider',
      createdAt: '2024-06-17'
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    estimatedHours: 1,
    dueDate: '',
    assignee: 'John Provider'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'review': return 'outline';
      case 'pending': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      createdBy: userRole === 'client' ? 'Client Name' : 'John Provider',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      estimatedHours: 1,
      dueDate: '',
      assignee: 'John Provider'
    });
    setShowAddTask(false);
  };

  const updateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const totalEstimated = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalActual = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Task Management</h3>
          <p className="text-sm text-muted-foreground">
            {completedTasks}/{tasks.length} tasks completed • {totalActual}h/{totalEstimated}h logged
          </p>
        </div>
        <Button onClick={() => setShowAddTask(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {showAddTask && (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Create New Task</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Task description"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
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
                <label className="text-sm font-medium">Estimated Hours</label>
                <Input
                  type="number"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Assignee</label>
                <Select value={newTask.assignee} onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Provider">John Provider</SelectItem>
                    <SelectItem value="Client Name">Client Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTask} size="sm">Create Task</Button>
              <Button onClick={() => setShowAddTask(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</Badge>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.actualHours || 0}h / {task.estimatedHours}h
                    </span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {task.status !== 'completed' && (
                    <>
                      {task.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        >
                          Start
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTaskStatus(task.id, 'review')}
                        >
                          Submit for Review
                        </Button>
                      )}
                      {task.status === 'review' && userRole === 'client' && (
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
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
    </div>
  );
}
