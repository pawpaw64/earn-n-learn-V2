
import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Renders contact details content
 */
export const ContactDetails: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Item</p>
          <p>{item.skill_name || item.title}</p>
        </div>
        <div>
          <p className="font-semibold">Price</p>
          <p>{item.pricing || item.price}</p>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <p>{item.contact_name || item.provider_name || item.seller_name}</p>
        </div>
        <div>
          <p className="font-semibold">Status</p>
          <Badge className={
            item.status === 'Agreement Reached' ? 'bg-green-100 text-green-800' :
            item.status === 'Declined' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }>
            {item.status}
          </Badge>
        </div>
        <div>
          <p className="font-semibold">Date</p>
          <p>{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div>
        <p className="font-semibold">Message</p>
        <p className="text-muted-foreground whitespace-pre-line">{item.message}</p>
      </div>
    </div>
  );
};
