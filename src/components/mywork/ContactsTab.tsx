
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactTable } from './ContactTable';
import { fetchContacts } from '@/services/mywork';
import { toast } from 'sonner';

interface ContactsTabProps {
  onStatusUpdate: (id: number, type: string, status: string) => Promise<void>;
  refreshTrigger: number;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ onStatusUpdate, refreshTrigger }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [refreshTrigger]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <ContactTable
          contacts={contacts}
          isLoading={isLoading}
          onStatusUpdate={onStatusUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default ContactsTab;
