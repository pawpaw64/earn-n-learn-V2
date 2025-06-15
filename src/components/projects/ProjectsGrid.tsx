
import React from "react";
import { ProjectCard } from "./ProjectCard";
import { Project } from "@/types/marketplace";

interface ProjectsGridProps {
  projects: Project[];
  onViewDetails: (project: Project) => Promise<void>;
  onOpenChat?: (project: Project) => void;
}

export function ProjectsGrid({ projects, onViewDetails, onOpenChat }: ProjectsGridProps) {
  console.log('ProjectsGrid - Rendering with projects:', projects);

  if (projects.length === 0) {
    return (
      <div className="col-span-full text-center py-10 text-muted-foreground">
        <div className="space-y-4">
          <div className="text-6xl">📋</div>
          <div>
            <h3 className="text-lg font-medium">No Projects in this category</h3>
            <p className="text-sm">Projects will appear here when available.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleViewDetails = async (project: Project) => {
    try {
      await onViewDetails(project);
    } catch (error) {
      console.error('Error viewing project details:', error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onViewDetails={handleViewDetails}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  );
}
