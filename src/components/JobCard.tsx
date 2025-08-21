import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface JobCardProps {
  title: string;
  type: string;
  description: string;
  payment: string;
  onApply: () => void;
  onViewDetails: () => void;
}

const JobCard = ({ 
  title = "Untitled",
  type = "General",
  description = "No description",
  payment = "Not specified",
  onApply,
  onViewDetails 
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-medium self-start sm:self-auto">
          {type}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">{description}</p>
      
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <span className="text-emerald-600 font-medium whitespace-nowrap">
          {formattedPayment}
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
            onClick={onApply}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full xs:w-auto"
            size="sm"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;