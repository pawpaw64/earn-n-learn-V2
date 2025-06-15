
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApplicationList } from "./applications/ApplicationList";
import { ReceivedApplicationsTable } from "./applications/ReceivedApplicationsTable";
import { ReceivedContactsTable } from "./applications/ReceivedContactsTable";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { fetchMyApplications, fetchJobApplications } from "@/services/applications";
import { fetchMyContacts, fetchReceivedContacts } from "@/services/contacts";
import { toast } from "sonner";

interface ApplicationsTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<void>;
}

export function ApplicationsTab({ onViewDetails, onStatusChange }: ApplicationsTabProps) {
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<any[]>([]);
  const [myContacts, setMyContacts] = useState<any[]>([]);
  const [receivedContacts, setReceivedContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [myApps, receivedApps, myContactsData, receivedContactsData] = await Promise.all([
        fetchMyApplications(),
        fetchJobApplications(),
        fetchMyContacts(),
        fetchReceivedContacts()
      ]);

      setMyApplications(myApps || []);
      setReceivedApplications(receivedApps || []);
      setMyContacts(myContactsData || []);
      setReceivedContacts(receivedContactsData || []);
    } catch (error) {
      console.error("Error loading applications data:", error);
      toast.error("Failed to load applications data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChangeWithRefresh = async (id: number, type: string, status: string) => {
    try {
      await onStatusChange(id, type, status);
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="submitted" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="submitted">My Applications</TabsTrigger>
          <TabsTrigger value="received">Received Applications</TabsTrigger>
          <TabsTrigger value="my-contacts">My Contacts</TabsTrigger>
          <TabsTrigger value="received-contacts">Received Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="submitted">
          <ApplicationList 
            applications={myApplications}
            onViewDetails={onViewDetails}
            type="my_application"
          />
        </TabsContent>

        <TabsContent value="received">
          <ReceivedApplicationsTable
            applications={receivedApplications}
            onViewDetails={onViewDetails}
            onStatusChange={handleStatusChangeWithRefresh}
          />
        </TabsContent>

        <TabsContent value="my-contacts">
          <ApplicationList 
            applications={myContacts}
            onViewDetails={onViewDetails}
            type="my_contact"
          />
        </TabsContent>

        <TabsContent value="received-contacts">
          <ReceivedContactsTable
            contacts={receivedContacts}
            onViewDetails={onViewDetails}
            onStatusChange={handleStatusChangeWithRefresh}
            type="contact"
            isLoading={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
