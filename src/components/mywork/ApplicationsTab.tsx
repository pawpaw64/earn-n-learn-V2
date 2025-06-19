
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobApplicationTable } from './JobApplicationTable';
import { ContactTable } from './ContactTable';
import { fetchJobApplications, fetchContacts } from '@/services/mywork';
import { toast } from 'sonner';

interface ApplicationsTabProps {
  onStatusUpdate: (id: number, type: string, status: string) => Promise<void>;
  refreshTrigger: number;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ onStatusUpdate, refreshTrigger }) => {
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([loadApplications(), loadContacts()]);
  }, [refreshTrigger]);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJobApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast.error('Failed to load job applications');
    } finally {
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications & Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Job Applications</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          <TabsContent value="applications">
            <JobApplicationTable
              applications={applications}
              isLoading={isLoading}
              onStatusUpdate={onStatusUpdate}
            />
          </TabsContent>
          <TabsContent value="contacts">
            <ContactTable
              contacts={contacts}
              isLoading={isLoading}
              onStatusUpdate={onStatusUpdate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
