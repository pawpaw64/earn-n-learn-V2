import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight, Target } from "lucide-react";
import { recommendationService, RecommendationResponse } from "@/services/recommendations.ts";
import RecommendationCard from "./RecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data: recommendations, isLoading, error } = useQuery<RecommendationResponse>({
    queryKey: ['recommendations'],
    queryFn: recommendationService.getAllRecommendations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleItemAction = (item: any, action: 'apply' | 'contact' | 'view') => {
    const id = item.id;
    const type = item.type;
    
    switch (action) {
      case 'apply':
        onApply?.(id);
        break;
      case 'contact':
        onContact?.(id, type);
        break;
      case 'view':
        onViewDetails?.(id, type);
        break;
    }
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

  if (!isLoading && totalRecommendations === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-8 text-center">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Start Building Your Profile
        </h3>
        <p className="text-gray-600 mb-4">
          Add skills to your profile to get personalized recommendations for jobs, learning opportunities, and resources.
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
                {getTabData(tab).map((recommendation) => (
                  <RecommendationCard
                    key={`${recommendation.type}-${recommendation.id}`}
                    recommendation={recommendation}
                    onApply={() => handleItemAction(recommendation, 'apply')}
                    onContact={() => handleItemAction(recommendation, 'contact')}
                    onViewDetails={() => handleItemAction(recommendation, 'view')}
                  />
                ))}
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
    </div>
  );
};

export default RecommendationsSection;