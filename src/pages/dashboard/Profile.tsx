
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { User, Pencil, Plus, Image, Trash2, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { fetchUserProfile, fetchUserById, updateUserProfile, uploadProfileImage, ProfileData } from "@/services/profile";
import { getUserIdFromToken } from "@/services/auth";

// Define interfaces for the profile data structure
interface Skill {
  id: string;
  name: string;
  description?: string;
  acquiredFrom?: string;
  user_id: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  type?: string;
  user_id: string;
}

interface Website {
  id: string;
  title: string;
  url: string;
  icon?: string;
  user_id: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  student_id?: string;
  university?: string;
  course?: string;
  program?: string;
  graduation_year?: string;
  mobile?: string;
  created_at?: string;
  skills: Skill[];
  portfolio: PortfolioItem[];
  websites: Website[];
}

export default function Profile() {
  // Get userId from URL parameter or use current user
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken(localStorage.getItem('token'));
  const isOwnProfile = !userId || userId === currentUserId?.toString();
  
  // State management
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    bio: "",
    avatar: "",
    program: "",
    graduation_year: "",
    skills: [],
    portfolio: [],
    websites: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({});
  const [newPortfolio, setNewPortfolio] = useState<Partial<PortfolioItem>>({});
  const [newWebsite, setNewWebsite] = useState<Partial<Website>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Form handling
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      program: profile.program,
      graduationYear: profile.graduation_year,
    }
  });

  // Fetch user profile data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        let profileData: ProfileData | null;
        
        if (userId && userId !== currentUserId?.toString()) {
          // Fetch other user's profile
          profileData = await fetchUserById(userId);
        } else {
          // Fetch current user's profile
          profileData = await fetchUserProfile();
        }
        
        if (profileData) {
          const { user, skills, portfolio, websites } = profileData;
          setProfile({
            ...user,
            skills: skills || [],
            portfolio: portfolio || [],
            websites: websites || []
          });
          
          // Update form defaults
          reset({
            name: user.name,
            email: user.email,
            bio: user.bio || "",
            program: user.program || "",
            graduationYear: user.graduation_year || "",
          });
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Something went wrong while loading the profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [userId, currentUserId, reset]);

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const onSubmitBasicInfo = async (data: any) => {
    try {
      let avatarUrl = profile.avatar;
      
      // Upload avatar if changed
      if (avatarFile) {
        try {
          avatarUrl = await uploadProfileImage(avatarFile);
        } catch (error) {
          console.error("Avatar upload failed:", error);
          toast.error("Failed to upload profile picture");
        }
      }
      
      const profileData = {
        name: data.name,
        bio: data.bio,
        avatar: avatarUrl,
        program: data.program,
        graduationYear: data.graduationYear
      };
      
      const response = await updateUserProfile(profileData);
      
      if (response.success) {
        setProfile({
          ...profile,
          name: data.name,
          bio: data.bio,
          avatar: avatarUrl,
          program: data.program,
          graduation_year: data.graduationYear
        });
        setIsEditingBasic(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error updating profile");
    }
  };

  // Add new skill
  const addSkill = () => {
    if (!newSkill.name) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name || "",
      description: newSkill.description || "",
      acquiredFrom: newSkill.acquiredFrom || "",
      user_id: profile.id
    };
    
    setProfile({
      ...profile,
      skills: [...profile.skills, skill]
    });
    
    setNewSkill({});
    toast.success("Skill added!");
    
    // TODO: Send to backend when API is ready
  };

  // Remove skill
  const removeSkill = (id: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill.id !== id)
    });
    toast.success("Skill removed!");
    
    // TODO: Send to backend when API is ready
  };

  // Add new portfolio item
  const addPortfolioItem = () => {
    if (!newPortfolio.title || !newPortfolio.url) return;
    
    const item: PortfolioItem = {
      id: Date.now().toString(),
      title: newPortfolio.title || "",
      description: newPortfolio.description || "",
      url: newPortfolio.url || "",
      type: newPortfolio.type || "other",
      user_id: profile.id
    };
    
    setProfile({
      ...profile,
      portfolio: [...profile.portfolio, item]
    });
    
    setNewPortfolio({});
    toast.success("Portfolio item added!");
    
    // TODO: Send to backend when API is ready
  };

  // Remove portfolio item
  const removePortfolioItem = (id: string) => {
    setProfile({
      ...profile,
      portfolio: profile.portfolio.filter(item => item.id !== id)
    });
    toast.success("Portfolio item removed!");
    
    // TODO: Send to backend when API is ready
  };

  // Add new website link
  const addWebsite = () => {
    if (!newWebsite.title || !newWebsite.url) return;
    
    const website: Website = {
      id: Date.now().toString(),
      title: newWebsite.title || "",
      url: newWebsite.url || "",
      icon: newWebsite.icon || "link",
      user_id: profile.id
    };
    
    setProfile({
      ...profile,
      websites: [...profile.websites, website]
    });
    
    setNewWebsite({});
    toast.success("Website link added!");
    
    // TODO: Send to backend when API is ready
  };

  // Remove website link
  const removeWebsite = (id: string) => {
    setProfile({
      ...profile,
      websites: profile.websites.filter(website => website.id !== id)
    });
    toast.success("Website link removed!");
    
    // TODO: Send to backend when API is ready
  };
  
  // Reset form when canceling edit
  const handleCancelEdit = () => {
    reset({
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      program: profile.program,
      graduationYear: profile.graduation_year,
    });
    setIsEditingBasic(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex items-center justify-center h-64">
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{isOwnProfile ? 'My Profile' : `${profile.name}'s Profile`}</h1>
      
      {/* Basic User Information Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          {isOwnProfile && !isEditingBasic ? (
            <Button onClick={() => setIsEditingBasic(true)} variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          ) : isOwnProfile && isEditingBasic ? (
            <div className="flex gap-2">
              <Button onClick={handleCancelEdit} variant="outline" size="sm">Cancel</Button>
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          {!isEditingBasic ? (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  {profile.avatar ? (
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <p className="text-gray-500 mb-2">{profile.email}</p>
                <p className="text-gray-700 mb-4">{profile.bio || "No bio available"}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Program</h3>
                    <p>{profile.program || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Graduation Year</h3>
                    <p>{profile.graduation_year || "Not specified"}</p>
                  </div>
                  {profile.university && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">University</h3>
                      <p>{profile.university}</p>
                    </div>
                  )}
                  {profile.course && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Course</h3>
                      <p>{profile.course}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitBasicInfo)} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-4">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Preview" />
                    ) : profile.avatar ? (
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="avatar-upload" 
                      className="flex flex-col items-center justify-center w-full h-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Image className="w-4 h-4 mr-2" />
                        <p className="text-xs">Upload Photo</p>
                      </div>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange} 
                      />
                    </label>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <Input 
                        id="name" 
                        {...register("name", { required: "Name is required" })} 
                        placeholder="Your name" 
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Input 
                        id="email" 
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })} 
                        placeholder="Your email" 
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="program" className="block text-sm font-medium text-gray-700">Program</label>
                      <Input 
                        id="program" 
                        {...register("program")} 
                        placeholder="Your program or major" 
                      />
                    </div>
                    <div>
                      <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">Graduation Year</label>
                      <Input 
                        id="graduationYear" 
                        {...register("graduationYear")} 
                        placeholder="Expected graduation year" 
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <Textarea 
                      id="bio" 
                      {...register("bio")} 
                      placeholder="Tell us about yourself" 
                      className="h-24"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      
      {/* Skills Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-2">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <li key={skill.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{skill.name}</h3>
                      {skill.description && (
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      )}
                      {skill.acquiredFrom && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Acquired from:</span> {skill.acquiredFrom}
                        </p>
                      )}
                    </div>
                    {isOwnProfile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </ul>
            
            {/* Add Skill Dialog - Only show for own profile */}
            {isOwnProfile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <label htmlFor="skillName" className="block text-sm font-medium">Skill Name</label>
                      <Input 
                        id="skillName" 
                        value={newSkill.name || ""}
                        onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                        placeholder="e.g., JavaScript, Design, Project Management" 
                      />
                    </div>
                    <div>
                      <label htmlFor="skillDescription" className="block text-sm font-medium">Description</label>
                      <Textarea 
                        id="skillDescription" 
                        value={newSkill.description || ""}
                        onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                        placeholder="Describe your skill level or experience" 
                      />
                    </div>
                    <div>
                      <label htmlFor="skillAcquiredFrom" className="block text-sm font-medium">Acquired From</label>
                      <Input 
                        id="skillAcquiredFrom" 
                        value={newSkill.acquiredFrom || ""}
                        onChange={(e) => setNewSkill({...newSkill, acquiredFrom: e.target.value})}
                        placeholder="e.g., University course, Online course, Self-taught" 
                      />
                    </div>
                    <Button onClick={addSkill} className="w-full">Add Skill</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Portfolio Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.portfolio.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-600 mb-2">{item.description || "No description provided"}</p>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {item.url}
                      </a>
                    </CardContent>
                    {isOwnProfile && (
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removePortfolioItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No portfolio items added yet.</p>
            )}
            
            {/* Add Portfolio Dialog - Only show for own profile */}
            {isOwnProfile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Portfolio Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Portfolio Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <label htmlFor="portfolioTitle" className="block text-sm font-medium">Title</label>
                      <Input 
                        id="portfolioTitle" 
                        value={newPortfolio.title || ""}
                        onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})}
                        placeholder="Project Title" 
                      />
                    </div>
                    <div>
                      <label htmlFor="portfolioDescription" className="block text-sm font-medium">Description</label>
                      <Textarea 
                        id="portfolioDescription" 
                        value={newPortfolio.description || ""}
                        onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                        placeholder="Describe your project" 
                      />
                    </div>
                    <div>
                      <label htmlFor="portfolioURL" className="block text-sm font-medium">URL</label>
                      <Input 
                        id="portfolioURL" 
                        value={newPortfolio.url || ""}
                        onChange={(e) => setNewPortfolio({...newPortfolio, url: e.target.value})}
                        placeholder="https://..." 
                      />
                    </div>
                    <div>
                      <label htmlFor="portfolioType" className="block text-sm font-medium">Type</label>
                      <Input 
                        id="portfolioType" 
                        value={newPortfolio.type || ""}
                        onChange={(e) => setNewPortfolio({...newPortfolio, type: e.target.value})}
                        placeholder="e.g., GitHub, Website, Document" 
                      />
                    </div>
                    <Button onClick={addPortfolioItem} className="w-full">Add Portfolio Item</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Website Links Section */}
      <Card>
        <CardHeader>
          <CardTitle>Website Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.websites.length > 0 ? (
              <ul className="space-y-2">
                {profile.websites.map((website) => (
                  <li key={website.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      <div>
                        <h3 className="font-medium">{website.title}</h3>
                        <a 
                          href={website.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {website.url}
                        </a>
                      </div>
                    </div>
                    {isOwnProfile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeWebsite(website.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No website links added yet.</p>
            )}
            
            {/* Add Website Dialog - Only show for own profile */}
            {isOwnProfile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Website Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Website Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <label htmlFor="websiteTitle" className="block text-sm font-medium">Title</label>
                      <Input 
                        id="websiteTitle" 
                        value={newWebsite.title || ""}
                        onChange={(e) => setNewWebsite({...newWebsite, title: e.target.value})}
                        placeholder="e.g., GitHub, LinkedIn, Personal Blog" 
                      />
                    </div>
                    <div>
                      <label htmlFor="websiteURL" className="block text-sm font-medium">URL</label>
                      <Input 
                        id="websiteURL" 
                        value={newWebsite.url || ""}
                        onChange={(e) => setNewWebsite({...newWebsite, url: e.target.value})}
                        placeholder="https://..." 
                      />
                    </div>
                    <Button onClick={addWebsite} className="w-full">Add Website Link</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
