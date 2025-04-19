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

export default function Browse() {
  const [mainTab, setMainTab] = useState("explore");
  const [postTab, setPostTab] = useState("job");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Web Developer Needed",
      type: "Remote",
      description: "Looking for a skilled web developer to create a portfolio website. Experience with React required.",
      payment: "$20-30/hr",
      poster: "Jane Doe"
    },
    {
      id: 2,
      title: "Campus Tour Guide",
      type: "On-campus",
      description: "Seeking friendly students to lead campus tours for prospective students and their families.",
      payment: "$15/hr",
      poster: "University Events Team"
    },
    {
      id: 3,
      title: "Logo Designer",
      type: "Freelance",
      description: "Need a creative designer to create a logo for a new student club.",
      payment: "$50 flat rate",
      poster: "Student Club Association"
    }
  ];

  const skills = [
    {
      id: 1,
      name: "Alex Chen",
      skill: "Python Tutoring",
      pricing: "$15/hr or skill exchange",
    },
    {
      id: 2,
      name: "Maya Johnson",
      skill: "Graphic Design",
      pricing: "$20/hr",
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      skill: "Spanish Lessons",
      pricing: "Free",
    }
  ];

  const materials = [
    {
      id: 1,
      name: "David Kim",
      material: "Textbooks (Economics 101)",
      condition: "Like New",
      price: "$30",
      availability: "For Sale",
    },
    {
      id: 2,
      name: "Sarah Williams",
      material: "DSLR Camera",
      condition: "Good",
      price: "$15/day",
      availability: "For Rent",
    },
    {
      id: 3,
      name: "Jamal Thompson",
      material: "Chemistry Lab Equipment",
      condition: "Excellent",
      price: "Free",
      availability: "To Borrow",
    }
  ];

  const handleApplyJob = (jobId) => {
    toast.success("Application submitted! The poster will contact you soon.");
  };

  const handleViewJobDetails = (jobId) => {
    toast.info("Opening job details...");
    // You can implement a modal or navigation to a details page here
  };

  const handleContactSkill = (skillId) => {
    toast.success("Contact request sent successfully!");
  };

  const handleViewSkillDetails = (skillId) => {
    toast.info("Opening skill details...");
    // You can implement a modal or navigation to a details page here
  };

  const handleContactMaterial = (materialId) => {
    toast.success("Contact request sent to the owner!");
  };

  const handleViewMaterialDetails = (materialId) => {
    toast.info("Opening material details...");
    // You can implement a modal or navigation to a details page here
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSkills = skills.filter(skill => 
    skill.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = materials.filter(material => 
    material.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campus Marketplace</h1>
      
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="explore">Explore Opportunities</TabsTrigger>
          <TabsTrigger value="post">Post Opportunities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search opportunities..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  skill={skill.skill}
                  pricing={skill.pricing}
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
                  material={material.material}
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
    </div>
  );
}
