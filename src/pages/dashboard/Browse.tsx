import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchFilters from "@/components/browse/SearchFilters";
import ListingsSection from "@/components/browse/ListingsSection";
import { PostingSection } from "@/components/browse/PostingSection";
import { MyPostsSection } from "@/components/browse/MyPostsSection";
import useBrowseData from "@/hooks/useBrowseData";
import { useWorkDetails } from "@/hooks/useWorkDetails";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard-global.css";

import RecommendationsSection from "@/components/browse/RecommendationsSection";

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
    <div className="dashboard-page-wrapper">
      <div className="dashboard-content-area space-y-6">
        <h1 className="dashboard-header text-3xl font-bold">Campus Marketplace</h1>
        
        <Tabs value={mainTab} onValueChange={setMainTab} className="dashboard-tabs w-full">
          <TabsList className="dashboard-tabs-list user-friendly-tabs cols-3 grid w-full grid-cols-3 mb-8 p-1 bg-gray-50 rounded-xl border shadow-sm">
            <TabsTrigger 
              value="explore" 
              className="dashboard-tabs-trigger user-friendly-tab"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Explore</span>
              <span className="sm:hidden">Browse</span>
            </TabsTrigger>
            <TabsTrigger 
              value="post" 
              className="dashboard-tabs-trigger user-friendly-tab"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Post</span>
              <span className="sm:hidden">Add</span>
            </TabsTrigger>
            <TabsTrigger 
              value="my-posts" 
              className="dashboard-tabs-trigger user-friendly-tab"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">My Posts</span>
              <span className="sm:hidden">Mine</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="space-y-6">
           <RecommendationsSection 
            onApply={(id) => console.log('Apply to job:', id)}
            onContact={(id, type) => console.log('Contact for:', type, id)}
            onViewDetails={handleViewDetails}
          />
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
                handleEdit(item, type);
                setMainTab("post"); // Switch to post tab for editing
              }}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}