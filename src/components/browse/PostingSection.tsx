
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostJobFormWrapper } from "./wrappers/PostJobFormWrapper";
import { ShareSkillFormWrapper } from "./wrappers/ShareSkillFormWrapper";
import { ListMaterialFormWrapper } from "./wrappers/ListMaterialFormWrapper";

interface PostingSectionProps {
  activePostTab: string;
  setActivePostTab: (value: string) => void;
}

/**
 * Section for posting new listings (jobs, skills, materials)
 */
export function PostingSection({ activePostTab, setActivePostTab }: PostingSectionProps) {
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    // Check for edit data in localStorage
    const editItem = localStorage.getItem("editItem");
    const editType = localStorage.getItem("editType");
    
    if (editItem && editType) {
      const parsedItem = JSON.parse(editItem);
      setInitialData(parsedItem);
      
      // Set the active tab based on the edit type
      setActivePostTab(editType);
      
      // Clear localStorage after loading data
      localStorage.removeItem("editItem");
      localStorage.removeItem("editType");
    }
  }, [setActivePostTab]);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white border border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle>Post a Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activePostTab} onValueChange={setActivePostTab}>
          <TabsList className="user-friendly-tabs cols-3 grid w-full grid-cols-3 p-1 bg-gray-50 rounded-xl border shadow-sm mb-6">
            <TabsTrigger value="job" className="user-friendly-tab">
              💼 Post Job
            </TabsTrigger>
            <TabsTrigger value="skill" className="user-friendly-tab">
              🎯 Share Skill
            </TabsTrigger>
            <TabsTrigger value="material" className="user-friendly-tab">
              📚 List Material
            </TabsTrigger>
          </TabsList>
          <TabsContent value="job">
            <PostJobFormWrapper initialData={initialData} />
          </TabsContent>
          <TabsContent value="skill">
            <ShareSkillFormWrapper initialData={initialData} />
          </TabsContent>
          <TabsContent value="material">
            <ListMaterialFormWrapper initialData={initialData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
