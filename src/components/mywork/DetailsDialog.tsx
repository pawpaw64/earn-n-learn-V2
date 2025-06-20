
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ActionButtons } from "./details/ActionButtons";

interface DetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  type: string;
  onStatusChange?: (id: number, type: string, status: string) => Promise<boolean>;
}

export function DetailsDialog({
  isOpen,
  onOpenChange,
  item,
  type,
  onStatusChange,
}: DetailsDialogProps) {
  if (!item) return null;

  const getTypeLabel = () => {
    switch (type) {
      case 'job':
        return 'Job Details';
      case 'application':
        return 'Application Details';
      case 'my_application':
        return 'My Application Details';
      case 'contact':
        return 'Contact Details';
      case 'skill_contact':
        return 'Skill Contact Details';
      case 'material_contact':
        return 'Material Contact Details';
      case 'work':
        return 'Work Details';
      default:
        return 'Details';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied':
      case 'pending':
      case 'contact initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'completed':
      case 'agreement reached':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{getTypeLabel()}</span>
            <Badge className={getStatusColor(item.status)}>
              {item.status || 'N/A'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Title/Name */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {item.title || item.skill_name || item.name || 'N/A'}
            </h3>
            {item.subtitle && (
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            )}
          </div>

          {/* Description/Message */}
          {(item.description || item.message) && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {item.description || item.message}
              </p>
            </div>
          )}

          {/* Contact Information */}
          {(item.applicant_name || item.contact_name || item.provider_name || item.seller_name) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Contact Person</h4>
                <p className="text-sm">
                  {item.applicant_name || item.contact_name || item.provider_name || item.seller_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.applicant_email || item.contact_email || item.provider_email || item.seller_email}
                </p>
              </div>
              
              {item.created_at && (
                <div>
                  <h4 className="font-medium mb-2">Date</h4>
                  <p className="text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            {item.payment && (
              <div>
                <h4 className="font-medium mb-2">Payment</h4>
                <p className="text-sm">{item.payment}</p>
              </div>
            )}
            
            {item.pricing && (
              <div>
                <h4 className="font-medium mb-2">Pricing</h4>
                <p className="text-sm">{item.pricing}</p>
              </div>
            )}
            
            {item.price && (
              <div>
                <h4 className="font-medium mb-2">Price</h4>
                <p className="text-sm">{item.price}</p>
              </div>
            )}
            
            {item.location && (
              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <p className="text-sm">{item.location}</p>
              </div>
            )}
            
            {item.availability && (
              <div>
                <h4 className="font-medium mb-2">Availability</h4>
                <p className="text-sm">{item.availability}</p>
              </div>
            )}
            
            {item.conditions && (
              <div>
                <h4 className="font-medium mb-2">Conditions</h4>
                <p className="text-sm">{item.conditions}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <ActionButtons
            type={type}
            item={item}
            onStatusChange={onStatusChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
