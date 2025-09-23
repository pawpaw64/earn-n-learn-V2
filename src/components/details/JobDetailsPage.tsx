import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Star, 
  MessageCircle,
  Bookmark,
  Share2,
  ArrowLeft,
  CheckCircle,
  Building,
  Clock,
  FileText
} from "lucide-react";
import { JobType, ApplicationType } from "@/types/marketplace";
import { getJobDetails } from "@/services/jobs";
import { submitJobApplication, fetchMyApplications } from "@/services/applications";
import { fetchUserById, ProfileData } from "@/services/profile";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ProjectProgressSection } from "./ProjectProgressSection";

interface JobDetailsPageProps {
  jobId?: number;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId: propJobId }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jobId = propJobId || Number(id);

  const [job, setJob] = useState<JobType | null>(null);
  const [posterProfile, setPosterProfile] = useState<ProfileData | null>(null);
  const [application, setApplication] = useState<ApplicationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);
        
        // Load job details
        const jobData = await getJobDetails(jobId);
        setJob(jobData);

        // Load poster profile if available
        if (jobData.user_id) {
          try {
            const profile = await fetchUserById(jobData.user_id.toString());
            setPosterProfile(profile);
          } catch (error) {
            console.error("Error loading poster profile:", error);
          }
        }

        // Check if user has already applied
        const myApplications = await fetchMyApplications();
        const existingApplication = myApplications.find((app: any) => app.job_id === jobId);
        setApplication(existingApplication || null);
      } catch (error) {
        console.error("Error loading job details:", error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const handleApply = async () => {
    if (!job || !coverLetter.trim()) {
      toast.error("Please provide a cover letter");
      return;
    }

    try {
      setIsApplying(true);
      await submitJobApplication({
        job_id: job.id,
        cover_letter: coverLetter
      });
      
      // Refresh application status
      const myApplications = await fetchMyApplications();
      const newApplication = myApplications.find((app: any) => app.job_id === jobId);
      setApplication(newApplication || null);
      setCoverLetter("");
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  const handleContactPoster = () => {
    if (job?.user_id) {
      navigate(`/dashboard/messages`);
      localStorage.setItem("openChatWith", String(job.user_id));
      localStorage.setItem("openChatType", "direct");
    }
  };

  const formatPayment = (payment: string) => {
    if (payment.toLowerCase() === "free") return "Free";
    if (payment.toLowerCase() === "not specified") return "Not specified";
    if (/^\$?\d+(\/\w+)?$/.test(payment)) {
      return payment.replace('$', '') + (payment.includes('/') ? '' : 'tk/hr');
    }
    return payment;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600 mb-4">Job not found</p>
          <Button onClick={() => navigate('/dashboard/browse')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
     
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* Main Content */}
         {/* <div className="bg-white border-b"> */}
        {/* <div className="max-w-5xl mx-auto px-4 py-4"> */}
          
        {/* </div> */}
      {/* </div> */}

        <div className="lg:col-span-2 space-y-6">
          {/* Job Header Card */}
          <Card className="overflow-hidden ">
            <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/browse')}
            className="text-gray-600 hover:text-gray-900  flex items-center colour:emerald-600 hover:colour-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button> 
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800">
                      {job.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{job.poster || 'Company'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700">{formatPayment(job.payment)}</span>
                    </div>
                    {job.deadline && (
                      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Apply by {job.deadline}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Posted 2 days ago</span>
                    </div>
                  </div>
                </div>

                <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                  <AvatarImage src={job.posterAvatar} alt={job.poster} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {job.poster?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Action Buttons */}
            <CardContent className="p-6 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                {!application ? (
                  <Button 
                    size="lg" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      document.getElementById('application-section')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                  >
                    Apply Now
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg w-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-medium">
                      Applied • {application.status}
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="lg" onClick={handleContactPoster} className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description Section */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Section */}
          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Section */}
          <Card id="application-section">
            <CardHeader>
              <CardTitle>
                {!application ? "Apply for this Position" : "Your Application"}
              </CardTitle>
              <CardDescription>
                {!application 
                  ? "Submit your application to be considered for this position" 
                  : "View the status of your application"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!application ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell the employer why you're perfect for this job. Include relevant experience and skills..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum 50 characters</p>
                  </div>
                  <Button 
                    onClick={handleApply} 
                    disabled={isApplying || !coverLetter.trim() || coverLetter.length < 50}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isApplying ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Application Status: {application.status}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Your Cover Letter:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {application.cover_letter}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Applied on {new Date(application.created_at).toLocaleDateString()}
                  </p>

                  {/* Project Progress Section - Show if application is accepted */}
                  {application.status === 'accepted' && application.project_id && (
                    <ProjectProgressSection projectId={application.project_id} />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company/Poster Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.poster || 'the Company'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.posterAvatar} alt={job.poster} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {job.poster?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{job.poster || 'Company'}</p>
                  <p className="text-sm text-gray-500">{job.posterEmail}</p>
                </div>
              </div>

              {posterProfile?.user?.bio && (
                <p className="text-sm text-gray-600">
                  {posterProfile.user.bio}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.8/5 rating from 124 reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>15 active job postings</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-500" />
                  <span>50+ hires on this platform</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate(`/dashboard/profile/${job.user_id}`)}
                variant="outline" 
                className="w-full"
              >
                View Full Profile
              </Button>
            </CardContent>
          </Card>

          {/* Job Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Job Type</span>
                <span className="font-medium">{job.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{job.location || 'Remote'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium text-green-700">{formatPayment(job.payment)}</span>
              </div>
              {job.deadline && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Deadline</span>
                  <span className="font-medium">{job.deadline}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Similar Jobs Card */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <h4 className="font-medium text-gray-900">Frontend Developer</h4>
                  <p className="text-sm text-gray-600">TechCorp Inc.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">$45-55/hr</span>
                    <MapPin className="h-3 w-3 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-600">Remote</span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <h4 className="font-medium text-gray-900">UI/UX Designer</h4>
                  <p className="text-sm text-gray-600">DesignHub</p>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">$40-50/hr</span>
                    <MapPin className="h-3 w-3 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-600">New York, NY</span>
                  </div>
                </div>
              </div>
              <Button variant="link" className="text-blue-600 p-0 mt-3">
                View all similar jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Contact Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button 
          onClick={handleContactPoster}
          size="lg" 
          className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 h-14 w-14 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default JobDetailsPage;