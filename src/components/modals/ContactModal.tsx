
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
  recipientName: string;
  itemName: string; 
  itemType: 'skill' | 'material';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal = ({ 
  recipientName, 
  itemName, 
  itemType, 
  isOpen, 
  onOpenChange 
}: ContactModalProps) => {
  const defaultSubject = `Interested in your ${itemName}`;
  const defaultMessage = `Hi ${recipientName},\n\nI'm interested in your ${itemName}. Is this still available? Could we arrange...`;
  
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [senderName] = useState("Current User"); // In a real app, this would be filled from user profile
  const [senderEmail] = useState("user@example.com"); // In a real app, this would be filled from user profile

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send this data to your backend
    toast.success(`Message sent to ${recipientName}!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Contact about {itemType === 'skill' ? 'Skill' : 'Material'}: {itemName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input value={senderName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={senderEmail} disabled />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="min-h-[150px]" 
              required
            />
          </div>
          
          <DialogFooter className="flex items-center justify-between sm:justify-between pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
            >
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
