import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

interface SkillType {
  id: number;
  skill_name: string;
  description: string;
  pricing: string;
  availability: string;
  created_at: string;
}

interface SkillPostCardProps {
  skill: SkillType;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SkillPostCard({ skill, onView, onEdit, onDelete }: SkillPostCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{skill.skill_name}</h3>
            <Badge variant="outline" className="mt-1">Skill</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{skill.description}</p>
        <p className="mt-2 font-medium text-emerald-600">{skill.pricing}</p>
        <p className="text-sm mt-1">Availability: {skill.availability}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Posted: {new Date(skill.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="w-4 h-4" />Details
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
export default SkillPostCard;