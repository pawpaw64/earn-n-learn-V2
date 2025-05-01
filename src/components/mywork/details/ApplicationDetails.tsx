
import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Renders application details content
 */
export const ApplicationDetails: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Job Title</p>
          <p>{item.title}</p>
        </div>
        <div>
          <p className="font-semibold">Poster</p>
          <p>{item.poster_name || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Type</p>
          <p>{item.type}</p>
        </div>
        <div>
          <p className="font-semibold">Date Applied</p>
          <p>{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Status</p>
          <Badge className={
            item.status === 'Accepted' ? 'bg-green-100 text-green-800' :
            item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }>
            {item.status}
          </Badge>
        </div>
        <div>
          <p className="font-semibold">Payment</p>
          <p>{item.payment || 'Not specified'}</p>
        </div>
      </div>
      <div>
        <p className="font-semibold">Cover Letter</p>
        <p className="text-muted-foreground whitespace-pre-line">{item.cover_letter}</p>
      </div>
      {item.description && (
        <div>
          <p className="font-semibold">Job Description</p>
          <p className="text-muted-foreground">{item.description}</p>
        </div>
      )}
    </div>
  );
};
