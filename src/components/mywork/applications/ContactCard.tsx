
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ContactCardProps {
  contact: any;
  type: 'skill' | 'material';
  onViewDetails: (item: any, type: string) => void;
}

/**
 * Card component for displaying skill or material contacts
 */
export const ContactCard: React.FC<ContactCardProps> = ({ contact, type, onViewDetails }) => (
  <Card key={contact.id} className="h-full flex flex-col">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            {type === 'skill' ? contact.skill_name : contact.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {type === 'skill' ? contact.provider_name : contact.seller_name}
          </p>
        </div>
        <Badge variant={
          contact.status === 'Agreement Reached' ? 'secondary' : 
          contact.status === 'Declined' ? 'destructive' : 
          'outline'
        }>
          {contact.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-muted-foreground line-clamp-2">
        {contact.message?.substring(0, 100)}...
      </p>
      <p className="mt-2 font-medium text-emerald-600">
        {type === 'skill' ? contact.pricing : contact.price}
      </p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <span className="text-sm text-muted-foreground">
        Contacted: {new Date(contact.created_at).toLocaleDateString()}
      </span>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onViewDetails(contact, 'contact')}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </CardFooter>
  </Card>
);
