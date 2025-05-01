
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";

interface WorkItem {
  id: number;
  title: string;
  company?: string;
  description?: string;
  payment?: string;
  status: string;
  startDate: string;
  endDate?: string;
  [key: string]: any;
}

interface WorkCardProps {
  work: WorkItem;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

/**
 * Card component for displaying a single work item
 * Includes status change buttons for active works
 */
export function WorkCard({ work, onViewDetails, onStatusChange }: WorkCardProps) {
  return (
    <Card key={work.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{work.title}</h3>
            <p className="text-sm text-muted-foreground">{work.company}</p>
          </div>
          <Badge variant={work.status === "In Progress" ? "secondary" : "outline"}>
            {work.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{work.description}</p>
        {work.payment && (
          <p className="mt-2 font-medium text-emerald-600">{work.payment}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          {work.startDate} - {work.endDate || "Ongoing"}
        </span>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(work, 'work')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {!['Completed', 'Cancelled'].includes(work.status) && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600"
                onClick={() => onStatusChange(work.id, 'work', 'Completed')}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => onStatusChange(work.id, 'work', 'Cancelled')}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
