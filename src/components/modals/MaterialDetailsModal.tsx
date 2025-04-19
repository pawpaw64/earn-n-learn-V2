
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
    name: string;
    material: string;
    condition: string;
    price: string;
    availability: string;
    // Mock additional details
    description?: string;
    availabilityDates?: string;
    photos?: string[];
    ownerProfile?: {
      rating: number;
      memberSince: string;
    };
    terms?: string;
  };
}

const MaterialDetailsModal = ({ isOpen, onClose, onContact, material }: MaterialDetailsModalProps) => {
  // Mock data for fields not in original material object
  const mockData = {
    description: material.description || "This item is in excellent condition and has been well-maintained. Perfect for students taking the Economics 101 course this semester.",
    availabilityDates: material.availabilityDates || "Available immediately through the end of the semester",
    photos: material.photos || ["/placeholder.svg", "/placeholder.svg"],
    ownerProfile: material.ownerProfile || {
      rating: 4.7,
      memberSince: "Aug 2023",
    },
    terms: material.terms || (material.availability === "For Rent" ? "Security deposit required. Must return in same condition." : ""),
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{material.material}</DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              {material.condition}
            </Badge>
            <span className="text-emerald-600 font-medium">{material.price}</span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-medium">
              {material.availability}
            </Badge>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Listed by {material.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{mockData.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Availability</h3>
            <p className="text-gray-700">{mockData.availabilityDates}</p>
          </div>

          {mockData.photos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Photos</h3>
              <div className="grid grid-cols-2 gap-4">
                {mockData.photos.map((photo, index) => (
                  <div key={index} className="border rounded-md overflow-hidden h-40">
                    <img 
                      src={photo} 
                      alt={`${material.material} photo ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {mockData.terms && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-gray-700">{mockData.terms}</p>
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
                      i < Math.floor(mockData.ownerProfile.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{mockData.ownerProfile.rating}</span>
            </div>
            <p className="text-sm text-gray-600">
              Member since: {mockData.ownerProfile.memberSince}
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
