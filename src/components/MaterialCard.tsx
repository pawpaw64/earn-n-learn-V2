
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MaterialCardProps {
  name: string;
  material: string;
  condition: string;
  price: string;
  availability: string;
  onContact: () => void;
}

const MaterialCard = ({
  name,
  material,
  condition,
  price,
  availability,
  onContact,
}: MaterialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{material}</h3>
        <Badge variant="outline" className="text-emerald-600 border-emerald-600">
          {condition}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mt-2">By {name}</p>
      <div className="mt-3 space-y-2">
        <p className="text-emerald-600 font-medium">{price}</p>
        <p className="text-sm text-gray-500">{availability}</p>
      </div>
      <Button
        onClick={onContact}
        variant="outline"
        className="w-full mt-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
      >
        Contact Seller
      </Button>
    </div>
  );
};

export default MaterialCard;
