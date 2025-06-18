import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { ApplicationType, ContactType, JobType, SkillType, MaterialType, InvoiceType } from '@/types/marketplace';
import { ApplicationList } from './applications/ApplicationList';
import { ContactCard } from './applications/ContactCard';
import { ReceivedApplicationsTable } from './applications/ReceivedApplicationsTable';
import { ReceivedContactsTable } from './applications/ReceivedContactsTable';

interface ApplicationsTabProps {
  applications: ApplicationType[];
  contacts: ContactType[];
  receivedApplications: ApplicationType[];
  receivedContacts: ContactType[];
  jobs: JobType[];
  skills: SkillType[];
  materials: MaterialType[];
  invoices: InvoiceType[];
  onViewDetails: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: number, type: string, status: string) => Promise<void>;
  refreshData: () => void;
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  applications,
  contacts,
  receivedApplications,
  receivedContacts,
  jobs,
  skills,
  materials,
  invoices,
  onViewDetails,
  onEdit,
  onDelete,
  refreshData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('my-applications');

  

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-applications">My Applications</TabsTrigger>
          <TabsTrigger value="my-contacts">My Contacts</TabsTrigger>
          <TabsTrigger value="received-applications">Received Applications</TabsTrigger>
          <TabsTrigger value="received-contacts">Received Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="my-applications">
          <ApplicationList
            applications={applications}
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="my-contacts">
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="received-applications">
          <ReceivedApplicationsTable
            applications={receivedApplications}
            jobs={jobs}
            onViewDetails={onViewDetails}
            refreshData={refreshData}
          />
        </TabsContent>

        <TabsContent value="received-contacts">
          <ReceivedContactsTable
            contacts={receivedContacts}
            skills={skills}
            materials={materials}
            onViewDetails={onViewDetails}
            refreshData={refreshData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
