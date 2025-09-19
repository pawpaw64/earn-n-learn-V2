import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight, Target } from "lucide-react";
import { recommendationService, RecommendationResponse } from "@/services/recommendations.ts";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import JobCard from "@/components/JobCard";
import SkillCard from "@/components/SkillCard";
import MaterialCard from "@/components/MaterialCard";
import JobDetailsModal from "@/components/modals/JobDetailsModal";
import SkillDetailsModal from "@/components/modals/SkillDetailsModal";
import MaterialDetailsModal from "@/components/modals/MaterialDetailsModal";
import JobApplicationModal from "@/components/modals/JobApplicationModal";
import ContactModal from "@/components/modals/ContactModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import EnhancedJobCard from "../cards/EnhancedJobCard";
import EnhancedSkillCard from "../cards/EnhancedSkillCard";
import EnhancedListingsSection from "./EnhancedListingsSection";
import EnhancedMaterialCard from "../cards/EnhancedMaterialCard";

interface RecommendationsSectionProps {
  onApply?: (id: number) => void;
  onContact?: (id: number, type: string) => void;
  onViewDetails?: (id: number, type: string) => void;
}

const RecommendationsSection = ({
  onApply,
  onContact,
  onViewDetails,
}: RecommendationsSectionProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Modal states
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [skillDetailsOpen, setSkillDetailsOpen] = useState(false);
  const [materialDetailsOpen, setMaterialDetailsOpen] = useState(false);
  
  const [jobApplicationOpen, setJobApplicationOpen] = useState(false);
  const [skillContactOpen, setSkillContactOpen] = useState(false);
  const [materialContactOpen, setMaterialContactOpen] = useState(false);

  const { data: recommendations, isLoading, error } = useQuery<RecommendationResponse>({
    queryKey: ['recommendations'],
    queryFn: recommendationService.getAllRecommendations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Job handlers
  const handleViewJobDetails = (recommendation: any) => {
    setSelectedJob(recommendation);
    setJobDetailsOpen(true);
  };

  const handleApplyJob = (recommendation: any) => {
    setJobDetailsOpen(false);
    setSelectedJob(recommendation);
    setJobApplicationOpen(true);
  };

  // Skill handlers
  const handleViewSkillDetails = (recommendation: any) => {
    setSelectedSkill(recommendation);
    setSkillDetailsOpen(true);
  };

  const handleContactSkill = (recommendation: any) => {
    setSkillDetailsOpen(false);
    setSelectedSkill(recommendation);
    setSkillContactOpen(true);
  };

  // Material handlers  
  const handleViewMaterialDetails = (recommendation: any) => {
    setSelectedMaterial(recommendation);
    setMaterialDetailsOpen(true);
  };

  const handleContactMaterial = (recommendation: any) => {
    setMaterialDetailsOpen(false);
    setSelectedMaterial(recommendation);
    setMaterialContactOpen(true);
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-4" />
          <Skeleton className="h-16 w-full mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getTotalRecommendations = () => {
    if (!recommendations) return 0;
    return recommendations.jobs.length + recommendations.skills.length + recommendations.materials.length;
  };

  const getAllRecommendations = () => {
    if (!recommendations) return [];
    return [
      ...recommendations.jobs,
      ...recommendations.skills,
      ...recommendations.materials
    ].sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const getTabData = (tab: string) => {
    if (!recommendations) return [];
    
    switch (tab) {
      case 'jobs':
        return recommendations.jobs;
      case 'skills':
        return recommendations.skills;
      case 'materials':
        return recommendations.materials;
      default:
        return getAllRecommendations();
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Unable to load recommendations. Please try again later.</p>
      </div>
    );
  }

  const totalRecommendations = getTotalRecommendations();

  if (!isLoading && (totalRecommendations === 0 || recommendations?.profileIncomplete)) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-8 text-center">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Complete Your Profile for Better Recommendations
        </h3>
        <p className="text-gray-600 mb-4">
          Add skills and complete your bio to get personalized recommendations for jobs, learning opportunities, and resources.
        </p>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => window.location.href = '/dashboard/profile'}
        >
          Complete Your Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <Sparkles className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended For You
              </h2>
              <p className="text-gray-600">
                Personalized opportunities based on your skills
              </p>
            </div>
          </div>
          {totalRecommendations > 0 && (
            <Badge variant="secondary" className="bg-white text-emerald-700 font-medium">
              <Target className="w-3 h-3 mr-1" />
              {totalRecommendations} matches
            </Badge>
          )}
        </div>
      </div>

      {/* Recommendations Content */}
      {isLoading ? (
        renderLoadingSkeleton()
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" className="relative">
              All
              {totalRecommendations > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 text-xs">
                  {totalRecommendations}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="jobs" className="relative">
              Jobs
              {recommendations?.jobs.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 text-xs">
                  {recommendations.jobs.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="skills" className="relative">
              Skills
              {recommendations?.skills.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 text-xs">
                  {recommendations.skills.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="materials" className="relative">
              Materials
              {recommendations?.materials.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 text-xs">
                  {recommendations.materials.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {['all', 'jobs', 'skills', 'materials'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTabData(tab).map((recommendation) => {
                  if (recommendation.type === 'job') {
                    const jobData: JobType = {
                      id: recommendation.id,
                      title: recommendation.title || 'Untitled',
                      type: 'General',
                      description: recommendation.description || '',
                      payment: recommendation.payment || 'Not specified',
                      poster: recommendation.poster,
                      posterEmail: recommendation.posterEmail,
                      posterAvatar: recommendation.posterAvatar
                    };
                    return (
                      <EnhancedJobCard 
                        key={`job-${recommendation.id}`}
                        job={jobData}
                        onApply={(jobId) => handleApplyJob(recommendation)}
                        onViewDetails={(jobId) => handleViewJobDetails(recommendation)}
                        onViewPoster={(userId) => navigate(`/dashboard/poster/${userId}`)}
                      />
                    );
                  } else if (recommendation.type === 'skill') {
                    const skillData: SkillType = {
                      id: recommendation.id,
                      skill_name: recommendation.skill || recommendation.skill_name || 'Skill',
                      pricing: recommendation.pricing || 'Not specified',
                      description: recommendation.description,
                      name: recommendation.name,
                      experienceLevel: 'Beginner'
                    };
                    return (
                      <EnhancedSkillCard 
                        key={`skill-${recommendation.id}`}
                        skill={skillData}
                        onContact={(skillId) => handleContactSkill(recommendation)}
                        onViewDetails={(skillId) => handleViewSkillDetails(recommendation)}
                        onViewPoster={(userId) => navigate(`/dashboard/poster/${userId}`)}
                      />
                    );
                  } else if (recommendation.type === 'material') {
                    const materialData: MaterialType = {
                      id: recommendation.id,
                      title: recommendation.material || 'Material',
                      price: recommendation.price || 'Not specified',
                      availability: recommendation.availability || 'Unknown',
                      condition: recommendation.condition || recommendation.conditions,
                      description: recommendation.description,
                      name: recommendation.name,
                      imageUrl: recommendation.imageUrl
                    };
                    return (
                      <EnhancedMaterialCard 
                        key={`material-${recommendation.id}`}
                        material={materialData}
                        onContact={(materialId) => handleContactMaterial(recommendation)}
                        onViewDetails={(materialId) => handleViewMaterialDetails(recommendation)}
                        onViewPoster={(userId) => navigate(`/dashboard/poster/${userId}`)}
                      />
                    );
                  }
                  return null;
                })}
              </div>
              
              {getTabData(tab).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No {tab === 'all' ? '' : tab} recommendations available at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Details Modals */}
      <JobDetailsModal 
        job={selectedJob} 
        isOpen={jobDetailsOpen} 
        onOpenChange={setJobDetailsOpen} 
        onApply={() => selectedJob && handleApplyJob(selectedJob)}
      />
      
      <SkillDetailsModal 
        skill={selectedSkill} 
        isOpen={skillDetailsOpen} 
        onOpenChange={setSkillDetailsOpen} 
        onContact={() => selectedSkill && handleContactSkill(selectedSkill)}
      />
      
      <MaterialDetailsModal 
        material={selectedMaterial} 
        isOpen={materialDetailsOpen} 
        onOpenChange={setMaterialDetailsOpen} 
        onContact={() => selectedMaterial && handleContactMaterial(selectedMaterial)}
      />

      {/* Application/Contact Modals */}
      <JobApplicationModal 
        job={selectedJob} 
        isOpen={jobApplicationOpen} 
        onOpenChange={setJobApplicationOpen} 
      />
      
      {selectedSkill && (
        <ContactModal 
          recipientName={selectedSkill.name || ''}
          itemName={selectedSkill.skill || selectedSkill.skill_name || ''}
          itemId={selectedSkill.id}
          itemType="skill"
          isOpen={skillContactOpen} 
          onOpenChange={setSkillContactOpen} 
        />
      )}
      
      {selectedMaterial && (
        <ContactModal 
          recipientName={selectedMaterial.name || ''}
          itemName={selectedMaterial.material || selectedMaterial.title || ''}
          itemId={selectedMaterial.id}
          itemType="material"
          isOpen={materialContactOpen} 
          onOpenChange={setMaterialContactOpen} 
        />
      )}
    </div>
  );
};

export default RecommendationsSection;