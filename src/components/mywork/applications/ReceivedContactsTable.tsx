import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, UserCheck, MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { createOrFindContactGroup } from "@/services/contacts";
import { findGroupByName, sendGroupMessage } from "@/services/messages";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ReceivedContactsTableProps {
  contacts: any[];
  type: "skill" | "material";
  isLoading: boolean;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<void>;
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
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [projectIds, setProjectIds] = useState<Record<number, number>>({});

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Group contacts by skill/material
  const itemGroups = contacts.reduce((groups: any, contact: any) => {
    const itemId = type === "skill" ? contact.skill_id : contact.material_id;
    const itemName = type === "skill" ? contact.skill_name : contact.title;

    if (!groups[itemId]) {
      groups[itemId] = {
        itemId,
        name: itemName,
        contacts: [],
      };
    }
    groups[itemId].contacts.push(contact);
    return groups;
  }, {});

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No {type === "skill" ? "skill" : "material"} contacts received
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Agreement Reached":
        return "secondary";
      case "Declined":
        return "destructive";
      case "Responded":
        return "default";
      case "In Discussion":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleContactUser = async (contact: any) => {
    try {
      const itemName = type === "skill" ? contact.skill_name : contact.title;

      // Try to find existing group first using the new service
      const existingGroup = await findGroupByName(
        `${itemName} - Contact Discussion`
      );

      if (existingGroup) {
        // Navigate to existing group
        navigate("/dashboard/messages");
        localStorage.setItem("openChatWith", String(existingGroup.id));
        localStorage.setItem("openChatType", "group");
        return;
      }

      // Create or find group using the contact service
      const result = await createOrFindContactGroup(
        type,
        type === "skill" ? contact.skill_id : contact.material_id,
        itemName,
        contact.user_id
      );

      if (!result.isNew) {
        // Group already exists, just navigate
        navigate("/dashboard/messages");
        localStorage.setItem("openChatWith", String(result.groupId));
        localStorage.setItem("openChatType", "group");
      } else {
        // New group created, send initial message
        await sendGroupMessage(
          result.groupId,
          `Original contact message: ${contact.message}`
        );

        // Refresh queries
        queryClient.invalidateQueries({ queryKey: ["userGroups"] });
        queryClient.invalidateQueries({ queryKey: ["recentChats"] });

        toast.success("Group chat created successfully!");

        // Navigate to messages and open the group
        navigate("/dashboard/messages");
        localStorage.setItem("openChatWith", String(result.groupId));
        localStorage.setItem("openChatType", "group");
      }
    } catch (error) {
      console.error("Error handling contact user:", error);
      toast.error("Failed to create or find group chat. Please try again.");
    }
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  const handleAcceptContact = async (contact: any, contactType: string) => {
    try {
      // Update contact status first
      const result = await onStatusChange(
        contact.id,
        contactType === "skill" ? "skill_contact" : "material_contact",
        "Responded"
      );

      const itemName = type === "skill" ? contact.skill_name : contact.title;

      // Try to find existing group first
      const existingGroup = await findGroupByName(
        `${itemName} - Contact Discussion`
      );

      let groupId;
      if (existingGroup) {
        groupId = existingGroup.id;
      } else {
        // Create or find group using the contact service
        const result = await createOrFindContactGroup(
          type,
          type === "skill" ? contact.skill_id : contact.material_id,
          itemName,
          contact.user_id
        );
        groupId = result.groupId;
      }

      // Send acceptance message to the group
      const responseMessage = `Hi! I've accepted your inquiry about "${itemName}". Let's discuss further!Original message from ${type} 
      contact:${contact.message}---This conversation started from a ${type} contact inquiry.`;

      await sendGroupMessage(groupId, responseMessage);

      // Refresh message queries
      queryClient.invalidateQueries({ queryKey: ["recentChats"] });
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      queryClient.invalidateQueries({ queryKey: ["skillContacts"] });
      queryClient.invalidateQueries({ queryKey: ["materialContacts"] });

      toast.success("Contact accepted and group chat ready!");

      // Navigate to messages and open the group chat
      navigate("/dashboard/messages");
      localStorage.setItem("openChatWith", String(groupId));
      localStorage.setItem("openChatType", "group");
    } catch (error) {
      console.error("Error accepting contact:", error);
      toast.error("Failed to accept contact. Please try again.");
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-sm shadow-md">
      {Object.values(itemGroups).map((group: any) => (
        <div key={group.itemId} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{group.name}</h3>
            {group.contacts.length > 0 && (
              <Button
                className="bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-black "
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(group.contacts[0], type)}>
                <Eye className="w-4 h-4 mr-2" />
                {type === "skill" ? "Skill Details" : "Material Details"}
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
                          onClick={() => handleViewProfile(contact.user_id)}>
                          <AvatarImage src={contact.contact_avatar} />
                          <AvatarFallback>
                            {contact.contact_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className="font-medium cursor-pointer hover:underline"
                            onClick={() => handleViewProfile(contact.user_id)}>
                            {contact.contact_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contact.contact_email}
                          </p>
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
                          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black px-3 py-1 text-sm rounded-md flex items-center gap-1"
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(contact, "contact")}>
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button
                          className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactUser(contact)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact
                        </Button>

                        {/* Show accept/decline only for new contacts */}
                        {contact.status === "Contact Initiated" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white border border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                              onClick={() => handleAcceptContact(contact, type)}
                              disabled={processingId == contact.id}>
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                              onClick={() =>
                                onStatusChange(
                                  contact.id,
                                  type === "skill"
                                    ? "skill_contact"
                                    : "material_contact",
                                  "Declined"
                                )
                              }>
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </>
                        )}

                        {/* Show status message for responded contacts */}
                        {contact.status === "Responded" && (
                          <div className="text-sm text-green-600 font-medium px-3 py-1">
                            ✓ {type === "skill" ? "Skill" : "Material"} accepted
                          </div>
                        )}
                       { contact.status === "Declined" && (
  <div className="flex items-center text-sm text-red-600 font-medium px-3 py-1  rounded-md">
    <X className="w-4 h-4 mr-1" />
    {type === "skill" ? "Skill" : "Material"}  declined
  </div>
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
