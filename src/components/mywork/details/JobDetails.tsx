
import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Renders job details content
 */
export const JobDetails: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Title</p>
          <p>{item.title}</p>
        </div>
        <div>
          <p className="font-semibold">Type</p>
          <p>{item.type}</p>
        </div>
        <div>
          <p className="font-semibold">Payment</p>
          <p>{item.payment}</p>
        </div>
        <div>
          <p className="font-semibold">Status</p>
          <Badge>{item.status}</Badge>
        </div>
        {item.deadline && (
          <div>
            <p className="font-semibold">Deadline</p>
            <p>{new Date(item.deadline).toLocaleDateString()}</p>
          </div>
        )}
        {item.location && (
          <div>
            <p className="font-semibold">Location</p>
            <p>{item.location}</p>
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold">Description</p>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
      {item.requirements && (
        <div>
          <p className="font-semibold">Requirements</p>
          <p className="text-muted-foreground">{item.requirements}</p>
        </div>
      )}
      {item.applicationsCount !== undefined && (
        <div>
          <p className="font-semibold">Applications</p>
          <p>{item.applicationsCount} applicant(s)</p>
        </div>
      )}
    </div>
  );
};
