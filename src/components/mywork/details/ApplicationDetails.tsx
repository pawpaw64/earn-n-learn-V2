
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Briefcase, User, Clock } from "lucide-react";

/**
 * Enhanced application details component
 * Shows comprehensive information about the job application
 */
export const ApplicationDetails: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="space-y-6">
      {/* Header with title and status */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <Badge className={
            item.status === 'Accepted' ? 'bg-green-100 text-green-800' :
            item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            item.status === 'Withdrawn' ? 'bg-gray-100 text-gray-800' :
            item.status === 'Reviewing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }>
            {item.status}
          </Badge>
        </div>
        
        <p className="text-muted-foreground">
          {item.poster_name ? `Posted by ${item.poster_name}` : 'Unknown poster'}
        </p>
      </div>
      
      {/* Job information section */}
      <div className="space-y-4">
        <h3 className="font-medium">Job Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Job Type</p>
              <p className="text-sm text-muted-foreground">{item.type || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date Applied</p>
              <p className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Payment</p>
              <p className="text-sm text-emerald-600 font-medium">{item.payment || 'Not specified'}</p>
            </div>
          </div>
          
          {item.deadline && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Deadline</p>
                <p className="text-sm text-muted-foreground">{new Date(item.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          
          {item.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{item.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Job description section */}
      {item.description && (
        <>
          <div className="space-y-2">
            <h3 className="font-medium">Job Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
          </div>
          <Separator />
        </>
      )}
      
      {/* Cover letter section */}
      <div className="space-y-2">
        <h3 className="font-medium">Your Cover Letter</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm whitespace-pre-line">{item.cover_letter}</p>
        </div>
      </div>
      
      {/* Application timeline section */}
      <div className="space-y-2">
        <h3 className="font-medium">Application Timeline</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <p className="text-sm">
              <span className="font-medium">Applied:</span> {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
          
          {item.updated_at && item.updated_at !== item.created_at && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <p className="text-sm">
                <span className="font-medium">Last Updated:</span> {new Date(item.updated_at).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {item.status !== 'Applied' && (
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                item.status === 'Accepted' ? 'bg-green-500' : 
                item.status === 'Rejected' ? 'bg-red-500' : 
                'bg-gray-500'
              }`}></div>
              <p className="text-sm">
                <span className="font-medium">Status Changed to {item.status}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
