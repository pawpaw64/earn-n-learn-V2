
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Contact {
  id: number;
  skill_name?: string;
  material_title?: string;
  title?: string;
  status: string;
  created_at: string;
  contact_name?: string;
  provider_name?: string;
}

interface ContactTableProps {
  contacts: Contact[];
  isLoading: boolean;
  onStatusUpdate: (id: number, type: string, status: string) => Promise<void>;
}

export const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  isLoading,
  onStatusUpdate
}) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">No contacts found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Contact/Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell>{contact.skill_name || contact.material_title || contact.title}</TableCell>
            <TableCell>{contact.contact_name || contact.provider_name}</TableCell>
            <TableCell>
              <Badge variant={contact.status === 'Pending' ? 'secondary' : 'default'}>
                {contact.status}
              </Badge>
            </TableCell>
            <TableCell>{contact.created_at}</TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => onStatusUpdate(contact.id, 'contact', value)}
                defaultValue={contact.status}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
