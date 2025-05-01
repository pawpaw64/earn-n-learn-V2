
import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Renders invoice details content
 */
export const InvoiceDetails: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Invoice Number</p>
          <p>{item.invoiceNumber}</p>
        </div>
        <div>
          <p className="font-semibold">Title</p>
          <p>{item.title}</p>
        </div>
        <div>
          <p className="font-semibold">Client</p>
          <p>{item.client}</p>
        </div>
        <div>
          <p className="font-semibold">Amount</p>
          <p className="font-medium text-emerald-600">{item.amount}</p>
        </div>
        <div>
          <p className="font-semibold">Issue Date</p>
          <p>{item.date}</p>
        </div>
        <div>
          <p className="font-semibold">Due Date</p>
          <p>{item.dueDate}</p>
        </div>
        <div>
          <p className="font-semibold">Status</p>
          <Badge className={
            item.status === 'Paid' ? 'bg-green-100 text-green-800' :
            item.status === 'Overdue' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }>
            {item.status}
          </Badge>
        </div>
      </div>
    </div>
  );
};
