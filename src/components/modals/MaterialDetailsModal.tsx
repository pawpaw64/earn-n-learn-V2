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
import { ArrowLeft, Bookmark, Share2, Star, Trophy, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MaterialType } from "@/types/marketplace";

interface MaterialDetailsModalProps {
  material: MaterialType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: (materialId: number) => void;
  onSave?: (materialId: number) => void;
  onShare?: (materialId: number) => void;
  contactStatus?: 'none' | 'contacted' | 'accepted' | 'rejected';
}

const MaterialDetailsModal = ({ 
  material, 
  isOpen, 
  onOpenChange, 
  onContact,
  onSave,
  onShare,
  contactStatus = 'none' 
}: MaterialDetailsModalProps) => {
  if (!material) return null;

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
              <DialogTitle className="text-2xl font-bold pr-4">{material.material}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                  {material.condition}
                </Badge>
                <span className="text-emerald-600 font-semibold text-lg">{material.price}</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              {onSave && (
                <Button variant="outline" size="sm" onClick={() => onSave(material.id)}>
                  <Bookmark className="w-4 h-4" />
                </Button>
              )}
              {onShare && (
                <Button variant="outline" size="sm" onClick={() => onShare(material.id)}>
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid gap-6 my-4">
          {/* Material Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={material.imageUrl || "/placeholder.svg"}
              alt={material.material}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Poster Details Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all">
                <AvatarImage src={material.avatarUrl} alt={material.name} />
                <AvatarFallback className="text-lg bg-emerald-100 text-emerald-800">
                  {material.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg cursor-pointer hover:text-emerald-600 transition-colors">
                  {material.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{material.email || "No email provided"}</p>
                
                {/* Poster stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">4.7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>1,450 points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>#12 on leaderboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Description</h3>
            <p className="text-gray-700 leading-relaxed">{material.description || "No description provided"}</p>
          </div>
          
          {/* Material Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Price</h4>
                <p className="text-emerald-600 font-medium">{material.price}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Availability</h4>
                <p>{material.availability}</p>
              </div>
            </div>
            <div className="space-y-3">
              {material.duration && (
                <div>
                  <h4 className="font-semibold mb-1">Duration</h4>
                  <p>{material.duration}</p>
                </div>
              )}
              {material.location && (
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p>{material.location}</p>
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
            onClick={() => onContact(material.id)} 
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

export default MaterialDetailsModal;
