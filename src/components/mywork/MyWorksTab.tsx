
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyWorks, fetchProviderWorks } from "@/services/works";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { WorksHeader } from "./works/WorksHeader";
import { WorksGrid } from "./works/WorksGrid";
import { WorkType } from "@/types/marketplace";

interface MyWorksTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<boolean>;
}

/**
 * Main component for the My Works tab
 * Handles data fetching and displaying work items
 */
export function MyWorksTab({ onViewDetails, onStatusChange }: MyWorksTabProps) {
  // Fetch works data with React Query
  const { 
    data: works = [], 
    isLoading: isLoadingWorks
  } = useQuery({
    queryKey: ['myWorks'],
    queryFn: fetchProviderWorks
  });

  // Ensure works is always an array
  const worksArray = Array.isArray(works) ? works : [];

  // Map the works to the expected format for WorksGrid
  const formattedWorks = worksArray.map((work: WorkType) => ({
    id: work.id,
    title: work.job_title || work.skill_name || work.material_title || 'Unnamed Work',
    clientName: work.client_name || 'Unknown Client',
    clientAvatar: work.client_avatar,
    status: work.status,
    startDate: work.start_date,
    endDate: work.end_date,
    payment: work.job_payment || work.skill_pricing || work.material_price,
    description: work.notes || work.job_description || work.skill_description || work.material_description,
    type: 'work',
    ...work
  }));

  // Show loading state while fetching data
  if (isLoadingWorks) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <WorksHeader />
      <WorksGrid 
        works={formattedWorks}
        onViewDetails={onViewDetails}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
