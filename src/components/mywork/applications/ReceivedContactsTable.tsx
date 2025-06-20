
import React, { useState } from "react";
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
import { Check, X, Eye, MessageSquare, User, DollarSign } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { EscrowDialog } from "../dialogs/EscrowDialog";
import { createOrFindContactGroup } from "@/services/contacts";
import { toast } from "sonner";

interface ReceivedContactsTableProps {
  contacts: any[];
  isLoading: boolean;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<boolean>;
}

export const ReceivedContactsTable: React.FC<ReceivedContactsTableProps> = ({
  contacts,
  isLoading,
  onViewDetails,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [showEscrowDialog, setShowEscrowDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleAcceptContact = async (contactId: number, contact: any) => {
    try {
      setProcessingId(contactId);
      const contactType = contact.skill_id ? 'skill_contact' : 'material_contact';
      console.log(`[ReceivedContactsTable] Accepting contact ${contactId}`);
      
      const success = await onStatusChange(contactId, contactType, 'Accepted');
      
      if (success) {
        // Create group chat
        const itemName = contact.skill_name || contact.title;
        const itemId = contact.skill_id || contact.material_id;
        const itemType = contact.skill_id ? 'skill' : 'material';
        
        try {
          const { groupId } = await createOrFindContactGroup(
            itemType,
            itemId,
            itemName,
            contact.user_id
          );
          
          // Navigate to messages and open the group
          navigate('/dashboard/messages');
          localStorage.setItem('openChatWith', String(groupId));
          localStorage.setItem('openChatType', 'group');
          
          toast.success('Contact accepted and group chat created!');
        } catch (error) {
          console.error('Failed to create group chat:', error);
          toast.success('Contact accepted!');
        }
        
        // Set up for escrow
        setSelectedContact(contact);
        setShowEscrowDialog(true);
      }
    } catch (error) {
      console.error("Error accepting contact:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectContact = async (contactId: number, contact: any) => {
    try {
      setProcessingId(contactId);
      const contactType = contact.skill_id ? 'skill_contact' : 'material_contact';
      console.log(`[ReceivedContactsTable] Rejecting contact ${contactId}`);
      await onStatusChange(contactId, contactType, 'Rejected');
    } catch (error) {
      console.error("Error rejecting contact:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleContactUser = async (contact: any) => {
    // Create group chat and navigate to messages
    const itemName = contact.skill_name || contact.title;
    const itemId = contact.skill_id || contact.material_id;
    const itemType = contact.skill_id ? 'skill' : 'material';
    
    try {
      const { groupId } = await createOrFindContactGroup(
        itemType,
        itemId,
        itemName,
        contact.user_id
      );
      
      navigate('/dashboard/messages');
      localStorage.setItem('openChatWith', String(groupId));
      localStorage.setItem('openChatType', 'group');
      
      toast.success('Opening chat...');
    } catch (error) {
      console.error('Failed to create/find group chat:', error);
      toast.error('Failed to open chat');
    }
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  const handleSetupEscrow = (contact: any) => {
    setSelectedContact(contact);
    setShowEscrowDialog(true);
  };

  const handleEscrowCreated = () => {
    setSelectedContact(null);
  };

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No contact inquiries received
      </div>
    );
  }

  // Group contacts by type
  const skillContacts = contacts.filter(contact => contact.skill_id);
  const materialContacts = contacts.filter(contact => contact.material_id);

  return (
    <>
      <div className="space-y-6">
        {/* Skill Contacts */}
        {skillContacts.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Skill Inquiries</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inquirer</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skillContacts.map((contact: any) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleViewProfile(contact.user_id)}>
                            <AvatarImage src={contact.contact_avatar} />
                            <AvatarFallback>{contact.contact_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium cursor-pointer hover:underline" onClick={() => handleViewProfile(contact.user_id)}>
                              {contact.contact_name}
                            </p>
                            <p className="text-xs text-muted-foreground">{contact.contact_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contact.skill_name}</p>
                          <p className="text-xs text-muted-foreground">{contact.pricing}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(contact.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          contact.status === 'Accepted' ? 'secondary' : 
                          contact.status === 'Rejected' ? 'destructive' : 
                          'outline'
                        }>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            className="bg-white border border-black text-gray-700 hover:bg-gray-100 hover:text-black px-3 py-1 text-sm rounded-md flex items-center gap-1"
                            size="sm"
                            onClick={() => onViewDetails(contact, 'contact')}
                          >
                            <Eye className="w-4 h-4 mr-1" />View Details
                          </Button>
                          <Button 
                            className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactUser(contact)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />Contact
                          </Button>
                          
                          {contact.status === 'Contact Initiated' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-white border border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                                onClick={() => handleAcceptContact(contact.id, contact)}
                                disabled={processingId === contact.id}
                              >
                                <Check className="w-4 h-4 mr-1"/> {processingId === contact.id ? 'Processing...' : 'Accept'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-white border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                                onClick={() => handleRejectContact(contact.id, contact)}
                                disabled={processingId === contact.id}
                              >
                                <X className="w-4 h-4 mr-1" /> {processingId === contact.id ? 'Processing...' : 'Reject'}
                              </Button>
                            </>
                          )}
                          
                          {contact.status === 'Accepted' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600"
                              onClick={() => handleSetupEscrow(contact)}
                            >
                              <DollarSign className="w-4 h-4 mr-1" /> Set Up Escrow
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
        )}

        {/* Material Contacts */}
        {materialContacts.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Material Inquiries</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inquirer</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialContacts.map((contact: any) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleViewProfile(contact.user_id)}>
                            <AvatarImage src={contact.contact_avatar} />
                            <AvatarFallback>{contact.contact_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium cursor-pointer hover:underline" onClick={() => handleViewProfile(contact.user_id)}>
                              {contact.contact_name}
                            </p>
                            <p className="text-xs text-muted-foreground">{contact.contact_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contact.title}</p>
                          <p className="text-xs text-muted-foreground">{contact.price}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(contact.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          contact.status === 'Accepted' ? 'secondary' : 
                          contact.status === 'Rejected' ? 'destructive' : 
                          'outline'
                        }>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            className="bg-white border border-black text-gray-700 hover:bg-gray-100 hover:text-black px-3 py-1 text-sm rounded-md flex items-center gap-1"
                            size="sm"
                            onClick={() => onViewDetails(contact, 'contact')}
                          >
                            <Eye className="w-4 h-4 mr-1" />View Details
                          </Button>
                          <Button 
                            className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactUser(contact)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />Contact
                          </Button>
                          
                          {contact.status === 'Contact Initiated' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-white border border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                                onClick={() => handleAcceptContact(contact.id, contact)}
                                disabled={processingId === contact.id}
                              >
                                <Check className="w-4 h-4 mr-1"/> {processingId === contact.id ? 'Processing...' : 'Accept'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-white border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                                onClick={() => handleRejectContact(contact.id, contact)}
                                disabled={processingId === contact.id}
                              >
                                <X className="w-4 h-4 mr-1" /> {processingId === contact.id ? 'Processing...' : 'Reject'}
                              </Button>
                            </>
                          )}
                          
                          {contact.status === 'Accepted' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600"
                              onClick={() => handleSetupEscrow(contact)}
                            >
                              <DollarSign className="w-4 h-4 mr-1" /> Set Up Escrow
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
        )}
      </div>
      
      <EscrowDialog
        isOpen={showEscrowDialog}
        onOpenChange={setShowEscrowDialog}
        application={selectedContact}
        onEscrowCreated={handleEscrowCreated}
      />
    </>
  );
};
