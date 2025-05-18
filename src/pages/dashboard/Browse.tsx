
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilters from "@/components/browse/SearchFilters";
import ListingsSection from "@/components/browse/ListingsSection";
import PostingSection from "@/components/browse/PostingSection";
import useBrowseData from "@/hooks/useBrowseData";

export default function Browse() {
  const [activeTab, setActiveTab] = useState("explore");
  const [activeType, setActiveType] = useState("job");
  
  const {
    jobs,
    skills,
    materials,
    totalJobs,
    totalSkills,
    totalMaterials,
    isJobsLoading,
    isSkillsLoading,
    isMaterialsLoading,
    fetchJobs,
    fetchSkills,
    fetchMaterials,
    handleCreateJob,
    handleCreateSkill,
    handleCreateMaterial,
  } = useBrowseData();

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleTypeChange = (value) => {
    setActiveType(value);
  };

  return (
    <div className="space-y-6 p-1 md:p-0">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Browse</h1>
        <p className="text-muted-foreground">
          Find jobs, share skills, list materials, or post your own listings.
        </p>
      </div>

      <Tabs defaultValue="explore" value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="post">Post</TabsTrigger>
          </TabsList>

          {activeTab === "explore" && (
            <div className="hidden md:flex space-x-2">
              <SearchFilters />
            </div>
          )}
        </div>

        {activeTab === "explore" && (
          <div className="md:hidden mt-4">
            <SearchFilters />
          </div>
        )}

        <TabsContent value="explore" className="mt-6">
          <ListingsSection
            jobs={jobs}
            skills={skills}
            materials={materials}
            totalJobs={totalJobs}
            totalSkills={totalSkills}
            totalMaterials={totalMaterials}
            activeType={activeType}
            onTypeChange={handleTypeChange}
            isJobsLoading={isJobsLoading}
            isSkillsLoading={isSkillsLoading}
            isMaterialsLoading={isMaterialsLoading}
            onJobsRefresh={fetchJobs}
            onSkillsRefresh={fetchSkills}
            onMaterialsRefresh={fetchMaterials}
          />
        </TabsContent>

        <TabsContent value="post" className="mt-6">
          <PostingSection
            activeType={activeType}
            onTypeChange={handleTypeChange}
            onCreateJob={handleCreateJob}
            onCreateSkill={handleCreateSkill}
            onCreateMaterial={handleCreateMaterial}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
