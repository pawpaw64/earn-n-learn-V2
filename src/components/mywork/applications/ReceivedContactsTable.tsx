
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
  onCreateWork?: (id: number, type: string) => void;
}

/**
 * Table component for displaying contacts received for user's skills or materials
 */
export const ReceivedContactsTable: React.FC<ReceivedContactsTableProps> = ({
  contacts,
  type,
  isLoading,
  onViewDetails,
  onStatusChange,
  onCreateWork
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No {type === 'skill' ? 'skill' : 'material'} contacts received
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Agreement Reached':
        return 'bg-green-100 text-green-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      case 'Responded':
        return 'bg-blue-100 text-blue-800';
      case 'In Discussion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateWorkClick = (contact: any) => {
    if (onCreateWork) {
      onCreateWork(
        contact.id,
        type === 'skill' ? 'skill_contact' : 'material_contact'
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>{type === 'skill' ? 'Skill' : 'Material'}</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="hidden md:table-cell">
                {new Date(contact.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeVariant(contact.status)}>
                  {contact.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(contact, 'contact')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {/* Show accept/decline only for new contacts */}
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
                  
                  {/* Show create work button for responded or in discussion status */}
                  {(contact.status === 'Responded' || contact.status === 'In Discussion') && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600"
                      onClick={() => handleCreateWorkClick(contact)}
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
