
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  fetchUserById, 
  fetchUserWorkHistory, 
  fetchUserDetails,
  ProfileData,
  WorkHistoryData,
  UserDetailsData
} from "@/services/profile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Star, CheckCircle, ExternalLink, Award, Briefcase } from "lucide-react";
import { initiateDirectMessage } from "@/services/messages";
import { toast } from "sonner";
import { getUserIdFromToken } from "@/services/auth";

const UserProfileView = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [workHistory, setWorkHistory] = useState<WorkHistoryData | null>(null);
  const [details, setDetails] = useState<UserDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const currentUserId = getUserIdFromToken(localStorage.getItem('token'));
  
  // Check if viewing own profile
  const isOwnProfile = currentUserId?.toString() === userId;
  
  useEffect(() => {
    if (!userId) return;
    
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch all user data in parallel
        const [profileData, workHistoryData, detailsData] = await Promise.all([
          fetchUserById(userId),
          fetchUserWorkHistory(userId),
          fetchUserDetails(userId)
        ]);
        
        setProfile(profileData);
        setWorkHistory(workHistoryData);
        setDetails(detailsData);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [userId]);
  
  // Function to handle contacting the user
  const handleContactUser = async () => {
    if (!userId || isOwnProfile) return;
    
    setIsContactLoading(true);
    try {
      const result = await initiateDirectMessage(Number(userId));
      
      if (result?.success) {
        // Redirect to messages page with this chat open
        navigate('/dashboard/messages', { state: { contactId: userId } });
        toast.success(`Started conversation with ${profile?.user.name}`);
      } else {
        throw new Error("Failed to initiate conversation");
      }
    } catch (error) {
      console.error("Error contacting user:", error);
      toast.error("Failed to start conversation");
    } finally {
      setIsContactLoading(false);
    }
  };

  // Show loading skeleton when data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        
        <Skeleton className="h-32 w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  // Show message if user not found
  if (!profile?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-bold">User not found</h2>
        <p className="text-muted-foreground">The requested profile could not be loaded</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.user.avatar} alt={profile.user.name} />
              <AvatarFallback>{profile.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{profile.user.name}</h2>
                    {details?.verifications?.some(v => v.type === "email" && v.status === "verified") && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{profile.user.university || profile.user.program}</p>
                </div>
                
                {details?.ratings?.count > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(parseFloat(details.ratings.average)) 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {details.ratings.average} ({details.ratings.count} reviews)
                    </span>
                  </div>
                )}
              </div>
              
              {!isOwnProfile && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button 
                    onClick={handleContactUser} 
                    disabled={isContactLoading}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact {profile.user.name.split(' ')[0]}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="about">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="workHistory">Work History</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          {/* Bio Section */}
          {profile.user.bio && (
            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{profile.user.bio}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.skills.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {profile.skills.map(skill => (
                    <div key={skill.id} className="border rounded-md p-3">
                      <h4 className="font-medium">{skill.name}</h4>
                      {skill.description && (
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills listed</p>
              )}
            </CardContent>
          </Card>
          
          {/* Portfolio Section */}
          {profile.portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.portfolio.map(item => (
                    <a 
                      key={item.id}
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="border rounded-md p-4 flex items-start hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {item.title}
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <p className="text-xs text-blue-600 mt-2 break-all">{item.url}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Contact Links */}
          {profile.websites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.websites.map(site => (
                    <a 
                      key={site.id}
                      href={site.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {site.title}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Work History Tab */}
        <TabsContent value="workHistory" className="space-y-6">
          {/* Posted Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Posted Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {workHistory?.jobs && workHistory.jobs.length > 0 ? (
                <div className="space-y-4">
                  {workHistory.jobs.map(job => (
                    <div key={job.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{job.title}</h4>
                        <Badge variant={job.status === "Active" ? "secondary" : "outline"}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{job.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium text-emerald-600">{job.payment}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {job.application_count > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {job.application_count} application{job.application_count !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No jobs posted</p>
              )}
            </CardContent>
          </Card>
          
          {/* Skills offered */}
          {workHistory?.skills && workHistory.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workHistory.skills.map(skill => (
                    <div key={skill.id} className="border rounded-md p-4">
                      <h4 className="font-medium">{skill.skill_name}</h4>
                      <p className="text-sm mt-1 line-clamp-2">{skill.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium text-emerald-600">{skill.pricing}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(skill.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Materials offered */}
          {workHistory?.materials && workHistory.materials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Materials Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workHistory.materials.map(material => (
                    <div key={material.id} className="border rounded-md p-4">
                      <h4 className="font-medium">{material.title}</h4>
                      <p className="text-sm mt-1 line-clamp-2">{material.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium text-emerald-600">{material.price}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(material.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Completed Jobs */}
          {details?.completedJobs && details.completedJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completed Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {details.completedJobs.map(job => (
                    <div key={job.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{job.job_title}</h4>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600">
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{job.job_description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={job.client_avatar} alt={job.client_name} />
                            <AvatarFallback>{job.client_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            Client: {job.client_name}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(job.completed_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              {details?.ratings?.detail && details.ratings.detail.length > 0 ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{details.ratings.average}</div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(parseFloat(details.ratings.average)) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm mt-1">{details.ratings.count} reviews</p>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map(rating => {
                          const count = details.ratings.detail.filter(r => r.rating === rating).length;
                          const percentage = (count / details.ratings.count) * 100;
                          
                          return (
                            <div key={rating} className="flex items-center gap-2">
                              <div className="text-sm w-4">{rating}</div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-xs w-8">{count}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {details.ratings.detail.map(review => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.rater_avatar} alt={review.rater_name} />
                              <AvatarFallback>{review.rater_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{review.rater_name}</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs ml-2 text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No reviews yet</h3>
                  <p className="text-muted-foreground">This user hasn't received any reviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileView;
