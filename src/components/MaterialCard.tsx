
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface MaterialCardProps {
  name: string;
  material: string;
  condition: string;
  price: string;
  availability: string;
  description: string;
  imageUrl?: string; // Add imageUrl prop
  onContact: () => void;
  onViewDetails: () => void;
}

/**
 * Card component for displaying material listings
 */
const MaterialCard = ({
  name = "Anonymous",
  material = "Item not specified",
  condition = "Unknown",
  price = "Not specified",
  availability = "Available",
  description = "No description provided",
  imageUrl,
  onContact,
  onViewDetails,
}: MaterialCardProps) => {
  // Format price to be consistent
  const formatPrice = (priceString: string) => {
    if (!priceString) return "Not specified";
    if (priceString.toLowerCase() === "free") return "Free";
    if (priceString.toLowerCase() === "not specified") return "Not specified";
    if (/^\$?\d+(\/\w+)?$/.test(priceString)) {
      return priceString.replace('$', '') + (priceString.includes('/') ? '' : 'tk');
    }
    return priceString;
  };

  const formattedPrice = formatPrice(price);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full overflow-hidden">
      {/* Image section */}
      {imageUrl && (
        <div className="w-full h-48 bg-gray-100">
          <img 
            src={`http://localhost:8080${imageUrl}`}
            alt={material}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{material}</h3>  
            <p className="text-sm text-gray-600 mb-2">By {name}</p>        
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {condition}
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {availability}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">{description}</p>

        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <span className="text-emerald-600 font-medium whitespace-nowrap">
            {formattedPrice}
          </span>

          <div className="flex flex-col sm:flex-row gap-2 w-full xs:w-auto">
            <Button
              variant="outline"
              onClick={onViewDetails}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 w-full xs:w-auto"
              size="sm"
            >
              <span className="hidden sm:inline">Details</span>
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              onClick={onContact}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full xs:w-auto"
              size="sm"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
