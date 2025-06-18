import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Project } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { BudgetTab } from './BudgetTab';
import { TeamTab } from './TeamTab';
import { TaskManager } from './TaskManager';

interface EnhancedProjectDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  userRole: string;
}

export const EnhancedProjectDetailsDialog: React.FC<EnhancedProjectDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  project,
  userRole,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.title} Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab project={project} />
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <BudgetTab project={project} />
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <TeamTab project={project} />
          </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskManager project={project} userRole={userRole} />
        </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
