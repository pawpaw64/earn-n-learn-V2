import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApplicationsTab from '@/components/mywork/ApplicationsTab';
import ContactsTab from '@/components/mywork/ContactsTab';
import { updateApplicationStatus, updateContactStatus } from '@/services/mywork';
import { toast } from 'sonner';

export default function MyWork() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // This useEffect can be used to trigger re-renders if needed
  }, [refreshTrigger]);

  const handleStatusUpdate = async (id: number, type: string, status: string): Promise<void> => {
    try {
      let success = false;
      
      if (type === 'job_application') {
        success = await updateApplicationStatus(id, status);
      } else if (type === 'contact') {
        success = await updateContactStatus(id, status);
      }
      
      if (success) {
        toast.success('Status updated successfully');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Work</h1>
        <p className="text-muted-foreground">
          Manage your job applications and contacts
        </p>
      </div>
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="space-y-4">
          <ApplicationsTab onStatusUpdate={handleStatusUpdate} refreshTrigger={refreshTrigger} />
        </TabsContent>
        <TabsContent value="contacts" className="space-y-4">
          <ContactsTab onStatusUpdate={handleStatusUpdate} refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
