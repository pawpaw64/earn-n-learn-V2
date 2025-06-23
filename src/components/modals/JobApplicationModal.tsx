
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
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { JobType } from "@/types/marketplace";
import { submitJobApplication } from "@/services/applications";
import { fetchUserProfile } from "@/services/profile";

interface JobApplicationModalProps {
  job: JobType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobApplicationModal = ({ job, isOpen, onOpenChange }: JobApplicationModalProps) => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Fetch user profile on modal open
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isOpen) {
        setIsLoadingProfile(true);
        try {
          const profileData = await fetchUserProfile();
          if (profileData && profileData.user) {
            setName(profileData.user.name || "");
            setEmail(profileData.user.email || "");
            setPhone(profileData.user.mobile || "");
          } else {
            // Fallback to localStorage if profile fetch fails
            const userName = localStorage.getItem('userName') || "";
            const userEmail = localStorage.getItem('userEmail') || "";
            setName(userName);
            setEmail(userEmail);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to localStorage
          const userName = localStorage.getItem('userName') || "";
          const userEmail = localStorage.getItem('userEmail') || "";
          setName(userName);
          setEmail(userEmail);
        } finally {
          setIsLoadingProfile(false);
        }
        
        // Reset form fields
        setCoverLetter("");
        setResume("");
      }
    };

    loadUserProfile();
  }, [isOpen]);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      toast.error("Please provide a cover letter");
      return;
    }
    
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const applicationData = {
        job_id: job.id,
        cover_letter: coverLetter,
        phone: phone || null,
        resume_url: resume || null
      };
      
      await submitJobApplication(applicationData);
      
      toast.success("Application submitted! The poster will review your application soon.");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting job application:", error);
      toast.error(error.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Apply for: {job.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={isLoadingProfile ? "Loading..." : name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                disabled={isLoadingProfile}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={isLoadingProfile ? "Loading..." : email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isLoadingProfile}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV Link (Optional)</Label>
            <Input 
              id="resume" 
              placeholder="Link to your resume/CV" 
              value={resume} 
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter / Why you're a good fit</Label>
            <Textarea 
              id="coverLetter" 
              placeholder={`Tell ${job.poster || 'the job poster'} why you're interested in this position and what makes you a great candidate.`}
              value={coverLetter} 
              onChange={(e) => setCoverLetter(e.target.value)} 
              className="min-h-[120px]" 
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
              disabled={isSubmitting || isLoadingProfile}
            >
              <Check className="h-4 w-4" /> 
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
