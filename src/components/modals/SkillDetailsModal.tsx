
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkillType } from "@/types/marketplace";

interface SkillDetailsModalProps {
  skill: SkillType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: (skillId: number) => void;
}

const SkillDetailsModal = ({ skill, isOpen, onOpenChange, onContact }: SkillDetailsModalProps) => {
  if (!skill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{skill.skill}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 my-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={skill.avatarUrl} alt={skill.name} />
              <AvatarFallback>{skill.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Offered by: {skill.name}</h3>
              <p className="text-sm text-muted-foreground">{skill.email || "No email provided"}</p>
            </div>
            <Badge variant="outline" className="ml-auto text-emerald-600 border-emerald-600">
              Skill
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{skill.description || "No description provided"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Pricing</h3>
              <p className="text-emerald-600 font-medium">{skill.pricing}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Experience Level</h3>
              <p>{skill.experienceLevel || "Not specified"}</p>
            </div>
            {skill.availability && (
              <div>
                <h3 className="font-semibold mb-1">Availability</h3>
                <p>{skill.availability}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </DialogClose>
          <Button 
            onClick={() => onContact(skill.id)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDetailsModal;
