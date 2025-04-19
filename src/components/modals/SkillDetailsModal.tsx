
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SkillDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
  skill: {
    id: number;
    name: string;
    skill: string;
    pricing: string;
    // Mock additional details
    description?: string;
    methodology?: string;
    prerequisites?: string[];
    userProfile?: {
      rating: number;
      memberSince: string;
    };
  };
}

const SkillDetailsModal = ({ isOpen, onClose, onContact, skill }: SkillDetailsModalProps) => {
  // Mock data for fields not in original skill object
  const mockData = {
    description: skill.description || "Interactive skills training with personalized feedback and hands-on projects. Perfect for beginners and intermediate learners looking to advance their career.",
    methodology: skill.methodology || "My teaching approach focuses on practical, project-based learning with real-world examples. I provide detailed feedback on your work and customize the curriculum to your learning pace.",
    prerequisites: skill.prerequisites || ["Basic computer skills", "Eagerness to learn"],
    userProfile: skill.userProfile || {
      rating: 4.9,
      memberSince: "Jan 2022",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{skill.skill}</DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              Skill
            </Badge>
            <span className="text-emerald-600 font-medium">{skill.pricing}</span>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Offered by {skill.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{mockData.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Teaching Methodology</h3>
            <p className="text-gray-700">{mockData.methodology}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
            <ul className="list-disc pl-5 space-y-1">
              {mockData.prerequisites.map((prereq, index) => (
                <li key={index} className="text-gray-700">{prereq}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Teacher Profile</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(mockData.userProfile.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{mockData.userProfile.rating}</span>
            </div>
            <p className="text-sm text-gray-600">
              Member since: {mockData.userProfile.memberSince}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onContact} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Contact Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDetailsModal;
