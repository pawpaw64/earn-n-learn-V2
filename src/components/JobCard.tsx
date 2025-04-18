
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          {type}
        </Badge>
      </div>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-emerald-600 font-medium">{payment}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            View Details
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
