
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import "../styles/dashboard-global.css";

interface SkillCardProps {
  name: string;
  skill: string;
  description?: string; // Optional with default value
  pricing: string;
  experienceLevel?: string; // Optional with default value
  onContact: () => void;
  onViewDetails: () => void;
}

/**
 * Card component for displaying skill offerings
 */
const SkillCard = ({
  name = "Anonymous",
  skill = "Skill not specified",
  description = "No description provided",
  pricing = "Not specified",
  experienceLevel = "Beginner",
  onContact,
  onViewDetails,
}: SkillCardProps) => {
  // Format pricing to be consistent
  const formatPricing = (priceString: string) => {
    if (!priceString) return "Not specified";
    if (priceString.toLowerCase() === "free") return "Free";
    if (priceString.toLowerCase() === "not specified") return "Not specified";
    if (priceString.toLowerCase().includes("exchange")) return priceString;
    if (/^\$?\d+(\/\w+)?$/.test(priceString)) {
      return priceString.replace('$', '') + (priceString.includes('/') ? '' : '/hr');
    }
    return priceString;
  };

  const formattedPricing = formatPricing(pricing);

  return (
    <div className="skill-card w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <div>
        <h3 className="skill-card-title text-lg font-semibold text-gray-900">{skill}</h3>          
        <p className="text-sm text-gray-600 mb-2">By {name}</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Badge variant="secondary" className="skill-card-badge bg-blue-100 text-blue-800">
            {experienceLevel}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">{description}</p>

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <span className="skill-card-price text-emerald-600 font-medium whitespace-nowrap">
          {formattedPricing}
        </span>

        <div className="flex flex-col sm:flex-row gap-2 w-full xs:w-auto">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="dashboard-button-outline border-emerald-600 text-emerald-600 hover:bg-emerald-50 w-full xs:w-auto"
            size="sm"
          >
            <span className="hidden sm:inline">Details</span>
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            onClick={onContact}
            className="dashboard-button bg-emerald-600 hover:bg-emerald-700 text-white w-full xs:w-auto"
            size="sm"
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
