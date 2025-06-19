
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: number;
  title: string;
}

interface TaskManagerProps {
  project: Project;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ project }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Task management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
