
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications, getUserContacts } from "@/services/mywork";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobApplicationTable } from "./JobApplicationTable";
import { ContactTable } from "./ContactTable";

interface ApplicationsTabProps {
  onViewDetails?: (item: any, type: string) => Promise<void>;
  onStatusChange?: (id: number, type: string, status: string) => Promise<void>;
  onEdit?: (item: any, type: string) => void;
  onDelete?: (id: number, type: string) => Promise<boolean>;
}

export function ApplicationsTab({ 
  onViewDetails, 
  onStatusChange, 
  onEdit, 
  onDelete 
}: ApplicationsTabProps) {
  const [activeTab, setActiveTab] = useState("received");

  const { 
    data: applications = [], 
    isLoading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications
  } = useQuery({
    queryKey: ['userApplications'],
    queryFn: getUserApplications,
    retry: 1
  });

  const { 
    data: contacts = [], 
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts
  } = useQuery({
    queryKey: ['userContacts'],
    queryFn: getUserContacts,
    retry: 1
  });

  const handleRefresh = () => {
    refetchApplications();
    refetchContacts();
  };

  // Filter applications
  const receivedApplications = applications.filter(app => 
    app.poster_email === localStorage.getItem('userEmail')
  );
  
  const myApplications = applications.filter(app => 
    app.applicant_email === localStorage.getItem('userEmail')
  );

  // Filter contacts
  const receivedContacts = contacts.filter(contact => 
    contact.provider_email === localStorage.getItem('userEmail') || 
    contact.seller_email === localStorage.getItem('userEmail')
  );
  
  const myContacts = contacts.filter(contact => 
    contact.requester_email === localStorage.getItem('userEmail')
  );

  const isLoading = applicationsLoading || contactsLoading;
  const hasError = applicationsError || contactsError;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (hasError) {
    console.error('Error loading applications/contacts:', { applicationsError, contactsError });
    return (
      <div className="text-center py-10">
        <div className="space-y-4">
          <div className="text-6xl">⚠️</div>
          <div>
            <h3 className="text-lg font-medium">Error Loading Data</h3>
            <p className="text-sm text-muted-foreground">
              Failed to load applications or contacts
            </p>
            <button 
              onClick={handleRefresh} 
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
        <h2 className="text-2xl font-bold">Applications</h2>
        <div className="text-sm text-muted-foreground">
          {applications.length + contacts.length} total items
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="received">
            Received Applications ({receivedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="my">
            My Applications ({myApplications.length})
          </TabsTrigger>
          <TabsTrigger value="received-contacts">
            Received Contacts ({receivedContacts.length})
          </TabsTrigger>
          <TabsTrigger value="my-contacts">
            My Contacts ({myContacts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          <JobApplicationTable
            applications={receivedApplications}
            type="application"
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          <JobApplicationTable
            applications={myApplications}
            type="my_application"
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabsContent>

        <TabsContent value="received-contacts" className="mt-6">
          <ContactTable
            contacts={receivedContacts}
            type="received_contact"
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
          />
        </TabsContent>

        <TabsContent value="my-contacts" className="mt-6">
          <ContactTable
            contacts={myContacts}
            type="my_contact"
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
