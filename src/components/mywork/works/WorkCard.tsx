import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Clock, Calendar, DollarSign, MessageSquare } from "lucide-react";

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

export function WorkCard({ work, onViewDetails, onStatusChange }: WorkCardProps) {
  
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold line-clamp-1">{work.title}</h3>
            {work.company && (
              <p className="text-sm text-muted-foreground flex items-center gap-">
                <span className="">{work.company}</span>
              </p>
            )}
          </div>
          <Badge 
            variant={
              work.status === "In Progress" ? "secondary" : 
              work.status === "Completed" ? "default" : "destructive"
            }
            
          >
            {work.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {work.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {work.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {work.payment && (
            <div className="flex items-center text-sm font-medium text-emerald-600">
              <DollarSign className="mr-1.5 h-4 w-4" />
              {work.payment.includes('tk/hr') ? work.payment : `${work.payment}tk/hr`}
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1.5 h-4 w-4" />
            {work.startDate} - {work.endDate || "Present"}
          </div>
        </div>
        
      </CardContent>
      

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-0">
        <div className="flex items-center text-sm text-muted-foreground w-full sm:w-auto">
          <Clock className="mr-1.5 h-4 w-4" />
          
          {work.status === "In Progress" ? "Active" : work.status}
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 w-full xs:w-auto"
            onClick={() => onViewDetails(work, 'work')}
          >
            <Eye className="w-4 h-4" />
           Progress
           
          </Button>
           <Button 
             variant="outline" 
             size="sm"
             className="gap-1.5 w-full xs:w-auto"
             // onClick={}
             >
             <MessageSquare className="w-4 h-4" /> Applicants
            </Button>
          {!['Completed', 'Cancelled'].includes(work.status) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:bg-green-50 gap-1.5"
                onClick={() => onStatusChange(work.id, 'work', 'Completed')}
              >
                <Check className="w-4 h-4" />
                Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50 gap-1.5"
                onClick={() => onStatusChange(work.id, 'work', 'Cancelled')}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}