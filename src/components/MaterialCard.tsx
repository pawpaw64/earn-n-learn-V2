import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, MapPin } from "lucide-react";
import "../styles/dashboard-global.css";

interface MaterialCardProps {
  name: string;
  material: string;
  condition: string;
  price: string;
  availability: string;
  description: string;
  imageUrl?: string;
  location?: string;
  posterAvatar?: string;
  contactStatus?: 'none' | 'contacted' | 'accepted' | 'rejected';
  onContact: () => void;
  onViewDetails: () => void;
  onPosterClick?: () => void;
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
  location,
  posterAvatar,
  contactStatus = 'none',
  onContact,
  onViewDetails,
  onPosterClick
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
      case 'contacted': return 'dashboard-button bg-amber-500 hover:bg-amber-600 text-white cursor-not-allowed';
      case 'accepted': return 'dashboard-button bg-green-600 hover:bg-green-700 text-white';
      case 'rejected': return 'dashboard-button bg-red-500 hover:bg-red-600 text-white cursor-not-allowed';
      default: return 'dashboard-button bg-emerald-600 hover:bg-emerald-700 text-white';
    }
  };

  return (
    <div className="material-card w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image section */}
      {imageUrl && (
        <div className="w-full h-48 bg-gray-100">
          <img 
            src={`http://localhost:8080${imageUrl}`}
            alt={material}
            className="material-card-image w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        {/* Header with title and condition/availability badges */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
          <h3 className="material-card-title text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{material}</h3>
          <div className="flex gap-2 self-start sm:self-auto">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {condition}
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {availability}
            </Badge>
          </div>
        </div>

        {/* Poster info section */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <Avatar 
            className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all"
            onClick={onPosterClick}
          >
            <AvatarImage src={posterAvatar} alt={name} />
            <AvatarFallback className="text-xs bg-emerald-100 text-emerald-800">
              {name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p 
              className="text-sm font-medium text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={onPosterClick}
            >
              {name}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">{description}</p>

        {/* Key info section */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
          <span className="material-card-price text-emerald-600 font-medium">
            {formattedPrice}
          </span>
          
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="dashboard-button-outline border-emerald-600 text-emerald-600 hover:bg-emerald-50 flex-1 sm:flex-none"
            size="sm"
          >
            <span className="hidden sm:inline">Details</span>
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            onClick={onContact}
            className={getContactButtonClass()}
            size="sm"
            disabled={contactStatus === 'contacted' || contactStatus === 'rejected'}
          >
            {getContactButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
