import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Calendar, MapPin, DollarSign } from "lucide-react";
import { fetchMyPosts } from "@/services"; // Import the working function
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import { toast } from "sonner";

interface MyPostsSectionProps {
  onEdit?: (item: any, type: string) => void;
  onDelete?: (id: number, type: string) => Promise<boolean>;
  onViewDetails?: (item: any, type: string) => void;
}

export function MyPostsSection({ onEdit, onDelete, onViewDetails }: MyPostsSectionProps) {
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    setLoading(true);
    try {
      const myPostsData = await fetchMyPosts();
      
      // Use the exact same pattern from ApplicationsTab
      setJobs(Array.isArray(myPostsData?.jobs) ? myPostsData.jobs : []);
      setSkills(Array.isArray(myPostsData?.skills) ? myPostsData.skills : []);
      setMaterials(Array.isArray(myPostsData?.materials) ? myPostsData.materials : []);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load your posts");
      setJobs([]);
      setSkills([]);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any, type: string) => {
    // Store edit data for PostingSection to pick up
    localStorage.setItem("editItem", JSON.stringify(item));
    localStorage.setItem("editType", type);
    
    // Call the parent's onEdit handler if provided
    if (onEdit) {
      onEdit(item, type);
    } else {
      console.log("Edit clicked:", { item, type });
      toast.info("Edit functionality would be triggered here");
    }
  };

  const handleDeletePost = async (id: number, type: string) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete this ${type} post?`)) {
      return;
    }

    try {
      let success = false;
      
      // Call the parent's onDelete handler if provided
      if (onDelete) {
        success = await onDelete(id, type);
      } else {
        // Fallback behavior if no onDelete handler provided
        console.log("Delete clicked:", { id, type });
        toast.info("Delete functionality would be triggered here");
        success = true; // Simulate success for demo
      }

      if (success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} post deleted successfully`);
        // Refetch posts after successful deletion
        loadMyPosts();
      } else {
        toast.error(`Failed to delete ${type} post`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    }
  };

  const handleViewDetails = (item: any, type: string) => {
    // Call the parent's onViewDetails handler if provided
    if (onViewDetails) {
      onViewDetails(item, type);
    } else {
      console.log("View details clicked:", { item, type });
      toast.info("View details functionality would be triggered here");
      
      // You could implement a modal or other UI to show details
      // For now, let's just show an alert with basic info
      alert(`${type.toUpperCase()} Details:\n${JSON.stringify(item, null, 2)}`);
    }
  };

  const JobCard = ({ job }: { job: JobType }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <Badge variant="outline" className="mt-2">{job.type}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(job, "job")}
              title="Edit job post"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeletePost(job.id, "job")}
              title="Delete job post"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(job, "job")}
              title="View job details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {job.payment}
          </div>
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(job.deadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const SkillCard = ({ skill }: { skill: SkillType }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{skill.skill_name || skill.name}</CardTitle>
            <Badge variant="outline" className="mt-2">{skill.experienceLevel || "Beginner"}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(skill, "skill")}
              title="Edit skill post"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeletePost(skill.id, "skill")}
              title="Delete skill post"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(skill, "skill")}
              title="View skill details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{skill.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {skill.pricing}
          </div>
          {skill.availability && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {skill.availability}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MaterialCard = ({ material }: { material: MaterialType }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{material.title || material.name}</CardTitle>
            <Badge variant="outline" className="mt-2">{material.condition || material.conditions}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(material, "material")}
              title="Edit material post"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeletePost(material.id, "material")}
              title="Delete material post"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(material, "material")}
              title="View material details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{material.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {material.price}
          </div>
          {material.availability && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {material.availability}
            </div>
          )}
          {material.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {material.location}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading your posts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle>My Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="skills">Skills ({skills.length})</TabsTrigger>
            <TabsTrigger value="materials">Materials ({materials.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="space-y-4 mt-6">
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No jobs posted yet. Switch to "Post Opportunities" to create your first job listing.
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4 mt-6">
            {skills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No skills shared yet. Switch to "Post Opportunities" to share your first skill.
              </div>
            ) : (
              <div className="grid gap-4">
                {skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4 mt-6">
            {materials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No materials listed yet. Switch to "Post Opportunities" to list your first material.
              </div>
            ) : (
              <div className="grid gap-4">
                {materials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}