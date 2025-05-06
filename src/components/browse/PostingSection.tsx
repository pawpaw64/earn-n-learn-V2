import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostJobFormWrapper } from "./wrappers/PostJobFormWrapper";
import ShareSkillFormWrapper from "./wrappers/ShareSkillFormWrapper";
import ListMaterialFormWrapper from "./wrappers/ListMaterialFormWrapper";

interface PostingSectionProps {
    className?: string;
}

const PostingSection: React.FC<PostingSectionProps> = ({ className }) => {
    const [activeTab, setActiveTab] = useState("postJob");

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Create a Posting</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="postJob">
                            <Label>Post a Job</Label>
                        </TabsTrigger>
                        <TabsTrigger value="shareSkill">
                            <Label>Share a Skill</Label>
                        </TabsTrigger>
                        <TabsTrigger value="listMaterial">
                            <Label>List Material</Label>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="postJob">
                        <PostJobFormWrapper />
                    </TabsContent>
                    <TabsContent value="shareSkill">
                        <ShareSkillFormWrapper />
                    </TabsContent>
                    <TabsContent value="listMaterial">
                        <ListMaterialFormWrapper />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default PostingSection;
