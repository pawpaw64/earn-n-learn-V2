
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

interface JobApplicationCardProps {
  app: any;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

/**
 * Card component for displaying job applications
 */
export const JobApplicationCard: React.FC<JobApplicationCardProps> = ({ app, onViewDetails, onStatusChange }) => (
  <Card key={app.id} className="h-full flex flex-col">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{app.title}</h3>
          <p className="text-sm text-muted-foreground">{app.poster_name || 'Unknown poster'}</p>
        </div>
        <Badge variant={
          app.status === 'Accepted' ? 'secondary' : 
          app.status === 'Rejected' ? 'destructive' : 
          'outline'
        }>
          {app.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-muted-foreground line-clamp-2">
        {app.cover_letter?.substring(0, 100)}...
      </p>
      <div className="mt-2">
        <Badge variant="outline" className="mr-2">{app.type}</Badge>
        <Badge variant="outline">{app.payment || 'Unspecified'}</Badge>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <span className="text-sm text-muted-foreground">
        Applied: {new Date(app.created_at).toLocaleDateString()}
      </span>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(app, 'application')}
        >
          <Eye className="w-4 h-4" />
        </Button>
        {app.status === 'Applied' && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500"
            onClick={() => onStatusChange(app.id, 'job_application', 'Withdrawn')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </CardFooter>
  </Card>
);
