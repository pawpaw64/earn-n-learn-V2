
import React, { useState, useEffect } from "react";
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
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { submitSkillContact, submitMaterialContact } from "@/services/contacts";
import { createDirectConversation, sendMessage } from "@/services/messages";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface ContactModalProps {
  recipientName: string;
  recipientId?: number;
  itemName: string; 
  itemId?: number;
  itemType: 'skill' | 'material';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal = ({ 
  recipientName, 
  recipientId,
  itemName, 
  itemId,
  itemType, 
  isOpen, 
  onOpenChange 
}: ContactModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState(""); 
  const [senderEmail, setSenderEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isOpen) {
      const defaultSubject = `Interested in your ${itemName}`;
      const defaultMessage = `Hi ${recipientName},\n\nI'm interested in your ${itemName}. Is this still available? Could we arrange...`;
      
      setSubject(defaultSubject);
      setMessage(defaultMessage);
      
      // Get user info from local storage or state management
      const userName = localStorage.getItem('userName') || "";
      const userEmail = localStorage.getItem('userEmail') || "";
      
      setSenderName(userName);
      setSenderEmail(userEmail);
    }
  }, [isOpen, recipientName, itemName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please provide a message");
      return;
    }
    
    if (!itemId) {
      toast.error("Item ID is required to send a contact message");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const contactData = {
        message: `${subject ? `Subject: ${subject}\n\n` : ''}${message}`,
        skill_id: itemType === 'skill' ? itemId : undefined,
        material_id: itemType === 'material' ? itemId : undefined
      };
      
      // Submit contact based on type
      if (itemType === 'skill') {
        await submitSkillContact({ skill_id: itemId, message: contactData.message });
      } else {
        await submitMaterialContact({ material_id: itemId, message: contactData.message });
      }
      
      // If recipient ID is available, also send a direct message
      if (recipientId) {
        try {
          const conversationResponse = await createDirectConversation(recipientId);
          if (conversationResponse && conversationResponse.conversationId) {
            await sendMessage(
              conversationResponse.conversationId, 
              `[Regarding ${itemType}: ${itemName}]\n${contactData.message}`
            );
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }
        } catch (error) {
          console.error('Failed to send direct message:', error);
          // We don't want to show an error here, as the contact was still submitted
        }
      }
      
      toast.success(`Message sent to ${recipientName}!`);
      onOpenChange(false);
    } catch (error: any) {
      console.error(`Error submitting ${itemType} contact:`, error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMessages = () => {
    if (!recipientId) {
      toast.error("Cannot start direct message - recipient information missing");
      return;
    }
    
    // First create conversation, then navigate
    setIsSubmitting(true);
    createDirectConversation(recipientId)
      .then(result => {
        // Close this modal
        onOpenChange(false);
        
        // Navigate to messages page
        navigate('/dashboard/messages');
        
        // Refresh conversations list
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        
        // Store conversation ID to open in localStorage
        if (result && result.conversationId) {
          localStorage.setItem('openConversationId', String(result.conversationId));
        }
      })
      .catch(error => {
        console.error('Error creating conversation:', error);
        toast.error('Failed to open messages. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
            
            <div className="flex gap-2">
              {recipientId && (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-1"
                  onClick={handleOpenMessages}
                  disabled={isSubmitting}
                >
                  <MessageCircle className="h-4 w-4" /> 
                  Open Messages
                </Button>
              )}
              
              <Button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                disabled={isSubmitting || !itemId}
              >
                <Send className="h-4 w-4" /> Send Message
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
