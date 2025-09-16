import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchFilters from "@/components/browse/SearchFilters";
import ListingsSection from "@/components/browse/ListingsSection";
import { PostingSection } from "@/components/browse/PostingSection";
import { MyPostsSection } from "@/components/browse/MyPostsSection";
import JobDetailsModal from "@/components/modals/JobDetailsModal";
import SkillDetailsModal from "@/components/modals/SkillDetailsModal";
import MaterialDetailsModal from "@/components/modals/MaterialDetailsModal";
import useBrowseData from "@/hooks/useBrowseData";
import { useWorkDetails } from "@/hooks/useWorkDetails";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecommendationsSection from "@/components/browse/RecommendationsSection";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const [mainTab, setMainTab] = useState(urlTab || "explore");

  const [postTab, setPostTab] = useState("job");
  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [detailsType, setDetailsType] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    handleViewDetails,
    handleEdit,
    handleDelete,
  } = useWorkDetails({
    setDetailsItem,
    setDetailsType,
    setIsDetailsOpen,
    navigate,
    isDetailsOpen,
    detailsItem,
  });
  
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    jobs,
    skills,
    materials,
    filteredJobs,
    filteredSkills,
    filteredMaterials
  } = useBrowseData();

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setMainTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Update tab when URL changes
  useEffect(() => {
    if (urlTab && ['explore', 'post', 'my-posts'].includes(urlTab)) {
      setMainTab(urlTab);
    }
  }, [urlTab]);

  return (
         <div className="dashboard-content-area space-y-6">     
      <h1 className="text-3xl font-bold">Campus Marketplace</h1>
      
      <Tabs value={mainTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 text-black rounded-lg">
          <TabsTrigger value="explore">Explore Opportunities</TabsTrigger>
          <TabsTrigger value="post">Post Opportunities</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-6">
          <SearchFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          
          <RecommendationsSection 
            onApply={(id) => console.log('Apply to job:', id)}
            onContact={(id, type) => console.log('Contact for:', type, id)}
            onViewDetails={handleViewDetails}
          />
          
          <ListingsSection 
            jobs={jobs}
            skills={skills}
            materials={materials}
            filteredJobs={filteredJobs}
            filteredSkills={filteredSkills}
            filteredMaterials={filteredMaterials}
          />
        </TabsContent>
        
        <TabsContent value="post" className="space-y-6">
          <PostingSection 
            activePostTab={postTab}
            setActivePostTab={setPostTab}
          />
        </TabsContent>
        
        <TabsContent value="my-posts" className="space-y-6">
          <MyPostsSection 
            onEdit={(item, type) => {
              console.log("Browse onEdit called:", { item, type });
              handleEdit(item, type);
              setMainTab("post"); // Switch to post tab for editing
            }}
            onDelete={(id, type) => {
              console.log("Browse onDelete called:", { id, type });
              return handleDelete(id, type);
            }}
            onViewDetails={(item, type) => {
              console.log("Browse onViewDetails called:", { item, type });
              handleViewDetails(item, type);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Modal for viewing details */}
      {detailsType === 'job' && (
        <JobDetailsModal
          job={detailsItem}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onApply={() => {
            console.log("Cannot apply to own job");
          }}
          showApply={false}
        />
      )}
      
      {detailsType === 'skill' && (
        <SkillDetailsModal
          skill={detailsItem}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onContact={() => {
            // This is for viewing own posts, so no contact action needed
            console.log("Cannot contact yourself");
          }}
        />
      )}
      
      {detailsType === 'material' && (
        <MaterialDetailsModal
          material={detailsItem}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onContact={() => {
            // This is for viewing own posts, so no contact action needed
            console.log("Cannot contact yourself");
          }}
        />
      )}
    </div>
  );
}