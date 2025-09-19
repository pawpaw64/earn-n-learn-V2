import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import "../styles/dashboard-global.css";


interface JobCardProps {
  title: string;
  type: string;
  description: string;
  payment: string;
  location?: string;
  poster?: string;
  posterAvatar?: string;
  applicationStatus?: 'none' | 'applied' | 'accepted' | 'rejected';
  deadline?: string;
  onApply: () => void;
  onViewDetails: () => void;
  onPosterClick?: () => void;
}

const JobCard = ({ 
  title = "Untitled",
  type = "General",
  description = "No description",
  payment = "Not specified",
  location,
  poster = "Anonymous",
  posterAvatar,
  applicationStatus = 'none',
  deadline,
  onApply,
  onViewDetails,
  onPosterClick
}: JobCardProps) => {
  // Format payment to always include tk/hr if it's a number
  const formatPayment = (paymentString: string) => {
    if (paymentString.toLowerCase() === "free") return "Free";
    if (paymentString.toLowerCase() === "not specified") return "Not specified";
    
    // Check if payment is a range (e.g., "$20-30")
    if (/^\$?\d+-\d+$/.test(paymentString)) {
      return `${paymentString.replace('$', '')}tk/hr`;
    }
    
    // Check if payment is a single number (e.g., "$15")
    if (/^\$?\d+$/.test(paymentString)) {
      return `${paymentString.replace('$', '')}tk/hr`;
    }
    
    // Check if already has tk/hr
    if (paymentString.toLowerCase().includes("tk/hr")) {
      return paymentString;
    }
    
    // Default case
    return paymentString;
  };

  const formattedPayment = formatPayment(payment);

  const getApplicationButtonText = () => {
    switch (applicationStatus) {
      case 'applied': return 'Applied';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Apply Now';
    }
  };

  const getApplicationButtonClass = () => {
    switch (applicationStatus) {
      case 'applied': return 'dashboard-button bg-amber-500 hover:bg-amber-600 text-white cursor-not-allowed';
      case 'accepted': return 'dashboard-button bg-green-600 hover:bg-green-700 text-white';
      case 'rejected': return 'dashboard-button bg-red-500 hover:bg-red-600 text-white cursor-not-allowed';
      default: return 'dashboard-button bg-emerald-600 hover:bg-emerald-700 text-white';
    }
  };

  return (
    <div className="job-card w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
      {/* Header with title and type badge */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <h3 className="job-card-title text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{title}</h3>
        <Badge variant="secondary" className="job-card-badge bg-emerald-100 text-emerald-800 font-medium self-start sm:self-auto">
          {type}
        </Badge>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">{description}</p>
      
      {/* Poster info section */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <Avatar 
          className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all"
          onClick={onPosterClick}
        >
          <AvatarImage src={posterAvatar} alt={poster} />
          <AvatarFallback className="text-xs bg-emerald-100 text-emerald-800">
            {poster?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p 
            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors"
            onClick={onPosterClick}
          >
            {poster}
          </p>
        </div>
      </div>

      {/* Key info section */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
        <span className="job-card-price text-emerald-600 font-medium">
          {formattedPayment}
        </span>
        
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
        
        {deadline && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Due: {deadline}</span>
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
          onClick={onApply}
          className={getApplicationButtonClass()}
          size="sm"
          disabled={applicationStatus === 'applied' || applicationStatus === 'rejected'}
        >
          {getApplicationButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default JobCard;