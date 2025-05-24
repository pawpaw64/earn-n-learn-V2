
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContactCardProps {
  contact: any;
  type: string;
  onViewDetails: (item: any, type: string) => void;
}

/**
 * Enhanced card component for displaying skill and material inquiries
 * Styled similarly to the explore cards for consistency
 */
export const ContactCard: React.FC<ContactCardProps> = ({ contact, type, onViewDetails }) => {
  // Format the date for better readability
  const formattedDate = contact.created_at 
    ? formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })
    : 'Unknown date';
  
  // Determine title based on type
  const title = type === 'skill' 
    ? (contact.skill_name || 'Skill Inquiry') 
    : (contact.title || 'Material Inquiry');
  
  // Determine price/rate based on type
  const pricing = type === 'skill' 
    ? (contact.pricing || 'Rate not specified')
    : (contact.price || 'Price not specified');
  
  // Determine the status badge variant
  const getBadgeVariant = (status: string) => {
    switch(status) {
      case 'Agreement Reached': return 'bg-green-100 text-green-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      case 'In Discussion': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {type === 'skill' ? contact.provider_name : contact.seller_name}
            </p>
          </div>
          <Badge className={getBadgeVariant(contact.status)}>
            {contact.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow py-4">
        {/* Message preview */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {contact.message?.substring(0, 150)}...
          </p>
        </div>
        
        {/* Information Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {/* Type Badge */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs py-0 h-5">
              {type === 'skill' ? 'Skill' : 'Material'}
            </Badge>
          </div>
          
          {/* Price/Rate */}
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
            {pricing}
          </div>
          
          {/* Date sent */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground col-span-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Sent: {formattedDate}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex justify-between border-t bg-gray-50">
        <Button 
          variant="outline" 
          size="sm"
             className="bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-black w-full xs:w-auto flex items-center gap-1"
          onClick={() => onViewDetails(contact, 'contact')}
        >
          <Eye className="w-3.5 h-3.5" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
