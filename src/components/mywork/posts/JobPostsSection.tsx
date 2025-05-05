
import React from "react";
import { JobPostCard } from "@/components/JobPostCard";
import { JobType } from "@/types/marketplace";

interface JobPostsSectionProps {
  jobs: JobType[];
  onViewDetails: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: number, type: string) => void;
}

/**
 * Section component for displaying job posts
 * Shows all job posts or empty state message
 */
export function JobPostsSection({ jobs, onViewDetails, onEdit, onDelete }: JobPostsSectionProps) {
  return (
    <div>
      <h3 className="text-md font-semibold mb-4">Jobs</h3>
      {jobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
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
  );
}
