import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Target } from "lucide-react";
import { Recommendation } from "@/services/recommendations.ts";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApply?: () => void;
  onContact?: () => void;
  onViewDetails?: () => void;
}

const RecommendationCard = ({ 
  recommendation, 
  onApply, 
  onContact, 
  onViewDetails 
}: RecommendationCardProps) => {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-100 text-green-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const formatPayment = (payment: string) => {
    if (payment?.toLowerCase() === "free") return "Free";
    if (payment?.toLowerCase() === "not specified") return "Not specified";
    if (/^\$?\d+(\/\w+)?$/.test(payment)) {
      return payment.replace('$', '') + (payment.includes('/') ? '' : 'tk/hr');
    }
    return payment;
  };

  const renderJobCard = () => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow w-full border-l-4 border-emerald-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{recommendation.title}</h3>
          <p className="text-sm text-gray-600">By {recommendation.poster}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge className={getMatchColor(recommendation.matchPercentage)}>
            <Target className="w-3 h-3 mr-1" />
            {recommendation.matchPercentage}% Match
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">
        {recommendation.description}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-emerald-600 font-medium">
          {formatPayment(recommendation.payment || "Not specified")}
        </span>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            size="sm"
          >
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            onClick={onApply}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSkillCard = () => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow w-full border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {recommendation.skill || recommendation.skill_name}
          </h3>
          <p className="text-sm text-gray-600">By {recommendation.name}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge className={getMatchColor(recommendation.matchPercentage)}>
            <Target className="w-3 h-3 mr-1" />
            {recommendation.matchPercentage}% Match
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">
        {recommendation.description}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-emerald-600 font-medium">
          {formatPayment(recommendation.pricing || "Not specified")}
        </span>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            size="sm"
          >
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            onClick={onContact}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMaterialCard = () => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full overflow-hidden border-l-4 border-purple-500">
      {recommendation.imageUrl && (
        <div className="w-full h-32 bg-gray-100">
          <img 
            src={`http://localhost:8080${recommendation.imageUrl}`}
            alt={recommendation.material}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{recommendation.material}</h3>
            <p className="text-sm text-gray-600">By {recommendation.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge className={getMatchColor(recommendation.matchPercentage)}>
              <Target className="w-3 h-3 mr-1" />
              {recommendation.matchPercentage}% Match
            </Badge>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">
          {recommendation.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-emerald-600 font-medium">
            {formatPayment(recommendation.price || "Not specified")}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onViewDetails}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              size="sm"
            >
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              onClick={onContact}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              size="sm"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (recommendation.type === 'job') return renderJobCard();
  if (recommendation.type === 'skill') return renderSkillCard();
  if (recommendation.type === 'material') return renderMaterialCard();
  
  return null;
};

export default RecommendationCard;