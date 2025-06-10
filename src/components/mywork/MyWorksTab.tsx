
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyWorks, fetchProviderWorks } from "@/services/works";
import { getUserProjects, Project } from "@/services/projects";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { WorksHeader } from "./works/WorksHeader";
import { WorksGrid } from "./works/WorksGrid";
import { ProjectsGrid } from "../projects/ProjectsGrid";
import { ProjectDetailsDialog } from "../projects/ProjectDetailsDialog";
import { WorkType } from "@/types/marketplace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MyWorksTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<boolean>;
}

export function MyWorksTab({ onViewDetails, onStatusChange }: MyWorksTabProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);

  // Fetch works data
  const { 
    data: works = [], 
    isLoading: isLoadingWorks
  } = useQuery({
    queryKey: ['myWorks'],
    queryFn: fetchProviderWorks
  });

  // Fetch projects data
  const { 
    data: allProjects = [], 
    isLoading: isLoadingProjects,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ['userProjects'],
    queryFn: getUserProjects
  });

  const handleProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsProjectDetailsOpen(true);
  };

  const handleOpenChat = (project: Project) => {
    console.log('Opening chat for project:', project.id);
  };

  // Ensure works is always an array
  const worksArray = Array.isArray(works) ? works : [];

  // Map the works to the expected format for WorksGrid
  const formattedWorks = worksArray.map((work: WorkType) => ({
    id: work.id,
    title: work.job_title || work.skill_name || work.material_title || 'Unnamed Work',
    clientName: work.client_name || 'Unknown Client',
    clientAvatar: work.client_avatar,
    status: work.status,
    startDate: work.start_date,
    endDate: work.end_date,
    payment: work.job_payment || work.skill_pricing || work.material_price,
    description: work.notes || work.job_description || work.skill_description || work.material_description,
    type: 'work',
    ...work
  }));

  // Filter projects
  const activeProjects = allProjects.filter(p => p.status === 'active');
  const completedProjects = allProjects.filter(p => p.status === 'completed');

  // Show loading state while fetching data
  if (isLoadingWorks || isLoadingProjects) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Tabs defaultValue="active-projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active-projects">
            Active Projects ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed-projects">
            Completed Projects ({completedProjects.length})
          </TabsTrigger>
          <TabsTrigger value="work-assignments">
            Work Assignments ({formattedWorks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active-projects" className="mt-6">
          <ProjectsGrid 
            projects={activeProjects}
            onViewDetails={handleProjectDetails}
            onOpenChat={handleOpenChat}
          />
        </TabsContent>

        <TabsContent value="completed-projects" className="mt-6">
          <ProjectsGrid 
            projects={completedProjects}
            onViewDetails={handleProjectDetails}
            onOpenChat={handleOpenChat}
          />
        </TabsContent>

        <TabsContent value="work-assignments" className="mt-6">
          <WorksHeader />
          <WorksGrid 
            works={formattedWorks}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
          />
        </TabsContent>
      </Tabs>

      <ProjectDetailsDialog
        project={selectedProject}
        isOpen={isProjectDetailsOpen}
        onOpenChange={setIsProjectDetailsOpen}
        onProjectUpdate={refetchProjects}
      />
    </>
  );
}
