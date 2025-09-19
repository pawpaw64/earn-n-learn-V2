import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MapPin, 
  Mail, 
  Star, 
  Trophy, 
  TrendingUp,
  MessageCircle,
  ArrowLeft,
  Briefcase,
  BookOpen,
  Package,
  Calendar,
  Award,
  User,
  GraduationCap,
  Link
} from "lucide-react";
import { ProfileData, fetchUserById } from "@/services/profile";
import { UserPoints, fetchUserPoints, LeaderboardItem, fetchLeaderboard } from "@/services/points";
import { fetchJobsByUser } from "@/services/jobs";
import { fetchSkillsByUser } from "@/services/skills";
import { fetchMaterialsByUser } from "@/services/materials";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const PosterProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [userJobs, setUserJobs] = useState<JobType[]>([]);
  const [userSkills, setUserSkills] = useState<SkillType[]>([]);
  const [userMaterials, setUserMaterials] = useState<MaterialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        
        // Load user profile
        const profileData = await fetchUserById(userId);
        setProfile(profileData);

        // Load user points (Note: This would need backend modification to get points for specific user)
        // For now, we'll show placeholder data
        setUserPoints({
          points: 1250,
          tasks_completed_points: 450,
          skills_shared_points: 300,
          community_participation_points: 250,
          lending_activity_points: 250,
          created_at: '',
          updated_at: ''
        });

        // Load leaderboard to find user's rank
        const leaderboard = await fetchLeaderboard(100);
        const userRank = leaderboard.findIndex((item: LeaderboardItem) => item.id === Number(userId)) + 1;
        setLeaderboardRank(userRank > 0 ? userRank : null);

        // Load user's work (Note: These functions would need modification to fetch by specific user ID)
        // For now, we'll load empty arrays
        setUserJobs([]);
        setUserSkills([]);
        setUserMaterials([]);

      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  const handleStartChat = () => {
    if (userId) {
      navigate(`/dashboard/messages`);
      localStorage.setItem("openChatWith", userId);
      localStorage.setItem("openChatType", "direct");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600 mb-4">Profile not found</p>
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
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.user.avatar} alt={profile.user.name} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                      {profile.user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.user.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Mail className="h-4 w-4" />
                      <span>{profile.user.email}</span>
                    </div>
                    
                    {profile.user.bio && (
                      <p className="text-gray-600 mb-4 max-w-2xl">
                        {profile.user.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">4.8 Rating</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                        <Trophy className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{userPoints?.points || 0} Points</span>
                      </div>
                      {leaderboardRank && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Rank #{leaderboardRank}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">
                          Joined {new Date(profile.user.created_at || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:w-auto w-full">
                  <Button 
                    size="lg" 
                    onClick={handleStartChat} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start Conversation
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card id="about-section">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.user.university && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">University</div>
                        <div className="text-sm text-gray-600">{profile.user.university}</div>
                      </div>
                    </div>
                  )}
                  {profile.user.program && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">Program</div>
                        <div className="text-sm text-gray-600">{profile.user.program}</div>
                      </div>
                    </div>
                  )}
                  {profile.user.graduation_year && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">Graduation Year</div>
                        <div className="text-sm text-gray-600">{profile.user.graduation_year}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>

              {/* Portfolio */}
              {profile.portfolio && profile.portfolio.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Portfolio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.portfolio.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        )}
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Link className="h-3 w-3" />
                          View Project
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Works Section */}
          <Card id="works-section">
            <CardHeader>
              <CardTitle>Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Jobs Posted */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-gray-900">Jobs Posted</h3>
                  </div>
                  {userJobs.length > 0 ? (
                    <div className="space-y-3">
                      {userJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="p-2 border rounded-md hover:bg-gray-50 transition-colors">
                          <h4 className="font-medium text-sm text-gray-900">{job.title}</h4>
                          <p className="text-xs text-gray-500">{job.type}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No jobs posted yet</p>
                  )}
                </div>

                {/* Skills Shared */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium text-gray-900">Skills Shared</h3>
                  </div>
                  {userSkills.length > 0 ? (
                    <div className="space-y-3">
                      {userSkills.slice(0, 3).map((skill) => (
                        <div key={skill.id} className="p-2 border rounded-md hover:bg-gray-50 transition-colors">
                          <h4 className="font-medium text-sm text-gray-900">{skill.skill || skill.skill_name}</h4>
                          <p className="text-xs text-gray-500">{skill.pricing}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No skills shared yet</p>
                  )}
                </div>

                {/* Materials Listed */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium text-gray-900">Materials Listed</h3>
                  </div>
                  {userMaterials.length > 0 ? (
                    <div className="space-y-3">
                      {userMaterials.slice(0, 3).map((material) => (
                        <div key={material.id} className="p-2 border rounded-md hover:bg-gray-50 transition-colors">
                          <h4 className="font-medium text-sm text-gray-900">{material.material || material.title}</h4>
                          <p className="text-xs text-gray-500">{material.price}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No materials listed yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card id="achievements-section">
            <CardHeader>
              <CardTitle>Achievements & Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Sample achievements - replace with real data */}
                <div className="text-center p-4 border rounded-lg hover:border-blue-300 transition-colors">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-medium text-sm text-gray-900">Top Performer</p>
                  <p className="text-xs text-gray-500">1000+ points</p>
                </div>
                <div className="text-center p-4 border rounded-lg hover:border-blue-300 transition-colors">
                  <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium text-sm text-gray-900">Highly Rated</p>
                  <p className="text-xs text-gray-500">4.5+ rating</p>
                </div>
                <div className="text-center p-4 border rounded-lg hover:border-blue-300 transition-colors">
                  <Briefcase className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-sm text-gray-900">Job Creator</p>
                  <p className="text-xs text-gray-500">5+ jobs posted</p>
                </div>
                <div className="text-center p-4 border rounded-lg hover:border-blue-300 transition-colors">
                  <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-medium text-sm text-gray-900">Skill Sharer</p>
                  <p className="text-xs text-gray-500">3+ skills shared</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Points</span>
                <span className="font-medium text-gray-900">{userPoints?.points || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Leaderboard Rank</span>
                <span className="font-medium text-gray-900">
                  {leaderboardRank ? `#${leaderboardRank}` : 'Not ranked'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-900 text-sm">
                  {new Date(profile.user.created_at || '').toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium text-gray-900">4.8/5</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleStartChat}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Send Message
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                <p>Typically responds within a few hours</p>
              </div>
            </CardContent>
          </Card>

          {/* Similar Profiles Card */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-800">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">Web Developer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-800">AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Alice Smith</p>
                    <p className="text-xs text-gray-500">Graphic Designer</p>
                  </div>
                </div>
              </div>
              <Button variant="link" className="text-blue-600 p-0 mt-3 text-sm">
                View all similar profiles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PosterProfilePage;