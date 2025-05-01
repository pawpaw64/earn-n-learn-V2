
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { JobPostCard } from "@/components/JobPostCard";
import { SkillPostCard } from "@/components/SkillPostCard";
import { MaterialPostCard } from "@/components/MaterialPostCard";
import { fetchMyPosts } from "@/services/api";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface MyPostsTabProps {
  onViewDetails: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: number, type: string) => void;
}

export function MyPostsTab({ 
  onViewDetails, 
  onEdit, 
  onDelete 
}: MyPostsTabProps) {
  const { 
    data: posts = { jobs: [], skills: [], materials: [] },
    isLoading: isLoadingPosts,
    isError: isPostsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts
  });

  if (isLoadingPosts) {
    return <LoadingSkeleton />;
  }

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My Posts</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <div className="space-y-8">
        {/* Jobs Section */}
        <div>
          <h3 className="text-md font-semibold mb-4">Jobs</h3>
          {posts.jobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.jobs.map((job) => (
                <JobPostCard
                  key={job.id}
                  job={job}
                  onView={() => onViewDetails(job, 'job')}
                  onEdit={() => onEdit(job, 'job')}
                  onDelete={() => onDelete(job.id, 'job')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No jobs posted yet
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="text-md font-semibold mb-4">Skills</h3>
          {posts.skills.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.skills.map((skill) => (
                <SkillPostCard
                  key={skill.id}
                  skill={skill}
                  onView={() => onViewDetails(skill, 'skill')}
                  onEdit={() => onEdit(skill, 'skill')}
                  onDelete={() => onDelete(skill.id, 'skill')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No skills posted yet
            </div>
          )}
        </div>

        {/* Materials Section */}
        <div>
          <h3 className="text-md font-semibold mb-4">Materials</h3>
          {posts.materials.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.materials.map((material) => (
                <MaterialPostCard
                  key={material.id}
                  material={material}
                  onView={() => onViewDetails(material, 'material')}
                  onEdit={() => onEdit(material, 'material')}
                  onDelete={() => onDelete(material.id, 'material')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No materials posted yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}
