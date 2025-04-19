
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

interface MaterialDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
  material: {
    id: number;
    materialName: string;
    condition: string;
    type: "sale" | "rent" | "borrow";
    price: string;
    description: string;
    availability: string;
    photos: string[];
    terms?: string;
    owner: {
      name: string;
      email: string;
      rating: number;
      memberSince: string;
    };
  };
}

const MaterialDetailsModal = ({ isOpen, onClose, onContact, material }: MaterialDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{material.materialName}</DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              {material.condition}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-medium">
              {material.type === "sale" ? "For Sale" : 
               material.type === "rent" ? "For Rent" :
               "To Borrow"}
            </Badge>
            {material.price && (
              <span className="text-emerald-600 font-medium">{material.price}</span>
            )}
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Listed by {material.owner.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{material.description}</p>
          </div>

          {material.photos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Photos</h3>
              <div className="grid grid-cols-2 gap-4">
                {material.photos.map((photo, index) => (
                  <div key={index} className="border rounded-md overflow-hidden h-40">
                    <img 
                      src={photo} 
                      alt={`${material.materialName} photo ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Availability</h3>
            <p className="text-gray-700">{material.availability}</p>
          </div>

          {material.terms && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-gray-700">{material.terms}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Owner Profile</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(material.owner.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{material.owner.rating}</span>
            </div>
            <p className="text-sm text-gray-600">
              Member since: {material.owner.memberSince}
            </p>
            <p className="text-sm text-gray-600">
              Contact: {material.owner.email}
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
            Contact Owner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDetailsModal;
