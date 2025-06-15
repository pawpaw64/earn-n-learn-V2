
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Users } from "lucide-react";

interface JobType {
  id: number;
  title: string;
  type: string;
  status: string;
  description: string;
  payment: string;
  created_at: string;
}

interface JobPostCardProps {
  job: JobType;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewApplicants?: () => void;
}

export function JobPostCard({ job, onView, onEdit, onDelete, onViewApplicants }: JobPostCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <Badge variant="outline" className="mt-1">{job.type}</Badge>
          </div>
          <Badge variant={job.status === "Active" ? "secondary" : "outline"}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
        <p className="mt-2 font-medium text-emerald-600">{job.payment}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Posted: {new Date(job.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="w-4 h-4" />Details
          </Button>
          {onViewApplicants && (
            <Button variant="outline" size="sm" onClick={onViewApplicants}>
              <Users className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-500" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
export default JobPostCard;
