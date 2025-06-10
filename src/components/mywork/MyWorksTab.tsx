
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviderWorks } from "@/services/works";
import { getUserProjects } from "@/services/projects";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { WorksHeader } from "./works/WorksHeader";
import { WorksGrid } from "./works/WorksGrid";
import { ProjectsGrid } from "../projects/ProjectsGrid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkType } from "@/types/marketplace";
import { Project } from "@/services/projects";

interface MyWorksTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<void>;
}

/**
 * Main component for the My Works tab with integrated project management
 */
export function MyWorksTab({ onViewDetails, onStatusChange }: MyWorksTabProps) {
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
    data: projects = [], 
    isLoading: isLoadingProjects
  } = useQuery({
    queryKey: ['userProjects'],
    queryFn: getUserProjects
  });

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

  const handleProjectViewDetails = (project: Project) => {
    onViewDetails(project, 'project');
  };

  // Show loading state while fetching data
  if (isLoadingWorks || isLoadingProjects) {
    return <LoadingSkeleton />;
  }

  const activeProjects = projects.filter((p: Project) => p.status === 'active');
  const completedProjects = projects.filter((p: Project) => p.status === 'completed');

  return (
    <div className="space-y-6">
      <WorksHeader />
      
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
            onViewDetails={handleProjectViewDetails}
          />
        </TabsContent>

        <TabsContent value="completed-projects" className="mt-6">
          <ProjectsGrid 
            projects={completedProjects}
            onViewDetails={handleProjectViewDetails}
          />
        </TabsContent>

        <TabsContent value="work-assignments" className="mt-6">
          <WorksGrid 
            works={formattedWorks}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
