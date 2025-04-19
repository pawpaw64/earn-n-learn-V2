
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import JobDetailsModal from "@/components/modals/JobDetailsModal";
import JobApplicationForm from "@/components/modals/JobApplicationForm";
import SkillDetailsModal from "@/components/modals/SkillDetailsModal";
import MaterialDetailsModal from "@/components/modals/MaterialDetailsModal";
import SearchFilters from "@/components/browse/SearchFilters";
import ListingsSection from "@/components/browse/ListingsSection";
import PostingSection from "@/components/browse/PostingSection";
import { useBrowseData } from "@/hooks/useBrowseData";

export default function Browse() {
  const [mainTab, setMainTab] = useState("explore");
  const [postTab, setPostTab] = useState("job");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showJobApplication, setShowJobApplication] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);

  const { jobs, skills, materials } = useBrowseData();

  const handleApplyJob = (jobId: number) => {
    setSelectedJob(jobId);
    setShowJobApplication(true);
  };

  const handleViewJobDetails = (jobId: number) => {
    setSelectedJob(jobId);
  };

  const handleContactSkill = (skillId: number) => {
    toast.success("Contact request sent successfully!");
  };

  const handleViewSkillDetails = (skillId: number) => {
    setSelectedSkill(skillId);
  };

  const handleContactMaterial = (materialId: number) => {
    toast.success("Contact request sent to the owner!");
  };

  const handleViewMaterialDetails = (materialId: number) => {
    setSelectedMaterial(materialId);
  };

  const handleApplicationSubmit = () => {
    toast.success("Application submitted successfully!");
    setShowJobApplication(false);
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSkills = skills.filter(skill => 
    skill.skillName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMaterials = materials.filter(material => 
    material.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentJob = jobs.find(job => job.id === selectedJob) || null;
  const currentSkill = skills.find(skill => skill.id === selectedSkill) || null;
  const currentMaterial = materials.find(material => material.id === selectedMaterial) || null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campus Marketplace</h1>
      
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="post">Post</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-6">
          <SearchFilters
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onCategoryChange={setCategoryFilter}
            onSortChange={setSortBy}
          />
          
          <ListingsSection
            jobs={filteredJobs}
            skills={filteredSkills}
            materials={filteredMaterials}
            onApplyJob={handleApplyJob}
            onViewJobDetails={handleViewJobDetails}
            onContactSkill={handleContactSkill}
            onViewSkillDetails={handleViewSkillDetails}
            onContactMaterial={handleContactMaterial}
            onViewMaterialDetails={handleViewMaterialDetails}
          />
        </TabsContent>
        
        <TabsContent value="post">
          <PostingSection postTab={postTab} onPostTabChange={setPostTab} />
        </TabsContent>
      </Tabs>

      {currentJob && (
        <JobDetailsModal
          isOpen={selectedJob !== null && !showJobApplication}
          onClose={() => setSelectedJob(null)}
          onApply={() => setShowJobApplication(true)}
          job={currentJob}
        />
      )}

      {currentJob && (
        <JobApplicationForm
          isOpen={showJobApplication}
          onClose={() => {
            setShowJobApplication(false);
            setSelectedJob(null);
          }}
          onSubmit={handleApplicationSubmit}
          job={currentJob}
        />
      )}

      {currentSkill && (
        <SkillDetailsModal
          isOpen={selectedSkill !== null}
          onClose={() => setSelectedSkill(null)}
          onContact={() => {
            handleContactSkill(currentSkill.id);
            setSelectedSkill(null);
          }}
          skill={currentSkill}
        />
      )}

      {currentMaterial && (
        <MaterialDetailsModal
          isOpen={selectedMaterial !== null}
          onClose={() => setSelectedMaterial(null)}
          onContact={() => {
            handleContactMaterial(currentMaterial.id);
            setSelectedMaterial(null);
          }}
          material={currentMaterial}
        />
      )}
    </div>
  );
}
