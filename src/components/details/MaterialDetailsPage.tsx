import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Star, Trophy, MessageCircle, Share, Bookmark, MapPin, Clock, Package, Building, Award, DollarSign } from 'lucide-react';
import { MaterialType } from '@/types/marketplace';
import { getMaterialDetails } from '@/services/materials';
import { submitMaterialContact } from '@/services/contacts';
import ContactModal from '@/components/modals/ContactModal';
import { fetchUserById } from '@/services/profile';
import { fetchUserPoints } from '@/services/points';
import { toast } from 'sonner';

export default function MaterialDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<MaterialType | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [posterProfile, setPosterProfile] = useState<any>(null);
  const [posterPoints, setPosterPoints] = useState<any>(null);

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      if (!id) return;
      
      try {
        const materialData = await getMaterialDetails(parseInt(id));
        setMaterial(materialData);
        
        // Fetch poster profile and points
        if (materialData.user_id) {
          const [profile, points] = await Promise.all([
            fetchUserById(materialData.user_id.toString()),
            fetchUserPoints()
          ]);
          setPosterProfile(profile);
          setPosterPoints(points);
        }
      } catch (error) {
        console.error('Error fetching material details:', error);
        toast.error('Failed to load material details');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialDetails();
  }, [id]);

  const handleContact = async (message: string) => {
    if (!material) return;
    
    try {
      await submitMaterialContact({
        material_id: material.id,
        message
      });
      setContactModalOpen(false);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending contact:', error);
      toast.error('Failed to send message');
    }
  };

  const handlePosterClick = () => {
    if (material?.user_id) {
      navigate(`/dashboard/profile/${material.user_id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading material details...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600 mb-4">Material not found</p>
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
          {/* Material Header Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {material.title || material.name || material.material}
                    </h1>
                    {material.category && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {material.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{material.email || 'Seller'}</span>
                    </div>
                    {material.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{material.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700">{material.price}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{material.condition || material.conditions || 'Good'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Posted 2 days ago</span>
                    </div>
                  </div>
                </div>

                <Avatar className="h-16 w-16 border-2 border-white shadow-md cursor-pointer" onClick={handlePosterClick}>
                  <AvatarImage src={material.avatarUrl} alt={material.email} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {posterProfile?.user?.name?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Action Buttons */}
            <CardContent className="p-6 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setContactModalOpen(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Seller
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

          {/* Material Image */}
          {material.imageUrl && (
            <Card>
              <CardContent className="p-6">
                <img 
                  src={material.imageUrl} 
                  alt={material.title || material.name || 'Material'}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Description Section */}
          <Card id="description-section">
            <CardHeader>
              <CardTitle>Material Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">
                  {material.description || 'No description available for this material.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card id="details-section">
            <CardHeader>
              <CardTitle>Material Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {material.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">{material.location}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Condition</div>
                    <div className="text-sm text-gray-600">{material.condition || material.conditions || 'Good'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Price</div>
                    <div className="text-sm text-gray-600">{material.price}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Availability</div>
                    <div className="text-sm text-gray-600">{material.availability || 'Available'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>About the Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 cursor-pointer" onClick={handlePosterClick}>
                  <AvatarImage src={material.avatarUrl} alt={material.email} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {posterProfile?.user?.name?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 cursor-pointer" onClick={handlePosterClick}>
                    {posterProfile?.user?.name || 'Seller'}
                  </p>
                  <p className="text-sm text-gray-500">{material.email}</p>
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
                  <span>4.8/5 rating from 87 reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span>12 items listed</span>
                </div>
                {posterPoints && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span>{posterPoints.points} points</span>
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

          {/* Similar Materials Card */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <h4 className="font-medium text-gray-900">Construction Wood</h4>
                  <p className="text-sm text-gray-600">Premium quality</p>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">$45-55</span>
                    <MapPin className="h-3 w-3 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-600">Nearby</span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <h4 className="font-medium text-gray-900">Metal Sheets</h4>
                  <p className="text-sm text-gray-600">Various sizes</p>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">$30-40</span>
                    <MapPin className="h-3 w-3 text-gray-500 ml-2" />
                    <span className="text-xs text-gray-600">5 miles away</span>
                  </div>
                </div>
              </div>
              <Button variant="link" className="text-blue-600 p-0 mt-3">
                View all similar materials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        recipientName={posterProfile?.user?.name || 'Seller'}
        recipientId={material.user_id}
        itemName={material.title || material.name || material.material || 'Material'}
        itemId={material.id}
        itemType="material"
        isOpen={contactModalOpen}
        onOpenChange={setContactModalOpen}
      />

      {/* Sticky Contact Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button 
          onClick={() => setContactModalOpen(true)}
          size="lg" 
          className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 h-14 w-14 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}