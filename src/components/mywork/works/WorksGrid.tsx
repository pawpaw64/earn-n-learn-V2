
import React from "react";
import { WorkCard } from "./WorkCard";

interface WorkItem {
  id: number;
  title: string;
  company?: string;
  description?: string;
  payment?: string;
  status: string;
  startDate: string;
  endDate?: string;
  [key: string]: any;
}

interface WorksGridProps {
  works: WorkItem[];
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

/**
 * Grid component for displaying multiple work cards
 * Shows a message when no works are available
 */
export function WorksGrid({ works, onViewDetails, onStatusChange }: WorksGridProps) {
  if (works.length === 0) {
    return (
      <div className="col-span-2 text-center py-10 text-muted-foreground">
        No works found
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {works.map((work) => (
        <WorkCard
          key={work.id}
          work={work}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
