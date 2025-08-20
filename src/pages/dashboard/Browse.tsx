
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchFilters from "@/components/browse/SearchFilters";
import ListingsSection from "@/components/browse/ListingsSection";
import { PostingSection } from "@/components/browse/PostingSection";
import { MyPostsSection } from "@/components/browse/MyPostsSection";
import useBrowseData from "@/hooks/useBrowseData";
import { useWorkDetails } from "@/hooks/useWorkDetails";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Browse() {
  const [mainTab, setMainTab] = useState("explore");
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

  return (
    <div className="space-y-6 bg-green-50 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold">Campus Marketplace</h1>
      
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
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
              // Store edit data for PostingSection to pick up
              localStorage.setItem("editItem", JSON.stringify(item));
              localStorage.setItem("editType", type);
              // Switch to posting tab and set correct sub-tab
              setMainTab("post");
              setPostTab(type);
            }}
            onDelete={async (id, type) => {
              const success = await handleDelete(id, type);
              if (success) {
                // Refresh the page to update MyPostsSection data
                window.location.reload();
              }
            }}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
