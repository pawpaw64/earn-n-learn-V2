import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Star, Trophy, MessageCircle, Share, Bookmark, Award, Clock, User, DollarSign } from 'lucide-react';
import { SkillType } from '@/types/marketplace';
import { getSkillDetails } from '@/services/skills';
import { submitSkillContact } from '@/services/contacts';
import ContactModal from '@/components/modals/ContactModal';
import { fetchUserById } from '@/services/profile';
import { fetchUserPoints } from '@/services/points';
import { toast } from 'sonner';

export default function SkillDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<SkillType | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [posterProfile, setPosterProfile] = useState<any>(null);
  const [posterPoints, setPosterPoints] = useState<any>(null);

  useEffect(() => {
    const fetchSkillDetails = async () => {
      if (!id) return;
      
      try {
        const skillData = await getSkillDetails(parseInt(id));
        setSkill(skillData);
        
        // Fetch poster profile and points
        if (skillData.user_id) {
          const [profile, points] = await Promise.all([
            fetchUserById(skillData.user_id.toString()),
            fetchUserPoints()
          ]);
          setPosterProfile(profile);
          setPosterPoints(points);
        }
      } catch (error) {
        console.error('Error fetching skill details:', error);
        toast.error('Failed to load skill details');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillDetails();
  }, [id]);

  const handleContact = async (message: string) => {
    if (!skill) return;
    
    try {
      await submitSkillContact({
        skill_id: skill.id,
        message
      });
      setContactModalOpen(false);
      toast.success('Request sent successfully!');
    } catch (error) {
      console.error('Error sending contact:', error);
      toast.error('Failed to send request');
    }
  };

  const handlePosterClick = () => {
    if (skill?.user_id) {
      navigate(`/dashboard/profile/${skill.user_id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600 mb-4">Skill not found</p>
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
            onClick={() => navigate('/dashboard/browse')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Header Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {skill.skill_name || skill.name || skill.skill}
                    </h1>
                    {skill.category && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {skill.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{posterProfile?.name || 'Instructor'}</span>
                    </div>
                    {skill.availability && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{skill.availability}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700">{skill.pricing}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{skill.experienceLevel || 'Beginner'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Posted 3 days ago</span>
                    </div>
                  </div>
                </div>

                <Avatar className="h-16 w-16 border-2 border-white shadow-md cursor-pointer" onClick={handlePosterClick}>
                  <AvatarImage src={skill.avatarUrl} alt={posterProfile?.name} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {posterProfile?.name?.charAt(0) || 'I'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Action Buttons */}
            <CardContent className="p-6 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setContactModalOpen(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Request Skill
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="lg" className="flex-1">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card id="description-section">
            <CardHeader>
              <CardTitle>Skill Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">
                  {skill.description || 'No description available for this skill.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card id="details-section">
            <CardHeader>
              <CardTitle>Skill Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Pricing</div>
                    <div className="text-sm text-gray-600">{skill.pricing}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Award className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Experience Level</div>
                    <div className="text-sm text-gray-600">{skill.experienceLevel || 'Beginner'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Duration</div>
                    <div className="text-sm text-gray-600">{skill.availability || 'Flexible'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Star className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Availability</div>
                    <div className="text-sm text-gray-600">{skill.availability || 'Available'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>About the Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 cursor-pointer" onClick={handlePosterClick}>
                  <AvatarImage src={skill.avatarUrl} alt={posterProfile?.name} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {posterProfile?.name?.charAt(0) || 'I'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 cursor-pointer" onClick={handlePosterClick}>
                    {posterProfile?.name || 'Instructor'}
                  </p>
                  <p className="text-sm text-gray-500">Verified Instructor</p>
                </div>
              </div>

              {posterProfile?.bio && (
                <p className="text-sm text-gray-600">
                  {posterProfile.bio}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.8/5 rating from 124 reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span>5 skills taught</span>
                </div>
                {posterPoints && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span>{posterPoints.total_points} points</span>
                  </div>
                )}
              </div>

              <Button 
                onClick={handlePosterClick}
                variant="outline" 
                className="w-full"
              >
                View Full Profile
              </Button>
            </CardContent>
          </Card>

          {/* Similar Skills Card */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg hover:border-green-300 cursor-pointer transition-colors">
                  <h4 className="font-medium text-gray-900">Web Development</h4>
                  <p className="text-sm text-gray-600">Full-stack training</p>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">$45-55/hr</span>
                    <Award className="h-3 w-3 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-600">Intermediate</span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:border-green-300 cursor-pointer transition-colors">
                  <h4 className="font-medium text-gray-900">Graphic Design</h4>
                  <p className="text-sm text-gray-600">Adobe Suite mastery</p>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">$40-50/hr</span>
                    <Award className="h-3 w-3 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-600">Beginner</span>
                  </div>
                </div>
              </div>
              <Button variant="link" className="text-green-600 p-0 mt-3">
                View all similar skills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        recipientName={posterProfile?.user?.name || 'Instructor'}
        recipientId={skill.user_id}
        itemName={skill.skill_name || skill.name || skill.skill || 'Skill'}
        itemId={skill.id}
        itemType="skill"
        isOpen={contactModalOpen}
        onOpenChange={setContactModalOpen}
      />

      {/* Sticky Contact Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button 
          onClick={() => setContactModalOpen(true)}
          size="lg" 
          className="rounded-full shadow-lg bg-green-600 hover:bg-green-700 h-14 w-14 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}