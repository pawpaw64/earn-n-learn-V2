import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import JobCard from "@/components/JobCard";
import SkillCard from "@/components/SkillCard";
import MaterialCard from "@/components/MaterialCard";
import { toast } from "sonner";
import PostJobForm from "@/components/forms/PostJobForm";
import ShareSkillForm from "@/components/forms/ShareSkillForm";
import ListMaterialForm from "@/components/forms/ListMaterialForm";
import JobDetailsModal from "@/components/modals/JobDetailsModal";
import JobApplicationForm from "@/components/modals/JobApplicationForm";
import SkillDetailsModal from "@/components/modals/SkillDetailsModal";
import MaterialDetailsModal from "@/components/modals/MaterialDetailsModal";

export default function Browse() {
  const [mainTab, setMainTab] = useState("explore");
  const [postTab, setPostTab] = useState("job");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showJobApplication, setShowJobApplication] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);

  const jobs = [{
    id: 1,
    title: "Web Developer Needed",
    type: "Remote",
    description: "Looking for a skilled web developer to create a portfolio website. Experience with React required.",
    payment: "$20-30/hr",
    poster: {
      name: "Jane Doe",
      email: "jane@example.com",
      rating: 4.8,
      memberSince: "Jan 2023",
      completedProjects: 15
    },
    deadline: "2024-05-01",
    requiredSkills: ["React", "TypeScript", "UI Design"],
    timeline: "2-3 weeks",
    category: "Web Development"
  }];
  
  const skills = [{
    id: 1,
    name: "Alex Chen",
    skillName: "Python Tutoring",
    pricingType: "paid" as const,
    price: "$15/hr",
    description: "Interactive Python lessons for beginners and intermediate learners. Focus on practical applications and problem-solving.",
    methodology: "Project-based learning with hands-on exercises and real-world examples.",
    prerequisites: ["Basic computer skills", "Eagerness to learn"],
    availability: "Weekday evenings and weekends",
    teacher: {
      name: "Alex Chen",
      email: "alex@example.com",
      rating: 4.9,
      memberSince: "Mar 2023"
    }
  }];
  
  const materials = [{
    id: 1,
    materialName: "Textbooks (Economics 101)",
    condition: "Like New",
    type: "sale" as const,
    price: "$30",
    description: "Complete set of Economics 101 textbooks, includes study guides. Barely used, no markings or highlights.",
    availability: "Available immediately",
    photos: ["/placeholder.svg", "/placeholder.svg"],
    owner: {
      name: "David Kim",
      email: "david@example.com",
      rating: 4.7,
      memberSince: "Sep 2023"
    }
  }];

  const currentJob = jobs.find(job => job.id === selectedJob) || null;
  const currentSkill = skills.find(skill => skill.id === selectedSkill) || null;
  const currentMaterial = materials.find(material => material.id === selectedMaterial) || null;

  const handleApplyJob = (jobId: number) => {
    setSelectedJob(jobId);
    setShowJobApplication(true);
  };

  const handleViewJobDetails = (jobId: number) => {
    setSelectedJob(jobId);
  };

  const handleContactSkill = (skillId: number) => {
    toast.success("Contact request sent successfully!");
  };

  const handleViewSkillDetails = (skillId: number) => {
    setSelectedSkill(skillId);
  };

  const handleContactMaterial = (materialId: number) => {
    toast.success("Contact request sent to the owner!");
  };

  const handleViewMaterialDetails = (materialId: number) => {
    setSelectedMaterial(materialId);
  };

  const handleApplicationSubmit = () => {
    toast.success("Application submitted successfully!");
    setShowJobApplication(false);
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSkills = skills.filter(skill => 
    skill.skillName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMaterials = materials.filter(material => 
    material.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campus Marketplace</h1>
      
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="explore">Explore </TabsTrigger>
          <TabsTrigger value="post">Post </TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search opportunities..." 
                className="pl-10" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  title={job.title} 
                  type={job.type} 
                  description={job.description} 
                  payment={job.payment} 
                  onApply={() => handleApplyJob(job.id)} 
                  onViewDetails={() => handleViewJobDetails(job.id)} 
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map(skill => (
                <SkillCard 
                  key={skill.id} 
                  name={skill.name} 
                  skill={skill.skillName} 
                  pricing={skill.pricingType} 
                  price={skill.price} 
                  description={skill.description} 
                  methodology={skill.methodology} 
                  prerequisites={skill.prerequisites} 
                  availability={skill.availability} 
                  onContact={() => handleContactSkill(skill.id)} 
                  onViewDetails={() => handleViewSkillDetails(skill.id)} 
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold">Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map(material => (
                <MaterialCard 
                  key={material.id} 
                  name={material.name} 
                  material={material.materialName} 
                  condition={material.condition} 
                  price={material.price} 
                  availability={material.availability} 
                  onContact={() => handleContactMaterial(material.id)} 
                  onViewDetails={() => handleViewMaterialDetails(material.id)} 
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="post" className="space-y-6">
          <Card>
            <Tabs value={postTab} onValueChange={setPostTab}>
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
        </TabsContent>
      </Tabs>

      {currentJob && (
        <JobDetailsModal
          isOpen={selectedJob !== null && !showJobApplication}
          onClose={() => setSelectedJob(null)}
          onApply={() => setShowJobApplication(true)}
          job={currentJob}
        />
      )}

      {currentJob && (
        <JobApplicationForm
          isOpen={showJobApplication}
          onClose={() => {
            setShowJobApplication(false);
            setSelectedJob(null);
          }}
          onSubmit={handleApplicationSubmit}
          job={currentJob}
        />
      )}

      {currentSkill && (
        <SkillDetailsModal
          isOpen={selectedSkill !== null}
          onClose={() => setSelectedSkill(null)}
          onContact={() => {
            handleContactSkill(currentSkill.id);
            setSelectedSkill(null);
          }}
          skill={currentSkill}
        />
      )}

      {currentMaterial && (
        <MaterialDetailsModal
          isOpen={selectedMaterial !== null}
          onClose={() => setSelectedMaterial(null)}
          onContact={() => {
            handleContactMaterial(currentMaterial.id);
            setSelectedMaterial(null);
          }}
          material={currentMaterial}
        />
      )}
    </div>
  );
}
