
import { Button } from "@/components/ui/button";

interface SkillCardProps {
  name: string;
  skill: string;
  pricing: string;
  onContact: () => void;
  onViewDetails: () => void;
}

const SkillCard = ({ name, skill, pricing, onContact, onViewDetails }: SkillCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="font-medium text-gray-900">{name}</h3>
      <p className="text-emerald-600 font-medium mt-1">{skill}</p>
      <p className="text-gray-600 mt-2">{pricing}</p>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          View Details
        </Button>
        <Button
          onClick={onContact}
          variant="outline"
          className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          Contact
        </Button>
      </div>
    </div>
  );
};

export default SkillCard;
