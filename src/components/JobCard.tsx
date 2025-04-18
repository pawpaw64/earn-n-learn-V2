
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

const JobCard = ({ title, type, description, payment, onApply, onViewDetails }: JobCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-medium">
          {type}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-emerald-600 font-medium">{payment}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            Details <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            onClick={onApply}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
