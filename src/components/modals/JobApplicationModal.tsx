
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
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { JobType } from "@/types/marketplace";

interface JobApplicationModalProps {
  job: JobType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobApplicationModal = ({ job, isOpen, onOpenChange }: JobApplicationModalProps) => {
  const [name, setName] = useState("Current User"); // In a real app, this would be filled from user profile
  const [email, setEmail] = useState("user@example.com"); // In a real app, this would be filled from user profile
  const [phone, setPhone] = useState(""); 
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send this data to your backend
    toast.success("Application submitted! The poster will contact you soon.");
    onOpenChange(false);
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
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV Link (optional)</Label>
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
              placeholder={`Tell ${job.poster} why you're interested in this position and what makes you a great candidate.`}
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
            >
              <Check className="h-4 w-4" /> Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
