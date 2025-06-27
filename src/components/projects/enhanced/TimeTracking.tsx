
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, Calendar, DollarSign, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProjectTimeEntries, 
  createTimeEntry, 
  updateTimeEntry, 
  deleteTimeEntry,
  ProjectTimeEntry 
} from "@/services/projectTime";

interface TimeTrackingProps {
  projectId: number;
  userRole: 'provider' | 'client';
}

export function TimeTracking({ projectId, userRole }: TimeTrackingProps) {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    task_id: "",
    description: "",
    hours: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch time entries
  const { data: timeEntries = [], isLoading } = useQuery({
    queryKey: ['projectTimeEntries', projectId],
    queryFn: () => getProjectTimeEntries(projectId),
    enabled: !!projectId
  });

  // Create time entry mutation
  const createEntryMutation = useMutation({
    mutationFn: (entryData: any) => createTimeEntry(projectId, entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTimeEntries', projectId] });
      toast.success("Time entry created successfully");
      setNewEntry({ task_id: "", description: "", hours: 0, date: new Date().toISOString().split('T')[0] });
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to create time entry");
    }
  });

  // Update time entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: ({ entryId, data }: { entryId: number; data: any }) => updateTimeEntry(entryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTimeEntries', projectId] });
      toast.success("Time entry updated successfully");
    },
    onError: () => {
      toast.error("Failed to update time entry");
    }
  });

  // Delete time entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: deleteTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTimeEntries', projectId] });
      toast.success("Time entry deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete time entry");
    }
  });

  const handleCreateEntry = () => {
    if (!newEntry.description.trim() || newEntry.hours <= 0) {
      toast.error("Description and hours are required");
      return;
    }
    createEntryMutation.mutate(newEntry);
  };

  const handleUpdateEntryStatus = (entryId: number, status: string) => {
    updateEntryMutation.mutate({ entryId, data: { status } });
  };

  const handleDeleteEntry = (entryId: number) => {
    deleteEntryMutation.mutate(entryId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const approvedHours = timeEntries.filter(entry => entry.status === 'approved').reduce((sum, entry) => sum + entry.hours, 0);

  if (isLoading) {
    return <div className="p-4">Loading time entries...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Time Tracking</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Log Time
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Time Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Description of work done"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
              <Input
                type="number"
                step="0.5"
                placeholder="Hours worked"
                value={newEntry.hours}
                onChange={(e) => setNewEntry({ ...newEntry, hours: parseFloat(e.target.value) || 0 })}
              />
              <Input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateEntry} disabled={createEntryMutation.isPending}>
                  {createEntryMutation.isPending ? 'Logging...' : 'Log Time'}
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{totalHours}h</p>
            <p className="text-sm text-muted-foreground">Total Logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{approvedHours}h</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
            <p className="text-2xl font-bold">${(approvedHours * 50).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries List */}
      <div className="space-y-3">
        {timeEntries.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No time entries yet. Log your first entry to get started.</p>
            </CardContent>
          </Card>
        ) : (
          timeEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {entry.hours}h on {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{entry.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>By {entry.user_name}</span>
                      {entry.task_title && <span>Task: {entry.task_title}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {entry.status === 'pending' && userRole === 'client' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateEntryStatus(entry.id, 'approved')}
                          disabled={updateEntryMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateEntryStatus(entry.id, 'rejected')}
                          disabled={updateEntryMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={deleteEntryMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}