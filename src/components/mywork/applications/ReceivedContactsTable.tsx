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
import { Check, X, Eye, UserCheck, MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Group contacts by skill/material
  const itemGroups = contacts.reduce((groups: any, contact: any) => {
    const itemId = type === 'skill' ? contact.skill_id : contact.material_id;
    const itemName = type === 'skill' ? contact.skill_name : contact.title;
    
    if (!groups[itemId]) {
      groups[itemId] = {
        itemId,
        name: itemName,
        contacts: []
      };
    }
    groups[itemId].contacts.push(contact);
    return groups;
  }, {});

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
        return 'secondary';
      case 'Declined':
        return 'destructive';
      case 'Responded':
        return 'default';
      case 'In Discussion':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleContactUser = (userId: number) => {
    navigate(`/dashboard/messages?userId=${userId}`);
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/dashboard/profile/${userId}`);
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
    <div className="space-y-6">
      {Object.values(itemGroups).map((group: any) => (
        <div key={group.itemId} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{group.name}</h3>
            {group.contacts.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(group.contacts[0], type)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {type === 'skill' ? 'Skill Details' : 'Material Details'}
              </Button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.contacts.map((contact: any) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar 
                          className="h-8 w-8 cursor-pointer" 
                          onClick={() => handleViewProfile(contact.user_id)}
                        >
                          <AvatarImage src={contact.contact_avatar} />
                          <AvatarFallback>{contact.contact_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p 
                            className="font-medium cursor-pointer hover:underline" 
                            onClick={() => handleViewProfile(contact.user_id)}
                          >
                            {contact.contact_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{contact.contact_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(contact.status)}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactUser(contact.user_id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact
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
                              <Check className="w-4 h-4 mr-2" />
                              Accept
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
                              <X className="w-4 h-4 mr-2" />
                              Decline
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
                            <UserCheck className="w-4 h-4 mr-2" />
                            Create Work
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};