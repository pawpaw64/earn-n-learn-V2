
import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Renders work details content
 */
export const WorkDetails: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Title</p>
          <p>{item.job_title || item.skill_name || item.material_title || item.title}</p>
        </div>
        <div>
          <p className="font-semibold">Type</p>
          <p>{item.job_type || item.type || (item.skill_name ? 'Skill Service' : 'Material')}</p>
        </div>
        <div>
          <p className="font-semibold">Status</p>
          <Badge className={
            item.status === 'Completed' ? 'bg-green-100 text-green-800' :
            item.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
            item.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }>
            {item.status}
          </Badge>
        </div>
        <div>
          <p className="font-semibold">Start Date</p>
          <p>{new Date(item.start_date).toLocaleDateString()}</p>
        </div>
        {item.end_date && (
          <div>
            <p className="font-semibold">End Date</p>
            <p>{new Date(item.end_date).toLocaleDateString()}</p>
          </div>
        )}
        <div>
          <p className="font-semibold">Payment/Price</p>
          <p>{item.job_payment || item.skill_pricing || item.material_price || item.payment}</p>
        </div>
      </div>
      <div>
        <p className="font-semibold">Description</p>
        <p className="text-muted-foreground">{item.job_description || item.skill_description || item.material_description || item.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Provider</p>
          <p>{item.provider_name}</p>
        </div>
        <div>
          <p className="font-semibold">Client</p>
          <p>{item.client_name}</p>
        </div>
      </div>
      {item.notes && (
        <div>
          <p className="font-semibold">Notes</p>
          <p className="text-muted-foreground">{item.notes}</p>
        </div>
      )}
    </div>
  );
};
