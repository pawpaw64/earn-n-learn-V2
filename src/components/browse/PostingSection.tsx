
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostJobForm from "@/components/forms/PostJobForm";
import ShareSkillForm from "@/components/forms/ShareSkillForm";
import ListMaterialForm from "@/components/forms/ListMaterialForm";
import { EditableItemProvider, useEditableItem } from "./EditableItemContext";

interface PostingSectionProps {
  postTab: string;
  setPostTab: (tab: string) => void;
}

const PostingSectionContent: React.FC<PostingSectionProps> = ({ postTab, setPostTab }) => {
  const { editItem, editType } = useEditableItem();
  
  // If we have an edit item, switch to the appropriate tab
  useEffect(() => {
    if (editType) {
      switch (editType) {
        case 'job':
          setPostTab('job');
          break;
        case 'skill':
          setPostTab('skill');
          break;
        case 'material':
          setPostTab('material');
          break;
        default:
          break;
      }
    }
  }, [editType, setPostTab]);
  
  return (
    <Card>
      <Tabs value={postTab} onValueChange={setPostTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="job">
            {editType === 'job' ? 'Edit Job' : 'Post a Job'}
          </TabsTrigger>
          <TabsTrigger value="skill">
            {editType === 'skill' ? 'Edit Skill' : 'Share a Skill'}
          </TabsTrigger>
          <TabsTrigger value="material">
            {editType === 'material' ? 'Edit Material' : 'List a Material'}
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="mt-4">
          <TabsContent value="job">
            {/* Use curly braces to ensure initialData is passed as a prop and not component content */}
            <PostJobForm initialData={editType === 'job' ? editItem : undefined} />
          </TabsContent>
          
          <TabsContent value="skill">
            <ShareSkillForm initialData={editType === 'skill' ? editItem : undefined} />
          </TabsContent>
          
          <TabsContent value="material">
            <ListMaterialForm initialData={editType === 'material' ? editItem : undefined} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

const PostingSection: React.FC<PostingSectionProps> = (props) => {
  return (
    <EditableItemProvider>
      <PostingSectionContent {...props} />
    </EditableItemProvider>
  );
};

export default PostingSection;
