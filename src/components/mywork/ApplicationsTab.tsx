import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCcw } from "lucide-react";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { JobApplicationCard } from "./applications/JobApplicationCard";
import { ContactCard } from "./applications/ContactCard";
import { ReceivedApplicationsTable } from "./applications/ReceivedApplicationsTable";
import { ReceivedContactsTable } from "./applications/ReceivedContactsTable";
import {
  fetchMyApplications,
  fetchJobApplications,
} from "@/services/applications";
import {
  fetchUserSkillContacts,
  fetchUserMaterialContacts,
  fetchSkillContacts,
  fetchMaterialContacts,
} from "@/services/contacts";

interface ApplicationsTabProps {
  onViewDetails: (item: any, type: string) => Promise<void>;
  onStatusChange: (
    id: number,
    type: string,
    status: string
  ) => Promise<void>;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: number, type: string) => Promise<boolean>;
}

/**
 * Main component for managing all applications and contacts
 * Both sent and received
 */
export function ApplicationsTab({
  onViewDetails,
  onStatusChange,
  onEdit,
  onDelete,
}: ApplicationsTabProps) {
  const [applicationsTab, setApplicationsTab] = useState("posted");
  const queryClient = useQueryClient();

  // Function to refetch all data
  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    queryClient.invalidateQueries({ queryKey: ["skillContacts"] });
    queryClient.invalidateQueries({ queryKey: ["materialContacts"] });
    queryClient.invalidateQueries({ queryKey: ["receivedSkillContacts"] });
    queryClient.invalidateQueries({ queryKey: ["receivedMaterialContacts"] });
  };

  // Fetch all data
  const { data: applications = [], isLoading: isLoadingApps } = useQuery({
    queryKey: ["myApplications"],
    queryFn: fetchMyApplications,
    staleTime: 30000, // 30 seconds
  });

  const { data: jobApplications = [], isLoading: isLoadingJobApps } = useQuery({
    queryKey: ["jobApplications"],
    queryFn: fetchJobApplications,
    staleTime: 30000,
  });

  const { data: skillContacts = [], isLoading: isLoadingSkillContacts } =
    useQuery({
      queryKey: ["skillContacts"],
      queryFn: fetchUserSkillContacts,
      staleTime: 30000,
    });

  const { data: materialContacts = [], isLoading: isLoadingMaterialContacts } =
    useQuery({
      queryKey: ["materialContacts"],
      queryFn: fetchUserMaterialContacts,
      staleTime: 30000,
    });

  const {
    data: receivedSkillContacts = [],
    isLoading: isLoadingReceivedSkillContacts,
  } = useQuery({
    queryKey: ["receivedSkillContacts"],
    queryFn: fetchSkillContacts,
    staleTime: 30000,
  });

  const {
    data: receivedMaterialContacts = [],
    isLoading: isLoadingReceivedMaterialContacts,
  } = useQuery({
    queryKey: ["receivedMaterialContacts"],
    queryFn: fetchMaterialContacts,
    staleTime: 30000,
  });


  // Handle status changes with automatic refetch
  const handleStatusChange = async (
    id: number,
    type: string,
    status: string
  ): Promise<void> => {
    if (onStatusChange) {
      await onStatusChange(id, type, status);
    }
  };

  // Ensure all data arrays are valid arrays
  const applicationsArray = Array.isArray(applications) ? applications : [];
  const jobApplicationsArray = Array.isArray(jobApplications)
    ? jobApplications
    : [];
  const skillContactsArray = Array.isArray(skillContacts) ? skillContacts : [];
  const materialContactsArray = Array.isArray(materialContacts)
    ? materialContacts
    : [];
  const receivedSkillContactsArray = Array.isArray(receivedSkillContacts)
    ? receivedSkillContacts
    : [];
  const receivedMaterialContactsArray = Array.isArray(receivedMaterialContacts)
    ? receivedMaterialContacts
    : [];

  return (
    <Tabs value={applicationsTab} onValueChange={setApplicationsTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="posted">Posted Application</TabsTrigger>
        <TabsTrigger value="received">Received Application</TabsTrigger>
      </TabsList>

      {/* Posted Applications */}
      <TabsContent value="posted">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Posted Application</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => refetchAll()}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        <Tabs defaultValue="job" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="job">Job Applications</TabsTrigger>
            <TabsTrigger value="skill">Skill Contacts</TabsTrigger>
            <TabsTrigger value="material">Materials Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="job">
            {isLoadingApps ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {applicationsArray.length > 0 ? (
                  applicationsArray.map((app) => (
                    <JobApplicationCard
                      key={app.id}
                      app={app}
                      onViewDetails={onViewDetails}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-muted-foreground">
                    No job applications found
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="skill">
            {isLoadingSkillContacts ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {skillContactsArray.length > 0 ? (
                  skillContactsArray.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      type="skill"
                      onViewDetails={onViewDetails}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-muted-foreground">
                    No skill inquiries found
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="material">
            {isLoadingMaterialContacts ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {materialContactsArray.length > 0 ? (
                  materialContactsArray.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      type="material"
                      onViewDetails={onViewDetails}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-muted-foreground">
                    No material inquiries found
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* Received Applications */}
      <TabsContent value="received">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Received Application</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => refetchAll()}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        <Tabs defaultValue="job" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="job">Job Applications </TabsTrigger>
            <TabsTrigger value="skill">Skill Contacts</TabsTrigger>
            <TabsTrigger value="material">Materils Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="job">
            <ReceivedApplicationsTable
              applications={jobApplicationsArray}
              isLoading={isLoadingJobApps}
              onViewDetails={onViewDetails}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="skill">
            <ReceivedContactsTable
              contacts={receivedSkillContactsArray}
              type="skill"
              isLoading={isLoadingReceivedSkillContacts}
              onViewDetails={onViewDetails}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="material">
            <ReceivedContactsTable
              contacts={receivedMaterialContactsArray}
              type="material"
              isLoading={isLoadingReceivedMaterialContacts}
              onViewDetails={onViewDetails}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}