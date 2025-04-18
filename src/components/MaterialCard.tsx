
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface MaterialCardProps {
  name: string;
  material: string;
  condition: string;
  price: string;
  availability: string;
  onContact: () => void;
  onViewDetails: () => void;
}

const MaterialCard = ({
  name,
  material,
  condition,
  price,
  availability,
  onContact,
  onViewDetails,
}: MaterialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{material}</h3>
        <Badge variant="outline" className="text-emerald-600 border-emerald-600">
          {condition}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-2">By {name}</p>
      <div className="mb-4">
        <p className="text-emerald-600 font-medium">{price}</p>
        <p className="text-sm text-gray-500">{availability}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          Details <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
        <Button
          onClick={onContact}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Contact
        </Button>
      </div>
    </div>
  );
};

export default MaterialCard;
