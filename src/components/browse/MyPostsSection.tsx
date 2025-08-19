import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Calendar, MapPin, DollarSign } from "lucide-react";
import { fetchJobsByUser } from "@/services/jobs";
import { fetchSkillsByUser } from "@/services/skills";
import { fetchMaterialsByUser } from "@/services/materials";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import { toast } from "sonner";

interface MyPostsSectionProps {
  onEdit?: (item: any, type: string) => void;
  onDelete?: (id: number, type: string) => void;
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
      const [jobsData, skillsData, materialsData] = await Promise.all([
        fetchJobsByUser(),
        fetchSkillsByUser(),
        fetchMaterialsByUser()
      ]);
      
      setJobs(jobsData || []);
      setSkills(skillsData || []);
      setMaterials(materialsData || []);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any, type: string) => {
    // Store edit data in localStorage for PostingSection to pick up
    localStorage.setItem("editItem", JSON.stringify(item));
    localStorage.setItem("editType", type);
    onEdit?.(item, type);
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
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(job.id, "job")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(job, "job")}
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
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(skill.id, "skill")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(skill, "skill")}
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
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(material.id, "material")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(material, "material")}
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