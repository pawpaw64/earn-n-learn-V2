
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Clock, Calendar } from "lucide-react";

interface TimeEntry {
  id: number;
  taskId?: number;
  taskName: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  date: string;
  user: string;
  billable: boolean;
}

interface TimeTrackingProps {
  projectId: number;
  userRole: 'provider' | 'client';
}

export function TimeTracking({ projectId, userRole }: TimeTrackingProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: 1,
      taskId: 1,
      taskName: "Setup project environment",
      description: "Installing dependencies and configuring development environment",
      startTime: "09:00",
      endTime: "12:30",
      duration: 210,
      date: "2024-06-18",
      user: "John Provider",
      billable: true
    },
    {
      id: 2,
      taskId: 2,
      taskName: "Database design",
      description: "Creating database schema and relationships",
      startTime: "14:00",
      endTime: "17:30",
      duration: 210,
      date: "2024-06-18",
      user: "John Provider",
      billable: true
    },
    {
      id: 3,
      taskId: 2,
      taskName: "Database design",
      description: "Implementing database models and connections",
      startTime: "09:00",
      endTime: "11:30",
      duration: 150,
      date: "2024-06-19",
      user: "John Provider",
      billable: true
    }
  ]);

  const [activeTimer, setActiveTimer] = useState<{
    taskName: string;
    startTime: Date;
    description: string;
  } | null>(null);

  const [newEntry, setNewEntry] = useState({
    taskName: '',
    description: '',
    startTime: '',
    endTime: '',
    date: new Date().toISOString().split('T')[0],
    billable: true
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const startTimer = () => {
    setActiveTimer({
      taskName: 'Current Task',
      startTime: new Date(),
      description: ''
    });
  };

  const stopTimer = () => {
    if (activeTimer) {
      const duration = Math.round((new Date().getTime() - activeTimer.startTime.getTime()) / (1000 * 60));
      const entry: TimeEntry = {
        id: Date.now(),
        taskName: activeTimer.taskName,
        description: activeTimer.description,
        startTime: activeTimer.startTime.toTimeString().slice(0, 5),
        endTime: new Date().toTimeString().slice(0, 5),
        duration,
        date: new Date().toISOString().split('T')[0],
        user: 'John Provider',
        billable: true
      };
      setTimeEntries([...timeEntries, entry]);
      setActiveTimer(null);
    }
  };

  const addManualEntry = () => {
    const start = new Date(`${newEntry.date}T${newEntry.startTime}`);
    const end = new Date(`${newEntry.date}T${newEntry.endTime}`);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    const entry: TimeEntry = {
      id: Date.now(),
      taskName: newEntry.taskName,
      description: newEntry.description,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration,
      date: newEntry.date,
      user: 'John Provider',
      billable: newEntry.billable
    };

    setTimeEntries([...timeEntries, entry]);
    setNewEntry({
      taskName: '',
      description: '',
      startTime: '',
      endTime: '',
      date: new Date().toISOString().split('T')[0],
      billable: true
    });
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const billableHours = timeEntries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.duration, 0);
  const todayEntries = timeEntries.filter(entry => entry.date === new Date().toISOString().split('T')[0]);
  const todayHours = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Time Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Total: {formatDuration(totalHours)} • Billable: {formatDuration(billableHours)} • Today: {formatDuration(todayHours)}
          </p>
        </div>
      </div>

      {/* Active Timer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">
                  {activeTimer ? 'Timer Running' : 'No Active Timer'}
                </span>
              </div>
              {activeTimer && (
                <div className="text-sm text-muted-foreground">
                  Started at {activeTimer.startTime.toTimeString().slice(0, 5)}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!activeTimer ? (
                <Button onClick={startTimer} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <>
                  <Button onClick={stopTimer} size="sm">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <h4 className="font-medium">Add Manual Entry</h4>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Task</label>
              <Input
                value={newEntry.taskName}
                onChange={(e) => setNewEntry({...newEntry, taskName: e.target.value})}
                placeholder="Task name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={newEntry.description}
              onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
              placeholder="What did you work on?"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={newEntry.startTime}
                onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={newEntry.endTime}
                onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newEntry.billable}
                  onChange={(e) => setNewEntry({...newEntry, billable: e.target.checked})}
                />
                <span className="text-sm">Billable</span>
              </label>
            </div>
          </div>
          <Button onClick={addManualEntry} size="sm" disabled={!newEntry.taskName || !newEntry.startTime || !newEntry.endTime}>
            Add Entry
          </Button>
        </CardContent>
      </Card>

      {/* Time Entries */}
      <div className="space-y-3">
        <h4 className="font-medium">Recent Entries</h4>
        {timeEntries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium">{entry.taskName}</h5>
                    {entry.billable && <Badge variant="default">Billable</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {entry.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.startTime} - {entry.endTime}
                    </span>
                    <span className="font-medium">{formatDuration(entry.duration)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
