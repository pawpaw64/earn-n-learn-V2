
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostJobForm from "@/components/forms/PostJobForm";
import ShareSkillForm from "@/components/forms/ShareSkillForm";
import ListMaterialForm from "@/components/forms/ListMaterialForm";

interface PostingSectionProps {
  postTab: string;
  onPostTabChange: (value: string) => void;
}

const PostingSection = ({ postTab, onPostTabChange }: PostingSectionProps) => {
  return (
    <Card>
      <Tabs value={postTab} onValueChange={onPostTabChange}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="job">Post a Job</TabsTrigger>
          <TabsTrigger value="skill">Share a Skill</TabsTrigger>
          <TabsTrigger value="material">List a Material</TabsTrigger>
        </TabsList>
        
        <CardContent className="mt-4">
          <TabsContent value="job">
            <PostJobForm />
          </TabsContent>
          
          <TabsContent value="skill">
            <ShareSkillForm />
          </TabsContent>
          
          <TabsContent value="material">
            <ListMaterialForm />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default PostingSection;
