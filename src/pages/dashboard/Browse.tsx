
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchFilters from "@/components/browse/SearchFilters";
import ListingsSection from "@/components/browse/ListingsSection";
import { PostingSection } from "@/components/browse/PostingSection";
import useBrowseData from "@/hooks/useBrowseData";

export default function Browse() {
  const [mainTab, setMainTab] = useState("explore");
  const [postTab, setPostTab] = useState("job");
  
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
        <TabsList className="grid w-full grid-cols-2 mb-6  text-black rounded-lg">
          <TabsTrigger value="explore">Explore Opportunities</TabsTrigger>
          <TabsTrigger value="post">Post Opportunities</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
