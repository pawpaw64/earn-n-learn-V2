import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, Package, MapPin } from "lucide-react";
import { MaterialType } from "@/types/marketplace";

interface EnhancedMaterialCardProps {
  material: MaterialType;
  isRequested?: boolean;
  onContact: (materialId: number) => void;
  onViewDetails: (materialId: number) => void;
  onViewPoster?: (posterId: number) => void;
}

const EnhancedMaterialCard: React.FC<EnhancedMaterialCardProps> = ({
  material,
  isRequested = false,
  onContact,
  onViewDetails,
  onViewPoster,
}) => {
  const navigate = useNavigate();
  const formatPrice = (price: string) => {
    if (!price) return "Not specified";
    if (price.toLowerCase() === "free") return "Free";
    if (price.toLowerCase() === "not specified") return "Not specified";
    if (/^\$?\d+(\/\w+)?$/.test(price)) {
      return price.replace('$', '') + (price.includes('/') ? '' : 'tk');
    }
    return price;
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-200 overflow-hidden hover:border-accent/20">
      {/* Image or Thumbnail */}
      <div className="h-32 overflow-hidden">
        {material.imageUrl ? (
          <img
            src={`http://localhost:8080${material.imageUrl}`}
            alt={material.material || material.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center" style={{ display: material.imageUrl ? 'none' : 'flex' }}>
          <Package className="h-8 w-8 text-accent" />
        </div>
      </div>
      
      <div className="p-4">
        {/* Title and Condition */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
            {material.material || material.title}
          </h3>
          <Badge variant="secondary" className="text-xs shrink-0 bg-accent/10 text-accent hover:bg-accent/20">
            {material.condition || material.conditions || 'Good'}
          </Badge>
        </div>

        {/* Category and Availability Pills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {material.category && (
            <Badge variant="outline" className="text-xs">
              {material.category}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs bg-muted text-muted-foreground hover:bg-muted/80">
            {material.availability || 'Available'}
          </Badge>
        </div>

        {/* Poster Info */}
        <div className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-accent/50 p-2 -m-2 rounded-md transition-colors" onClick={() => onViewPoster?.(material.user_id || 0)}>
          <Avatar className="h-6 w-6">
            <AvatarImage src={material.avatarUrl} alt={material.name} />
            <AvatarFallback className="text-xs bg-accent text-accent-foreground">{material.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            {material.name || 'Anonymous'}
          </span>
        </div>

        {/* Key Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-3 w-3" />
            <span className="text-primary font-medium">{formatPrice(material.price)}</span>
          </div>
          {material.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{material.location}</span>
            </div>
          )}
          {material.duration && (
            <div className="text-xs text-muted-foreground">
              Duration: {material.duration}
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {material.description || "No description provided"}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/material/${material.id}`)}
            className="flex-1"
          >
            Details
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={() => onContact(material.id)}
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

export default EnhancedMaterialCard;