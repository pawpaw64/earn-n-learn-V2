import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, Star, BookOpen } from "lucide-react";
import { SkillType } from "@/types/marketplace";

interface EnhancedSkillCardProps {
  skill: SkillType;
  isRequested?: boolean;
  onContact: (skillId: number) => void;
  onViewDetails: (skillId: number) => void;
  onViewPoster?: (posterId: number) => void;
}

const EnhancedSkillCard: React.FC<EnhancedSkillCardProps> = ({
  skill,
  isRequested = false,
  onContact,
  onViewDetails,
  onViewPoster,
}) => {
  const navigate = useNavigate();
  const formatPricing = (pricing: string) => {
    if (!pricing) return "Not specified";
    if (pricing.toLowerCase() === "free") return "Free";
    if (pricing.toLowerCase() === "not specified") return "Not specified";
    if (pricing.toLowerCase().includes("exchange")) return pricing;
    if (/^\$?\d+(\/\w+)?$/.test(pricing)) {
      return pricing.replace('$', '') + (pricing.includes('/') ? '' : '/hr');
    }
    return pricing;
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-200 overflow-hidden hover:border-secondary/20">
      {/* Thumbnail placeholder */}
      {/* <div className="h-32 bg-gradient-to-br from-secondary/10 to-secondary/20 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-secondary" />
      </div> */}
      
      <div className="p-4">
        {/* Title and Experience Level */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
            {skill.skill || skill.skill_name}
          </h3>
          <Badge variant="secondary" className="text-xs shrink-0 bg-secondary/10 text-secondary hover:bg-secondary/20">
            {skill.experienceLevel || 'Beginner'}
          </Badge>
        </div>

        {/* Category Pills */}
        {skill.category && (
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="outline" className="text-xs">
              {skill.category}
            </Badge>
          </div>
        )}

        {/* Poster Info */}
        <div className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-accent/50 p-2 -m-2 rounded-md transition-colors" onClick={() => onViewPoster?.(skill.user_id || 0)}>
          <Avatar className="h-6 w-6">
            <AvatarImage src={skill.avatarUrl} alt={skill.name} />
            <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">{skill.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            {skill.name || 'Anonymous'}
          </span>
        </div>

        {/* Key Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-3 w-3" />
            <span className="text-primary font-medium">{formatPricing(skill.pricing)}</span>
          </div>
          {skill.availability && (
            <div className="text-xs text-muted-foreground">
              Available: {skill.availability}
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {skill.description || "No description provided"}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/skill/${skill.id}`)}
            className="flex-1"
          >
            Details
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={() => onContact(skill.id)}
            disabled={isRequested}
            className={`flex-1 ${
              isRequested
                ? "bg-muted text-muted-foreground hover:bg-muted"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isRequested ? "Requested" : "Contact"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSkillCard;