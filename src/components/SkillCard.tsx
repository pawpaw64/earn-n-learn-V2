
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{skill}</h3>
        <Badge variant="outline" className="text-emerald-600 border-emerald-600">
          Skill
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-2">By {name}</p>
      <p className="text-emerald-600 font-medium mb-4">{pricing}</p>
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

export default SkillCard;
