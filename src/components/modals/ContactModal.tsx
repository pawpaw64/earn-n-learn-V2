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
import { ArrowLeft, MessageCircle, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { submitSkillContact, submitMaterialContact } from "@/services/contacts";
import { sendMessage } from "@/services/messages";
import { fetchUserProfile } from "@/services/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface ContactModalProps {
  recipientName: string;
  recipientId?: number;
  itemName: string;
  itemId?: number;
  itemType: "skill" | "material";
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
  onOpenChange,
}: ContactModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch user profile on modal open
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isOpen) {
        setIsLoadingProfile(true);
        try {
          const profileData = await fetchUserProfile();
          if (profileData && profileData.user) {
            setSenderName(profileData.user.name || "");
            setSenderEmail(profileData.user.email || "");
          } else {
            // Fallback to localStorage if profile fetch fails
            const userName = localStorage.getItem("userName") || "";
            const userEmail = localStorage.getItem("userEmail") || "";
            setSenderName(userName);
            setSenderEmail(userEmail);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to localStorage
          const userName = localStorage.getItem("userName") || "";
          const userEmail = localStorage.getItem("userEmail") || "";
          setSenderName(userName);
          setSenderEmail(userEmail);
        } finally {
          setIsLoadingProfile(false);
        }

        // Set default values
        const defaultSubject = `Interested in your ${itemName}`;
        const defaultMessage = `Hi ${recipientName},\n\nI'm interested in your ${itemName}. Is this still available? Could we arrange...`;

        setSubject(defaultSubject);
        setMessage(defaultMessage);
        setMessageSent(false);
      }
    };

    loadUserProfile();
  }, [isOpen, recipientName, itemName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please provide a message");
      return;
    }

    if (!senderName.trim() || !senderEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!itemId) {
      toast.error("Item ID is required to send a contact message");
      return;
    }

    try {
      setIsSubmitting(true);

      const fullMessage = `${
        subject ? `Subject: ${subject}\n\n` : ""
      }${message}`;

      // Submit contact based on type
      if (itemType === "skill") {
        await submitSkillContact({ skill_id: itemId, message: fullMessage });
      } else {
        await submitMaterialContact({
          material_id: itemId,
          message: fullMessage,
        });
      }

      // If recipient ID is available, also send a direct message
      if (recipientId) {
        try {
          await sendMessage(recipientId, fullMessage);
          queryClient.invalidateQueries({ queryKey: ["recentChats"] });
        } catch (error) {
          console.error("Failed to send direct message:", error);
        }
      }

      // Show success state
      setMessageSent(true);
      toast.success(`Message sent to ${recipientName}!`, {
        description: "Your message has been delivered successfully.",
        duration: 3000,
      });

      // Auto-open chat after a short delay
      if (recipientId) {
        setTimeout(() => {
          handleOpenMessages();
        }, 1500);
      }
    } catch (error: any) {
      console.error(`Error submitting ${itemType} contact:`, error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMessages = () => {
    if (!recipientId) {
      toast.error(
        "Cannot start direct message - recipient information missing"
      );
      return;
    }

    // Navigate to messages page
    navigate("/dashboard/messages");

    // Set localStorage to auto-open the chat
    localStorage.setItem("openChatWith", String(recipientId));
    localStorage.setItem("openChatType", "direct");

    // Close the modal
    onOpenChange(false);
  };

  const handleClose = () => {
    setMessageSent(false);
    onOpenChange(false);
  };

  if (messageSent) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-green-600">
              Message Sent Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Your message about <strong>{itemName}</strong> has been sent to{" "}
              <strong>{recipientName}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Opening chat window...
            </p>
          </div>

          <DialogFooter className="flex items-center justify-center gap-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>

            {recipientId && (
              <Button
                onClick={handleOpenMessages}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <MessageCircle className="h-4 w-4" />
                Open Chat Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Contact about {itemType === "skill" ? "Skill" : "Material"}:{" "}
            {itemName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Full Name</Label>
              <Input
                id="senderName"
                value={isLoadingProfile ? "Loading..." : senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
                disabled={isLoadingProfile}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email</Label>
              <Input
                id="senderEmail"
                type="email"
                value={isLoadingProfile ? "Loading..." : senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
                disabled={isLoadingProfile}
                placeholder="your.email@example.com"
              />
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
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                disabled={isSubmitting || isLoadingProfile || !itemId}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
