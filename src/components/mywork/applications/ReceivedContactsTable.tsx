
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, UserCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "../LoadingSkeleton";

interface ReceivedContactsTableProps {
  contacts: any[];
  type: 'skill' | 'material';
  isLoading: boolean;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

/**
 * Table component for displaying contacts received for user's skills or materials
 */
export const ReceivedContactsTable: React.FC<ReceivedContactsTableProps> = ({
  contacts,
  type,
  isLoading,
  onViewDetails,
  onStatusChange
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No {type} contacts received
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>{type === 'skill' ? 'Skill' : 'Material'}</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact: any) => (
            <TableRow key={contact.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.contact_avatar} />
                    <AvatarFallback>{contact.contact_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{contact.contact_name}</p>
                    <p className="text-xs text-muted-foreground">{contact.contact_email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium">
                  {type === 'skill' ? contact.skill_name : contact.title}
                </p>
                <p className="text-xs text-muted-foreground">{type === 'skill' ? contact.pricing : contact.price}</p>
              </TableCell>
              <TableCell>
                {new Date(contact.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={
                  contact.status === 'Agreement Reached' ? 'secondary' : 
                  contact.status === 'Declined' ? 'destructive' : 
                  'outline'
                }>
                  {contact.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(contact, 'contact')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {contact.status === 'Contact Initiated' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600"
                        onClick={() => onStatusChange(
                          contact.id, 
                          type === 'skill' ? 'skill_contact' : 'material_contact', 
                          'Responded'
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600"
                        onClick={() => onStatusChange(
                          contact.id, 
                          type === 'skill' ? 'skill_contact' : 'material_contact', 
                          'Declined'
                        )}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {contact.status === 'Responded' || contact.status === 'In Discussion' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600"
                      onClick={() => onViewDetails(contact, 'contact')}
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
