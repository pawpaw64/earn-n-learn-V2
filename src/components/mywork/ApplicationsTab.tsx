
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { JobApplicationCard } from "./applications/JobApplicationCard";
import { ContactCard } from "./applications/ContactCard";
import { ReceivedApplicationsTable } from "./applications/ReceivedApplicationsTable";
import { ReceivedContactsTable } from "./applications/ReceivedContactsTable";

import { fetchMyApplications, fetchJobApplications } from "@/services/applications";
import { fetchUserSkillContacts, fetchUserMaterialContacts } from "@/services/contacts";
import { fetchSkillContacts, fetchMaterialContacts } from "@/services/contacts";

interface ApplicationsTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

/**
 * Main component for managing all applications and contacts 
 * Both sent and received
 */
export function ApplicationsTab({ onViewDetails, onStatusChange }: ApplicationsTabProps) {
  const [applicationsTab, setApplicationsTab] = useState("job");
  const [activeContactsTab, setActiveContactsTab] = useState("received");

  // Fetch all data
  const { 
    data: applications = [], 
    isLoading: isLoadingApps,
    refetch: refetchApplications
  } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications
  });

  const { 
    data: jobApplications = [], 
    isLoading: isLoadingJobApps,
    refetch: refetchJobApplications
  } = useQuery({
    queryKey: ['jobApplications'],
    queryFn: fetchJobApplications
  });

  const {
    data: skillContacts = [],
    isLoading: isLoadingSkillContacts,
    refetch: refetchSkillContacts
  } = useQuery({
    queryKey: ['skillContacts'],
    queryFn: fetchUserSkillContacts
  });

  const {
    data: materialContacts = [],
    isLoading: isLoadingMaterialContacts,
    refetch: refetchMaterialContacts
  } = useQuery({
    queryKey: ['materialContacts'],
    queryFn: fetchUserMaterialContacts
  });

  const {
    data: receivedSkillContacts = [],
    isLoading: isLoadingReceivedSkillContacts,
    refetch: refetchReceivedSkillContacts
  } = useQuery({
    queryKey: ['receivedSkillContacts'],
    queryFn: fetchSkillContacts
  });

  const {
    data: receivedMaterialContacts = [],
    isLoading: isLoadingReceivedMaterialContacts,
    refetch: refetchReceivedMaterialContacts
  } = useQuery({
    queryKey: ['receivedMaterialContacts'],
    queryFn: fetchMaterialContacts
  });

  // Ensure all data arrays are valid arrays
  const applicationsArray = Array.isArray(applications) ? applications : [];
  const jobApplicationsArray = Array.isArray(jobApplications) ? jobApplications : [];
  const skillContactsArray = Array.isArray(skillContacts) ? skillContacts : [];
  const materialContactsArray = Array.isArray(materialContacts) ? materialContacts : [];
  const receivedSkillContactsArray = Array.isArray(receivedSkillContacts) ? receivedSkillContacts : [];
  const receivedMaterialContactsArray = Array.isArray(receivedMaterialContacts) ? receivedMaterialContacts : [];

  return (
    <Tabs value={applicationsTab} onValueChange={setApplicationsTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="job">Job Applications</TabsTrigger>
        <TabsTrigger value="skill">Skill Inquiries</TabsTrigger>
        <TabsTrigger value="material">Material Inquiries</TabsTrigger>
        <TabsTrigger value="received">Received Applications</TabsTrigger>
      </TabsList>
      
      {/* Job Applications Subtab */}
      <TabsContent value="job">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Job Applications</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        
        {isLoadingApps ? <LoadingSkeleton /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {applicationsArray.length > 0 ? 
              applicationsArray.map((app) => (
                <JobApplicationCard 
                  key={app.id}
                  app={app}
                  onViewDetails={onViewDetails}
                  onStatusChange={onStatusChange}
                />
              )) 
              : (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No job applications found
                </div>
              )
            }
          </div>
        )}
      </TabsContent>
      
      {/* Skill Inquiries Subtab */}
      <TabsContent value="skill">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Skill Inquiries</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        
        {isLoadingSkillContacts ? <LoadingSkeleton /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {skillContactsArray.length > 0 ? 
              skillContactsArray.map((contact) => (
                <ContactCard 
                  key={contact.id}
                  contact={contact}
                  type="skill"
                  onViewDetails={onViewDetails}
                />
              ))
              : (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No skill inquiries found
                </div>
              )
            }
          </div>
        )}
      </TabsContent>
      
      {/* Material Inquiries Subtab */}
      <TabsContent value="material">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Material Inquiries</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        
        {isLoadingMaterialContacts ? <LoadingSkeleton /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {materialContactsArray.length > 0 ? 
              materialContactsArray.map((contact) => (
                <ContactCard 
                  key={contact.id}
                  contact={contact}
                  type="material"
                  onViewDetails={onViewDetails}
                />
              ))
              : (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No material inquiries found
                </div>
              )
            }
          </div>
        )}
      </TabsContent>
      
      {/* Received Applications Subtab */}
      <TabsContent value="received">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Received Applications</h2>
        </div>
        
        <Tabs value={activeContactsTab} onValueChange={setActiveContactsTab} className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="received">Job Applications</TabsTrigger>
            <TabsTrigger value="skills">Skill Inquiries</TabsTrigger>
            <TabsTrigger value="materials">Material Inquiries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="received">
            <ReceivedApplicationsTable 
              applications={jobApplicationsArray}
              isLoading={isLoadingJobApps}
              onViewDetails={onViewDetails}
              onStatusChange={onStatusChange}
            />
          </TabsContent>
          
          <TabsContent value="skills">
            <ReceivedContactsTable 
              contacts={receivedSkillContactsArray}
              type="skill"
              isLoading={isLoadingReceivedSkillContacts}
              onViewDetails={onViewDetails}
              onStatusChange={onStatusChange}
            />
          </TabsContent>
          
          <TabsContent value="materials">
            <ReceivedContactsTable 
              contacts={receivedMaterialContactsArray}
              type="material"
              isLoading={isLoadingReceivedMaterialContacts}
              onViewDetails={onViewDetails}
              onStatusChange={onStatusChange}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
