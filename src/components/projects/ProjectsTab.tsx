
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects} from "@/services/projects";
import { Project } from "@/types/marketplace";
import { LoadingSkeleton } from "../mywork/LoadingSkeleton";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProjectsTabProps {
  onViewDetails?: (item: any, type: string) => Promise<void>;
  onStatusChange?: (id: number, type: string, status: string) => Promise<void>;
}

export function ProjectsTab({ onViewDetails, onStatusChange }: ProjectsTabProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { 
    data: allProjects = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userProjects'],
    queryFn: getUserProjects,
    retry: 1
  });

  const handleViewDetails = async (project: Project) => {
    console.log('Viewing project details:', project);
    setSelectedProject(project);
    setIsDetailsOpen(true);
    if (onViewDetails) {
      await onViewDetails(project, 'project');
    }
  };

  const handleOpenChat = (project: Project) => {
    console.log('Opening chat for project:', project.id);
    // This could open a dedicated chat interface or redirect to messages
  };

  const handleProjectUpdate = () => {
    refetch();
  };

  const activeProjects = allProjects.filter(p => p.status === 'active');
  const completedProjects = allProjects.filter(p => p.status === 'completed');
  const otherProjects = allProjects.filter(p => !['active', 'completed'].includes(p.status));

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    console.error('Error loading projects:', error);
    return (
      <div className="text-center py-10">
        <div className="space-y-4">
          <div className="text-6xl">⚠️</div>
          <div>
            <h3 className="text-lg font-medium">Error Loading Projects</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load projects'}
            </p>
            <button 
              onClick={() => refetch()} 
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Works</h2>
          <div className="text-sm text-muted-foreground">
            {allProjects.length} total projects
          </div>
        </div>

        {allProjects.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <div className="space-y-4">
              <div className="text-6xl">📋</div>
              <div>
                <h3 className="text-lg font-medium">No Projects Yet</h3>
                <p className="text-sm">Your accepted work assignments will appear here as projects.</p>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        project={selectedProject}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onProjectUpdate={handleProjectUpdate}
      />
    </>
  );
}
