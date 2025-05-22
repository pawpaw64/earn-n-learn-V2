
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviderWorks } from "@/services/works";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { WorksHeader } from "./works/WorksHeader";
import { WorksGrid } from "./works/WorksGrid";

interface MyWorksTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
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

  // Transform the data from the backend format to the format expected by the WorksGrid component
  const transformedWorks = React.useMemo(() => {
    return works.map((work: any) => ({
      id: work.id,
      title: work.title || work.skill_name || "Untitled Work",
      type: work.type || "job",
      status: work.status || "Active",
      payment: work.payment || work.pricing || work.price || "Not specified",
      description: work.description || "",
      startDate: work.created_at,
      endDate: work.end_date,
      client: {
        name: work.client_name || work.provider_name || "Unknown",
        avatar: work.client_avatar || work.provider_avatar
      },
      // Include all original fields for reference
      ...work
    }));
  }, [works]);

  // Show loading state while fetching data
  if (isLoadingWorks) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <WorksHeader />
      <WorksGrid 
        works={transformedWorks}
        onViewDetails={onViewDetails}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
