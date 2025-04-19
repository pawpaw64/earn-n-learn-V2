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
import { MaterialType } from "@/types/marketplace";

interface MaterialDetailsModalProps {
  material: MaterialType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: (materialId: number) => void;
}

const MaterialDetailsModal = ({ material, isOpen, onOpenChange, onContact }: MaterialDetailsModalProps) => {
  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{material.material}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 my-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={material.imageUrl || "/placeholder.svg"}
              alt={material.material}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={material.avatarUrl} alt={material.name} />
              <AvatarFallback>{material.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Offered by: {material.name}</h3>
              <p className="text-sm text-muted-foreground">{material.email || "No email provided"}</p>
            </div>
            <Badge variant="outline" className="ml-auto text-emerald-600 border-emerald-600">
              {material.condition}
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{material.description || "No description provided"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Price</h3>
              <p className="text-emerald-600 font-medium">{material.price}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Availability</h3>
              <p>{material.availability}</p>
            </div>
            {material.duration && (
              <div>
                <h3 className="font-semibold mb-1">Duration</h3>
                <p>{material.duration}</p>
              </div>
            )}
            {material.location && (
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p>{material.location}</p>
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
            onClick={() => onContact(material.id)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDetailsModal;
