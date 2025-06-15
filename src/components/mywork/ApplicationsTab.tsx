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
import { fetchMyPosts } from "@/services";
import { JobPostCard } from "@/components/JobPostCard";
import { SkillPostCard } from "@/components/SkillPostCard";
import { MaterialPostCard } from "@/components/MaterialPostCard";

interface ApplicationsTabProps {
  onViewDetails: (item: any, type: string) => Promise<void>;
  onStatusChange: (
    id: number,
    type: string,
    status: string
  ) => Promise<boolean>;
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
  const [applicationsTab, setApplicationsTab] = useState("job");
  const [activeContactsTab, setActiveContactsTab] = useState("received");
  const [myPostsTab, setMyPostsTab] = useState("jobs");
  const queryClient = useQueryClient();

  // Function to refetch all data
  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    queryClient.invalidateQueries({ queryKey: ["skillContacts"] });
    queryClient.invalidateQueries({ queryKey: ["materialContacts"] });
    queryClient.invalidateQueries({ queryKey: ["receivedSkillContacts"] });
    queryClient.invalidateQueries({ queryKey: ["receivedMaterialContacts"] });
    queryClient.invalidateQueries({ queryKey: ["myPosts"] });
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

  const {
    data: myPosts = { jobs: [], skills: [], materials: [] },
    isLoading: isLoadingMyPosts,
  } = useQuery({
    queryKey: ["myPosts"],
    queryFn: fetchMyPosts,
    staleTime: 30000,
  });

  // Handle status changes with automatic refetch
  const handleStatusChange = async (
    id: number,
    type: string,
    status: string
  ): Promise<boolean> => {
    if (onStatusChange) {
      return await onStatusChange(id, type, status);
    }
    return false;
  };

  const handleDeletePost = async (id: number, type: string) => {
    if (onDelete) {
      const success = await onDelete(id, type);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      }
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
        <TabsTrigger value="job">Job Applications</TabsTrigger>
        <TabsTrigger value="skill">Skill Contacts</TabsTrigger>
        <TabsTrigger value="material">Material Contacts</TabsTrigger>
        <TabsTrigger value="received">My Posts/ Received Inquiries</TabsTrigger>
      </TabsList>

      {/* Job Applications Subtab */}
      <TabsContent value="job">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Job Applications</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => refetchAll()}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>

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

      {/* Skill Inquiries Subtab */}
      <TabsContent value="skill">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Skill Inquiries</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => refetchAll()}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>

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

      {/* Material Inquiries Subtab */}
      <TabsContent value="material">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Material Inquiries</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => refetchAll()}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>

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

      {/* Received Applications Subtab */}
      <TabsContent value="received">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My post/Recieved Inquiries</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => refetchAll()}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        <Tabs
          value={activeContactsTab}
          onValueChange={setActiveContactsTab}
          className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="myposts">My Posts</TabsTrigger>
            <TabsTrigger value="received">Job Inquiries</TabsTrigger>
            <TabsTrigger value="skills">Skill Inquiries</TabsTrigger>
            <TabsTrigger value="materials">Material Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <ReceivedApplicationsTable
              applications={jobApplicationsArray}
              isLoading={isLoadingJobApps}
              onViewDetails={onViewDetails}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="skills">
            <ReceivedContactsTable
              contacts={receivedSkillContactsArray}
              type="skill"
              isLoading={isLoadingReceivedSkillContacts}
              onViewDetails={onViewDetails}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="materials">
            <ReceivedContactsTable
              contacts={receivedMaterialContactsArray}
              type="material"
              isLoading={isLoadingReceivedMaterialContacts}
              onViewDetails={onViewDetails}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="myposts">
            <Tabs
              value={myPostsTab}
              onValueChange={setMyPostsTab}
              className="mt-4">
              <TabsList>
                <TabsTrigger value="jobs">Job Posts</TabsTrigger>
                <TabsTrigger value="skills">Skills Posts</TabsTrigger>
                <TabsTrigger value="materials">Materials Posts</TabsTrigger>
                
              </TabsList>
              {/* Jobs Tab */}
              <TabsContent value="jobs">
                {isLoadingMyPosts ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                    {myPosts.jobs && myPosts.jobs.length > 0 ? (
                      myPosts.jobs.map((job: any) => (
                        <JobPostCard
                          key={job.id}
                          job={job}
                          onView={() => onViewDetails(job, "job")}
                          onEdit={() => onEdit(job, "job")}
                          onDelete={() => handleDeletePost(job.id, "job")}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-muted-foreground">
                        You have not posted any jobs.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills">
                {isLoadingMyPosts ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                    {myPosts.skills && myPosts.skills.length > 0 ? (
                      myPosts.skills.map((skill: any) => (
                        <SkillPostCard
                          key={skill.id}
                          skill={skill}
                          onView={() => onViewDetails(skill, "skill")}
                          onEdit={() => onEdit(skill, "skill")}
                          onDelete={() => handleDeletePost(skill.id, "skill")}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-muted-foreground">
                        You have not posted any skills.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="materials">
                {isLoadingMyPosts ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                    {myPosts.materials && myPosts.materials.length > 0 ? (
                      myPosts.materials.map((material: any) => (
                        <MaterialPostCard
                          key={material.id}
                          material={material}
                          onView={() => onViewDetails(material, "material")}
                          onEdit={() => onEdit(material, "material")}
                          onDelete={() =>
                            handleDeletePost(material.id, "material")
                          }
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-muted-foreground">
                        You have not posted any skills.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
