
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
    skillName: string;
    pricingType: "paid" | "free" | "trade";
    price: string;
    description: string;
    availability: string;
    methodology: string;
    prerequisites: string[];
    tradeSkill?: string;
    teacher: {
      name: string;
      email: string;
      rating: number;
      memberSince: string;
    };
  };
}

const SkillDetailsModal = ({ isOpen, onClose, onContact, skill }: SkillDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{skill.skillName}</DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              {skill.pricingType === "free" ? "Free" : 
               skill.pricingType === "trade" ? "Skill Trade" : 
               skill.price}
            </Badge>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Offered by {skill.teacher.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{skill.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Teaching Methodology</h3>
            <p className="text-gray-700">{skill.methodology}</p>
          </div>

          {skill.prerequisites.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc pl-5 space-y-1">
                {skill.prerequisites.map((prereq, index) => (
                  <li key={index} className="text-gray-700">{prereq}</li>
                ))}
              </ul>
            </div>
          )}

          {skill.pricingType === "trade" && skill.tradeSkill && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Looking to Trade For</h3>
              <p className="text-gray-700">{skill.tradeSkill}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Availability</h3>
            <p className="text-gray-700">{skill.availability}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Teacher Profile</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(skill.teacher.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{skill.teacher.rating}</span>
            </div>
            <p className="text-sm text-gray-600">
              Member since: {skill.teacher.memberSince}
            </p>
            <p className="text-sm text-gray-600">
              Contact: {skill.teacher.email}
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
