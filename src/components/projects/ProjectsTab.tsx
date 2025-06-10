
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects, Project } from "@/services/projects";
import { LoadingSkeleton } from "../mywork/LoadingSkeleton";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProjectsTabProps {
  onCreateProject?: (workId: number) => void;
}

export function ProjectsTab({ onCreateProject }: ProjectsTabProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { 
    data: allProjects = [], 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['userProjects'],
    queryFn: getUserProjects
  });

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const handleOpenChat = (project: Project) => {
    // TODO: Implement project chat functionality
    console.log('Opening chat for project:', project.id);
  };

  const activeProjects = allProjects.filter(p => p.status === 'active');
  const completedProjects = allProjects.filter(p => p.status === 'completed');
  const otherProjects = allProjects.filter(p => !['active', 'completed'].includes(p.status));

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Projects</h2>
          <div className="text-sm text-muted-foreground">
            {allProjects.length} total projects
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="other">
              Other ({otherProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <ProjectsGrid 
              projects={activeProjects}
              onViewDetails={handleViewDetails}
              onOpenChat={handleOpenChat}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <ProjectsGrid 
              projects={completedProjects}
              onViewDetails={handleViewDetails}
              onOpenChat={handleOpenChat}
            />
          </TabsContent>

          <TabsContent value="other" className="mt-6">
            <ProjectsGrid 
              projects={otherProjects}
              onViewDetails={handleViewDetails}
              onOpenChat={handleOpenChat}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProjectDetailsDialog
        project={selectedProject}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onProjectUpdate={refetch}
      />
    </>
  );
}