
import React from "react";
import { ProjectCard } from "./ProjectCard";
import { Project } from "@/services/projects";

interface ProjectsGridProps {
  projects: Project[];
  onViewDetails: (project: Project) => void;
  onOpenChat?: (project: Project) => void;
}

export function ProjectsGrid({ projects, onViewDetails, onOpenChat }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="col-span-2 text-center py-10 text-muted-foreground">
        <div className="space-y-4">
          <div className="text-6xl">📋</div>
          <div>
            <h3 className="text-lg font-medium">No Projects</h3>
            <p className="text-sm">Your accepted work assignments will appear here as projects.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onViewDetails={onViewDetails}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  );
}
