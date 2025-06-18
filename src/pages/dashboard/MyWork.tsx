
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyWorksTab } from '@/components/mywork/MyWorksTab';
import { ApplicationsTab } from '@/components/mywork/ApplicationsTab';
import { InvoicesTab } from '@/components/mywork/InvoicesTab';
import { DetailsDialog } from '@/components/mywork/DetailsDialog';
import { useWorkDetails } from '@/hooks/useWorkDetails';
import { LoadingSkeleton } from '@/components/mywork/LoadingSkeleton';

export default function MyWork() {
  const [activeTab, setActiveTab] = useState('my-works');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    myWorks,
    applications,
    contacts,
    receivedApplications,
    receivedContacts,
    invoices,
    isLoading,
    refreshData,
    handleDelete,
    handleEdit,
  } = useWorkDetails();

  const handleViewDetails = (item: any, type: string) => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsDetailsOpen(true);
  };

  const handleDeleteWrapper = async (id: number, type: string, status: string): Promise<void> => {
    await handleDelete(id, type, status);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Work</h1>
        <p className="text-muted-foreground">
          Manage your jobs, applications, contacts, and invoices
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-works">My Works</TabsTrigger>
          <TabsTrigger value="applications">Applications & Contacts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="my-works">
          <MyWorksTab
            myWorks={myWorks}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteWrapper}
          />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsTab
            applications={applications}
            contacts={contacts}
            receivedApplications={receivedApplications}
            receivedContacts={receivedContacts}
            jobs={myWorks.jobs}
            skills={myWorks.skills}
            materials={myWorks.materials}
            invoices={invoices}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteWrapper}
            refreshData={refreshData}
          />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesTab
            invoices={invoices}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteWrapper}
          />
        </TabsContent>
      </Tabs>

      <DetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        item={selectedItem}
        type={selectedType}
        refreshData={refreshData}
      />
    </div>
  );
}
