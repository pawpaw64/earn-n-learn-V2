
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
import { ArrowLeft, Bookmark, Share2, MessageCircle, Star, Trophy, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SkillType } from "@/types/marketplace";

interface SkillDetailsModalProps {
  skill: SkillType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: (skillId: number) => void;
  onSave?: (skillId: number) => void;
  onShare?: (skillId: number) => void;
  contactStatus?: 'none' | 'contacted' | 'accepted' | 'rejected';
}

const SkillDetailsModal = ({ 
  skill, 
  isOpen, 
  onOpenChange, 
  onContact,
  onSave,
  onShare,
  contactStatus = 'none' 
}: SkillDetailsModalProps) => {
  if (!skill) return null;

  const getContactButtonText = () => {
    switch (contactStatus) {
      case 'contacted': return 'Contacted';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Declined';
      default: return 'Contact';
    }
  };

  const getContactButtonClass = () => {
    switch (contactStatus) {
      case 'contacted': return 'bg-amber-500 hover:bg-amber-600 text-white cursor-not-allowed';
      case 'accepted': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'rejected': return 'bg-red-500 hover:bg-red-600 text-white cursor-not-allowed';
      default: return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {/* Hero Section */}
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold pr-4">{skill.skill}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                  Skill
                </Badge>
                <span className="text-emerald-600 font-semibold text-lg">{skill.pricing}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              {onSave && (
                <Button variant="outline" size="sm" onClick={() => onSave(skill.id)}>
                  <Bookmark className="w-4 h-4" />
                </Button>
              )}
              {onShare && (
                <Button variant="outline" size="sm" onClick={() => onShare(skill.id)}>
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid gap-6 my-4">
          {/* Poster Details Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all">
                <AvatarImage src={skill.avatarUrl} alt={skill.name} />
                <AvatarFallback className="text-lg bg-emerald-100 text-emerald-800">
                  {skill.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg cursor-pointer hover:text-emerald-600 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{skill.email || "No email provided"}</p>
                
                {/* Poster stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">4.9</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>980 points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>#8 on leaderboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Skill Description</h3>
            <p className="text-gray-700 leading-relaxed">{skill.description || "No description provided"}</p>
          </div>
          
          {/* Skill Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Pricing</h4>
                <p className="text-emerald-600 font-medium">{skill.pricing}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Experience Level</h4>
                <p>{skill.experienceLevel || "Not specified"}</p>
              </div>
            </div>
            <div className="space-y-3">
              {skill.availability && (
                <div>
                  <h4 className="font-semibold mb-1">Availability</h4>
                  <p>{skill.availability}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Status Section */}
          {contactStatus !== 'none' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Contact Status</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  {contactStatus === 'contacted' && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Contact request sent - awaiting response</span>
                    </div>
                  )}
                  {contactStatus === 'accepted' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Contact accepted - you can now message</span>
                    </div>
                  )}
                  {contactStatus === 'rejected' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Contact request was declined</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <DialogFooter className="flex items-center justify-between sm:justify-between pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </DialogClose>
          <Button 
            onClick={() => onContact(skill.id)} 
            className={getContactButtonClass()}
            disabled={contactStatus === 'contacted' || contactStatus === 'rejected'}
          >
            {getContactButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDetailsModal;
