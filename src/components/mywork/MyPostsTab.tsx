
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { fetchMyPosts } from "@/services/api";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { PostsHeader } from "./posts/PostsHeader";
import { JobPostsSection } from "./posts/JobPostsSection";
import { SkillPostsSection } from "./posts/SkillPostsSection";
import { MaterialPostsSection } from "./posts/MaterialPostsSection";

interface MyPostsTabProps {
  onViewDetails: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: number, type: string) => void;
}

/**
 * Main component for the My Posts tab
 * Handles data fetching and displays different types of posts
 */
export function MyPostsTab({ 
  onViewDetails, 
  onEdit, 
  onDelete 
}: MyPostsTabProps) {
  // Fetch posts data with React Query
  const { 
    data: posts = { jobs: [], skills: [], materials: [] },
    isLoading: isLoadingPosts,
    isError: isPostsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts
  });

  // Ensure all post arrays are valid arrays
  const safeJobs = Array.isArray(posts?.jobs) ? posts.jobs : [];
  const safeSkills = Array.isArray(posts?.skills) ? posts.skills : [];
  const safeMaterials = Array.isArray(posts?.materials) ? posts.materials : [];

  // Show loading state while fetching data
  if (isLoadingPosts) {
    return <LoadingSkeleton />;
  }

  // Show error state if data fetch failed
  if (isPostsError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load posts. Please try again.
        <Button onClick={() => refetchPosts()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <PostsHeader />

      <div className="space-y-8">
        {/* Jobs Section */}
        <JobPostsSection 
          jobs={safeJobs} 
          onViewDetails={onViewDetails} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />

        {/* Skills Section */}
        <SkillPostsSection 
          skills={safeSkills} 
          onViewDetails={onViewDetails} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />

        {/* Materials Section */}
        <MaterialPostsSection 
          materials={safeMaterials} 
          onViewDetails={onViewDetails} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>
    </>
  );
}
