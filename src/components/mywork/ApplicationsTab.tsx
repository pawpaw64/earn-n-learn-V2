import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JobApplicationCard } from "@/components/marketplace/JobApplicationCard";
import { ContactCard } from "@/components/marketplace/ContactCard";
import { ReceivedApplicationsTable } from "./tables/ReceivedApplicationsTable";
import { ReceivedContactsTable } from "./tables/ReceivedContactsTable";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { getApplications } from "@/services/applications";
import { getContacts } from "@/services/contacts";

interface ApplicationsTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange?: (id: number, type: string, status: string) => Promise<boolean>;
}

export function ApplicationsTab({ onViewDetails, onStatusChange }: ApplicationsTabProps) {
  const [activeTab, setActiveTab] = useState("received");
  const [sentApplications, setSentApplications] = useState<any[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<any[]>([]);
  const [sentContacts, setSentContacts] = useState<any[]>([]);
  const [receivedContacts, setReceivedContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const sent = await getApplications('sent');
      const received = await getApplications('received');
      setSentApplications(sent || []);
      setReceivedApplications(received || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const sent = await getContacts('sent');
      const received = await getContacts('received');
      setSentContacts(sent || []);
      setReceivedContacts(received || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchContacts();
  }, []);

  const handleStatusChange = async (id: number, type: string, status: string) => {
    if (onStatusChange) {
      const success = await onStatusChange(id, type, status);
      if (success) {
        // Refresh data after successful status change
        fetchApplications();
        fetchContacts();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Applications & Contacts</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'received' ? 'default' : 'outline'}
            onClick={() => setActiveTab('received')}
          >
            Received ({receivedApplications.length + receivedContacts.length})
          </Button>
          <Button
            variant={activeTab === 'sent' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sent')}
          >
            Sent ({sentApplications.length + sentContacts.length})
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {activeTab === 'received' && (
            <div className="space-y-6">
              {receivedApplications.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Job Applications</h3>
                  <ReceivedApplicationsTable
                    applications={receivedApplications}
                    onViewDetails={onViewDetails}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              )}
              
              {receivedContacts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Requests</h3>
                  <ReceivedContactsTable
                    contacts={receivedContacts}
                    onViewDetails={onViewDetails}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              )}
              
              {receivedApplications.length === 0 && receivedContacts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No received applications or contacts</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-6">
              {sentApplications.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Your Applications</h3>
                  <div className="grid gap-4">
                    {sentApplications.map((application) => (
                      <JobApplicationCard
                        key={application.id}
                        application={application}
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {sentContacts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Your Contact Requests</h3>
                  <div className="grid gap-4">
                    {sentContacts.map((contact) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {sentApplications.length === 0 && sentContacts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sent applications or contacts</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
