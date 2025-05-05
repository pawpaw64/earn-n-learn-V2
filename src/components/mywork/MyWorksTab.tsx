
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyWorks } from "@/services/api/api";
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
    queryFn: fetchMyWorks
  });

  // Ensure works is always an array
  const worksArray = Array.isArray(works) ? works : [];

  // Show loading state while fetching data
  if (isLoadingWorks) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <WorksHeader />
      <WorksGrid 
        works={worksArray}
        onViewDetails={onViewDetails}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
