
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Briefcase, User, Clock, Mail, Phone, Book, School } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * Application details component for user's own applications
 * Shows the application from the applicant's perspective
 */
export const MyApplicationDetails: React.FC<{ item: any }> = ({ item }) => {
  const navigate = useNavigate();
  
  if (!item) return null;

  // Handler to view the poster's profile
  const handleViewPosterProfile = () => {
    if (item.poster_id) {
      navigate(`/dashboard/profile/${item.poster_id}`);
    }
  };
  
  // Handler to message the poster
  const handleMessagePoster = () => {
    if (item.poster_id) {
      navigate(`/dashboard/messages?userId=${item.poster_id}`);
    }
  };
  
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
          Your application to this job
        </p>
      </div>
      
      {/* Job Poster information section */}
      <div className="space-y-4">
        <h3 className="font-medium">Job Poster Information</h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={item.poster_avatar} />
            <AvatarFallback>{item.poster_name?.charAt(0) || 'P'}</AvatarFallback>
          </Avatar>
          
          <div>
            <p className="font-medium">{item.poster_name}</p>
            <p className="text-sm text-muted-foreground">{item.poster_email}</p>
          </div>
          
          <div className="ml-auto space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewPosterProfile}
            >
              <User className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMessagePoster}
            >
              <Mail className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
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
      
      {/* Your cover letter section */}
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
