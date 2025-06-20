
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MyApplicationsTable } from "./applications/MyApplicationsTable";
import { ReceivedApplicationsTable } from "./applications/ReceivedApplicationsTable";
import { ReceivedContactsTable } from "./applications/ReceivedContactsTable";
import { ContactsTable } from "./applications/ContactsTable";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { DetailsDialog } from "./DetailsDialog";

interface ApplicationsTabProps {
  myApplications: any[];
  receivedApplications: any[];
  myContacts: any[];
  receivedContacts: any[];
  isLoading: boolean;
  onStatusChange: (id: number, type: string, status: string) => Promise<void>;
  onRefresh: () => void;
}

export function ApplicationsTab({
  myApplications,
  receivedApplications,
  myContacts,
  receivedContacts,
  isLoading,
  onStatusChange,
  onRefresh,
}: ApplicationsTabProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (item: any, type: string) => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsDetailsOpen(true);
  };

  const handleStatusChangeWrapper = async (id: number, type: string, status: string): Promise<boolean> => {
    try {
      await onStatusChange(id, type, status);
      onRefresh();
      return true;
    } catch (error) {
      console.error("Status change error:", error);
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStats = () => {
    const totalApplications = myApplications.length;
    const acceptedApplications = myApplications.filter(app => app.status === 'Accepted').length;
    const totalContacts = myContacts.length;
    const respondedContacts = myContacts.filter(contact => 
      contact.status === 'Responded' || contact.status === 'Agreement Reached'
    ).length;

    return {
      totalApplications,
      acceptedApplications,
      totalContacts,
      respondedContacts,
    };
  };

  const stats = getStats();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>My Applications</CardDescription>
              <CardTitle className="text-2xl">{stats.totalApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.acceptedApplications} accepted
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Received Applications</CardDescription>
              <CardTitle className="text-2xl">{receivedApplications.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {receivedApplications.filter(app => app.status === 'Applied').length} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>My Contacts</CardDescription>
              <CardTitle className="text-2xl">{stats.totalContacts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.respondedContacts} responded
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Received Contacts</CardDescription>
              <CardTitle className="text-2xl">{receivedContacts.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {receivedContacts.filter(contact => contact.status === 'Pending' || contact.status === 'Contact Initiated').length} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Applications and Contacts Tabs */}
        <Tabs defaultValue="my-applications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-applications" className="flex items-center gap-2">
              My Applications
              {stats.totalApplications > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.totalApplications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="received-applications" className="flex items-center gap-2">
              Received Applications
              {receivedApplications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {receivedApplications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-contacts" className="flex items-center gap-2">
              My Contacts
              {stats.totalContacts > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.totalContacts}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="received-contacts" className="flex items-center gap-2">
              Received Contacts
              {receivedContacts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {receivedContacts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Job Applications</CardTitle>
                <CardDescription>
                  Track the status of jobs you've applied to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MyApplicationsTable
                  applications={myApplications}
                  isLoading={isLoading}
                  onViewDetails={handleViewDetails}
                  onStatusChange={handleStatusChangeWrapper}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="received-applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Received Applications</CardTitle>
                <CardDescription>
                  Applications received for your job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReceivedApplicationsTable
                  applications={receivedApplications}
                  isLoading={isLoading}
                  onViewDetails={handleViewDetails}
                  onStatusChange={handleStatusChangeWrapper}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Contact Inquiries</CardTitle>
                <CardDescription>
                  Inquiries you've sent about skills and materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactsTable
                  contacts={myContacts}
                  isLoading={isLoading}
                  onViewDetails={handleViewDetails}
                  onStatusChange={handleStatusChangeWrapper}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="received-contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Received Contact Inquiries</CardTitle>
                <CardDescription>
                  Inquiries received about your skills and materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReceivedContactsTable
                  contacts={receivedContacts}
                  isLoading={isLoading}
                  onViewDetails={handleViewDetails}
                  onStatusChange={handleStatusChangeWrapper}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        item={selectedItem}
        type={selectedType}
        onStatusChange={handleStatusChangeWrapper}
      />
    </>
  );
}
