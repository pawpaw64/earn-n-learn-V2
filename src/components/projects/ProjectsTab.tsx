
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects} from "@/services/projects";
import { Project } from "@/types/marketplace";
import { LoadingSkeleton } from "../mywork/LoadingSkeleton";
import { ProjectsGrid } from "./ProjectsGrid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Console } from "console";

interface ProjectsTabProps {
  onViewDetails?: (item: any, type: string) => Promise<void>;
  onStatusChange?: (id: number, type: string, status: string) => Promise<void>;
}

export function ProjectsTab({ onViewDetails, onStatusChange }: ProjectsTabProps) {
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
    if (onViewDetails) {
      await onViewDetails(project, 'project');
    }
  };

  const handleOpenChat = (project: Project) => {
    console.log('Opening chat for project:', project.id);
    // This could open a dedicated chat interface or redirect to messages
  };

  // Get current user ID
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');
  console.log('Current user ID:', currentUserId);

  // Separate projects by user role
  const clientProjects = allProjects.filter(p => p.provider_id === currentUserId);
  const providerProjects = allProjects.filter(p => p.client_id === currentUserId);

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
        <div className="space-y-8">
          {/* Client Work Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Work as Recruiter</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {clientProjects.length} projects
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="space-y-2">
                    <div className="text-3xl">👤</div>
                    <p className="text-sm">No projects where you work as a client</p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active">
                      Active ({clientProjects.filter(p => p.status === 'active').length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({clientProjects.filter(p => p.status === 'completed').length})
                    </TabsTrigger>
                    <TabsTrigger value="other">
                      Other ({clientProjects.filter(p => !['active', 'completed'].includes(p.status)).length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="mt-4">
                    <ProjectsGrid 
                      projects={clientProjects.filter(p => p.status === 'active')}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                    />
                  </TabsContent>

                  <TabsContent value="completed" className="mt-4">
                    <ProjectsGrid 
                      projects={clientProjects.filter(p => p.status === 'completed')}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                    />
                  </TabsContent>

                  <TabsContent value="other" className="mt-4">
                    <ProjectsGrid 
                      projects={clientProjects.filter(p => !['active', 'completed'].includes(p.status))}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Provider Work Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Work as Applicant</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {providerProjects.length} projects
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {providerProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="space-y-2">
                    <div className="text-3xl">🔧</div>
                    <p className="text-sm">No projects where you work as a provider</p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active">
                      Active ({providerProjects.filter(p => p.status === 'active').length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({providerProjects.filter(p => p.status === 'completed').length})
                    </TabsTrigger>
                    <TabsTrigger value="other">
                      Other ({providerProjects.filter(p => !['active', 'completed'].includes(p.status)).length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="mt-4">
                    <ProjectsGrid 
                      projects={providerProjects.filter(p => p.status === 'active')}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                    />
                  </TabsContent>

                  <TabsContent value="completed" className="mt-4">
                    <ProjectsGrid 
                      projects={providerProjects.filter(p => p.status === 'completed')}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                    />
                  </TabsContent>

                  <TabsContent value="other" className="mt-4">
                    <ProjectsGrid 
                      projects={providerProjects.filter(p => !['active', 'completed'].includes(p.status))}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}