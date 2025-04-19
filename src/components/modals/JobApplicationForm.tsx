
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  job: {
    id: number;
    title: string;
  };
}

const JobApplicationForm = ({ isOpen, onClose, onSubmit, job }: JobApplicationFormProps) => {
  // Mock user profile data
  const userProfile = {
    name: "John Doe",
    university: "State University",
    program: "Computer Science",
    year: "3rd Year",
    skills: [
      { name: "React", rating: 4 },
      { name: "TypeScript", rating: 3 },
      { name: "UI Design", rating: 4 },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Apply for: {job.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 my-4">
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={userProfile.name} readOnly className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input 
                  id="university" 
                  defaultValue={userProfile.university}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Input 
                  id="program" 
                  defaultValue={userProfile.program}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input 
                  id="year" 
                  defaultValue={userProfile.year}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-letter">Cover Letter</Label>
            <Textarea
              id="cover-letter"
              placeholder="Tell us why you're interested in this position and what makes you a good fit..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input id="portfolio" placeholder="https://your-portfolio.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile</Label>
              <Input id="github" placeholder="https://github.com/yourusername" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-semibold mb-2">Skills Rating</h3>
            <div className="space-y-2">
              {userProfile.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <Label htmlFor={`skill-${index}`} className="flex items-center gap-2">
                    <Checkbox id={`skill-${index}`} defaultChecked />
                    {skill.name}
                  </Label>
                  <Select defaultValue={skill.rating.toString()}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Basic</SelectItem>
                      <SelectItem value="2">2 - Beginner</SelectItem>
                      <SelectItem value="3">3 - Intermediate</SelectItem>
                      <SelectItem value="4">4 - Advanced</SelectItem>
                      <SelectItem value="5">5 - Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select defaultValue="part-time">
              <SelectTrigger id="availability">
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time (10-20 hrs/week)</SelectItem>
                <SelectItem value="weekends">Weekends only</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="share-profile" defaultChecked />
            <Label htmlFor="share-profile" className="text-sm">
              Share my full profile with this job poster
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;
