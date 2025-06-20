
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationsTab } from '@/components/mywork/ApplicationsTab';
import { PostingsTab } from '@/components/mywork/PostingsTab';
import { LoadingSkeleton } from '@/components/mywork/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUserApplications, 
  fetchReceivedApplications, 
  updateApplicationStatus 
} from '@/services/applications';
import {
  fetchUserSkillContacts,
  fetchUserMaterialContacts,
  fetchSkillContacts,
  fetchMaterialContacts,
  updateSkillContactStatus,
  updateMaterialContactStatus
} from '@/services/contacts';
import { toast } from 'sonner';

export default function MyWork() {
  const [activeTab, setActiveTab] = useState('applications');
  const queryClient = useQueryClient();

  // Fetch my applications
  const { data: myApplications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['userApplications'],
    queryFn: fetchUserApplications,
  });

  // Fetch received applications  
  const { data: receivedApplications = [], isLoading: receivedLoading } = useQuery({
    queryKey: ['receivedApplications'],
    queryFn: fetchReceivedApplications,
  });

  // Fetch my contacts (skill + material)
  const { data: mySkillContacts = [] } = useQuery({
    queryKey: ['userSkillContacts'],
    queryFn: fetchUserSkillContacts,
  });

  const { data: myMaterialContacts = [] } = useQuery({
    queryKey: ['userMaterialContacts'],
    queryFn: fetchUserMaterialContacts,
  });

  // Fetch received contacts (skill + material)
  const { data: receivedSkillContacts = [] } = useQuery({
    queryKey: ['receivedSkillContacts'],
    queryFn: fetchSkillContacts,
  });

  const { data: receivedMaterialContacts = [] } = useQuery({
    queryKey: ['receivedMaterialContacts'],
    queryFn: fetchMaterialContacts,
  });

  // Combine contacts
  const myContacts = [...mySkillContacts, ...myMaterialContacts];
  const receivedContacts = [...receivedSkillContacts, ...receivedMaterialContacts];

  const isLoading = applicationsLoading || receivedLoading;

  const handleStatusChange = async (id: number, type: string, status: string): Promise<void> => {
    try {
      if (type === 'job_application') {
        await updateApplicationStatus(id, status);
        toast.success('Application status updated successfully');
      } else if (type === 'skill_contact') {
        await updateSkillContactStatus(id, status);
        toast.success('Skill contact status updated successfully');
      } else if (type === 'material_contact') {
        await updateMaterialContactStatus(id, status);
        toast.success('Material contact status updated successfully');
      }
      
      // Refresh all relevant queries
      queryClient.invalidateQueries({ queryKey: ['userApplications'] });
      queryClient.invalidateQueries({ queryKey: ['receivedApplications'] });
      queryClient.invalidateQueries({ queryKey: ['userSkillContacts'] });
      queryClient.invalidateQueries({ queryKey: ['userMaterialContacts'] });
      queryClient.invalidateQueries({ queryKey: ['receivedSkillContacts'] });
      queryClient.invalidateQueries({ queryKey: ['receivedMaterialContacts'] });
    } catch (error) {
      console.error('Status change error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['userApplications'] });
    queryClient.invalidateQueries({ queryKey: ['receivedApplications'] });
    queryClient.invalidateQueries({ queryKey: ['userSkillContacts'] });
    queryClient.invalidateQueries({ queryKey: ['userMaterialContacts'] });
    queryClient.invalidateQueries({ queryKey: ['receivedSkillContacts'] });
    queryClient.invalidateQueries({ queryKey: ['receivedMaterialContacts'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Work</h1>
        <p className="text-muted-foreground">
          Manage your applications, job postings, and contact inquiries
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications" className="flex items-center gap-2">
            Applications & Contacts
            {(myApplications.length + receivedApplications.length + myContacts.length + receivedContacts.length > 0) && (
              <Badge variant="secondary">
                {myApplications.length + receivedApplications.length + myContacts.length + receivedContacts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="postings">
            My Postings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <ApplicationsTab
            myApplications={myApplications}
            receivedApplications={receivedApplications}
            myContacts={myContacts}
            receivedContacts={receivedContacts}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="postings">
          <PostingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
