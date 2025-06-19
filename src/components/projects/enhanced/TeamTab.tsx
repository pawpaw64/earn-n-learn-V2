
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Project {
  id: number;
  provider_name?: string;
  client_name?: string;
  provider_avatar?: string;
  client_avatar?: string;
}

interface TeamTabProps {
  project: Project;
}

export const TeamTab: React.FC<TeamTabProps> = ({ project }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.provider_name && (
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={project.provider_avatar} />
                <AvatarFallback>{project.provider_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{project.provider_name}</p>
                <p className="text-sm text-muted-foreground">Provider</p>
              </div>
            </div>
          )}
          {project.client_name && (
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={project.client_avatar} />
                <AvatarFallback>{project.client_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{project.client_name}</p>
                <p className="text-sm text-muted-foreground">Client</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
