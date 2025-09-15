import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Calendar, DollarSign, Clock, FileText, BarChart3, CheckSquare, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectById, updateProjectStatus } from "@/services/projects";
import { getCurrentUserId } from "@/services/auth";
import { toast } from "sonner";

export default function ProjectView() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(Number(projectId)),
    enabled: !!projectId
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => 
      updateProjectStatus(Number(projectId), status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Project status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update project status');
    }
  });

  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate({ status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'paused': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount?: number | string, hourlyRate?: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const numHourlyRate = typeof hourlyRate === 'string' ? parseFloat(hourlyRate) : hourlyRate;

    if (project?.project_type === 'hourly' && numHourlyRate) {
      return `$${numHourlyRate.toFixed(2)}/hr`;
    }
    if (numAmount) {
      return `$${numAmount.toFixed(2)}`;
    }
    return 'Not specified';
  };

  const currentUserId = getCurrentUserId();
  const collaboratorName = project?.client_id === currentUserId 
    ? project?.provider_name 
    : project?.client_name;

  const userRole = project?.client_id === currentUserId ? 'Client' : 'Provider';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Project not found</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/mywork')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Work
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard/mywork')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
              <p className="text-muted-foreground">View detailed information</p>
            </div>
          </div>
          <Badge variant={getStatusColor(project.status)} className="text-sm px-3 py-1">
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Collaborator</p>
                  <p className="font-semibold">{collaboratorName || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold text-emerald-600">
                    {formatAmount(project.total_amount, project.hourly_rate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Start</p>
                  <p className="font-semibold">{formatDate(project.start_date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Due</p>
                  <p className="font-semibold">{formatDate(project.expected_end_date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {project.description && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">0% Complete</span>
              </div>
              <Progress value={0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Project Actions Tabs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Resources
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Project Type</h4>
                      <p className="text-muted-foreground">{project.project_type?.charAt(0).toUpperCase() + project.project_type?.slice(1) || 'Fixed'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Current Phase</h4>
                      <p className="text-muted-foreground">Phase {project.current_phase || 1}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Source</h4>
                      <p className="text-muted-foreground">{project.source_type?.charAt(0).toUpperCase() + project.source_type?.slice(1) || 'Job'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Your Role</h4>
                      <p className="text-muted-foreground">{userRole}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Progress tracking coming soon...
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Task management coming soon...
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Resource sharing coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {project.status === 'active' && (
            <>
              <Button 
                variant="outline"
                onClick={() => handleStatusUpdate('paused')}
                disabled={updateStatusMutation.isPending}
              >
                Pause
              </Button>
              <Button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={updateStatusMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Complete
              </Button>
            </>
          )}
          {project.status === 'paused' && (
            <Button 
              onClick={() => handleStatusUpdate('active')}
              disabled={updateStatusMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Resume
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}