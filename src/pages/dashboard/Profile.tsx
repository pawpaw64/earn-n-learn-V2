
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Pencil, Plus, Image, Trash2, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Define interfaces for the profile data structure
interface Skill {
  id: string;
  name: string;
  description: string;
  acquiredFrom: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
}

interface Website {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  program: string;
  graduationYear: string;
  skills: Skill[];
  portfolio: PortfolioItem[];
  websites: Website[];
}

export default function Profile() {
  // State management
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Student at Local University, passionate about technology and innovation.",
    avatar: "",
    program: "Computer Science",
    graduationYear: "2025",
    skills: [
      { id: "1", name: "React", description: "Frontend development with React", acquiredFrom: "Online course" },
      { id: "2", name: "MySQL", description: "Database management", acquiredFrom: "University course" }
    ],
    portfolio: [
      { id: "1", title: "Campus Marketplace", description: "A platform for students to buy and sell items", url: "https://github.com/johndoe/campus-marketplace", type: "github" }
    ],
    websites: [
      { id: "1", title: "GitHub", url: "https://github.com/johndoe", icon: "github" },
      { id: "2", title: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: "linkedin" }
    ]
  });
  
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
      graduationYear: profile.graduationYear,
    }
  });

  // Fetch user profile data
  useEffect(() => {
    // This would be replaced with actual API call in a real implementation
    // fetchUserProfile().then(data => setProfile(data));
    
    // For now, we'll use the mock data already in state
  }, []);

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
  const onSubmitBasicInfo = (data: any) => {
    const updatedProfile = {
      ...profile,
      ...data,
      avatar: avatarPreview || profile.avatar,
    };
    
    // This would be an API call in a real implementation
    // updateUserProfile(updatedProfile).then(() => {
    //   setProfile(updatedProfile);
    //   setIsEditingBasic(false);
    //   toast.success("Profile updated successfully!");
    // });
    
    // For now, we'll just update the state
    setProfile(updatedProfile);
    setIsEditingBasic(false);
    toast.success("Profile updated successfully!");
  };

  // Add new skill
  const addSkill = () => {
    if (!newSkill.name) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name || "",
      description: newSkill.description || "",
      acquiredFrom: newSkill.acquiredFrom || ""
    };
    
    setProfile({
      ...profile,
      skills: [...profile.skills, skill]
    });
    
    setNewSkill({});
    toast.success("Skill added!");
  };

  // Remove skill
  const removeSkill = (id: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill.id !== id)
    });
    toast.success("Skill removed!");
  };

  // Add new portfolio item
  const addPortfolioItem = () => {
    if (!newPortfolio.title || !newPortfolio.url) return;
    
    const item: PortfolioItem = {
      id: Date.now().toString(),
      title: newPortfolio.title || "",
      description: newPortfolio.description || "",
      url: newPortfolio.url || "",
      type: newPortfolio.type || "other"
    };
    
    setProfile({
      ...profile,
      portfolio: [...profile.portfolio, item]
    });
    
    setNewPortfolio({});
    toast.success("Portfolio item added!");
  };

  // Remove portfolio item
  const removePortfolioItem = (id: string) => {
    setProfile({
      ...profile,
      portfolio: profile.portfolio.filter(item => item.id !== id)
    });
    toast.success("Portfolio item removed!");
  };

  // Add new website link
  const addWebsite = () => {
    if (!newWebsite.title || !newWebsite.url) return;
    
    const website: Website = {
      id: Date.now().toString(),
      title: newWebsite.title || "",
      url: newWebsite.url || "",
      icon: newWebsite.icon || "link"
    };
    
    setProfile({
      ...profile,
      websites: [...profile.websites, website]
    });
    
    setNewWebsite({});
    toast.success("Website link added!");
  };

  // Remove website link
  const removeWebsite = (id: string) => {
    setProfile({
      ...profile,
      websites: profile.websites.filter(website => website.id !== id)
    });
    toast.success("Website link removed!");
  };
  
  // Reset form when canceling edit
  const handleCancelEdit = () => {
    reset({
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      program: profile.program,
      graduationYear: profile.graduationYear,
    });
    setIsEditingBasic(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {/* Basic User Information Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          {!isEditingBasic ? (
            <Button onClick={() => setIsEditingBasic(true)} variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancelEdit} variant="outline" size="sm">Cancel</Button>
            </div>
          )}
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
                <p className="text-gray-700 mb-4">{profile.bio}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Program</h3>
                    <p>{profile.program}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Graduation Year</h3>
                    <p>{profile.graduationYear}</p>
                  </div>
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
              {profile.skills.map((skill) => (
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            
            {/* Add Skill Dialog */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.portfolio.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {item.url}
                    </a>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removePortfolioItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Add Portfolio Dialog */}
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeWebsite(website.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            
            {/* Add Website Dialog */}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
