
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, DollarSign, Eye, X } from "lucide-react";

interface JobApplicationCardProps {
  app: any;
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<void>;
}

/**
 * Card component for displaying job application information
 */
export function JobApplicationCard({ app, onViewDetails, onStatusChange }: JobApplicationCardProps) {
  const handleWithdraw = () => {
    onStatusChange(app.id, 'job_application', 'Withdrawn');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{app.title}</h3>
            <p className="text-sm text-muted-foreground">
              Posted by {app.poster_name}
            </p>
          </div>
          <Badge className={
            app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            app.status === 'Withdrawn' ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }>
            {app.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-emerald-600 font-medium">{app.payment}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(app.created_at).toLocaleDateString()}</span>
          </div>
          
          {app.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{app.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{app.type}</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
         className="bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-black w-full xs:w-auto flex items-center gap-1"
        size="sm"
            onClick={() => onViewDetails(app, 'my_application')}
            
          ><span className="hidden sm:inline"></span>
            <Eye className="mr-1 h-4 w-4" /> View Details
          </Button>
          
          {app.status === 'Pending' && (
            <Button 
              className="bg-emerald-600 hover:bg-red-700 text-white w-full xs:w-auto flex items-center gap-1"
              size="sm"
              onClick={handleWithdraw}
            >
              <X className="mr-1 h-4 w-4" /> Withdraw
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
