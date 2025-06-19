
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  deadline?: string;
  budget?: string;
}

interface OverviewTabProps {
  project: Project;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ project }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Status</h4>
            <Badge variant="secondary">{project.status}</Badge>
          </div>
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          {project.deadline && (
            <div>
              <h4 className="font-medium">Deadline</h4>
              <p className="text-sm">{project.deadline}</p>
            </div>
          )}
          {project.budget && (
            <div>
              <h4 className="font-medium">Budget</h4>
              <p className="text-sm">{project.budget}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
