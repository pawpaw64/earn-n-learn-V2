import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/dashboard-global.css";
import { User, Pencil, Plus, Image, Trash2, Link, Trophy, Settings } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    fetchUserProfile,
    fetchUserById,
    updateUserProfile,
    uploadProfileImage,
    ProfileData,
    addUserSkill,
    removeUserSkill,
    addPortfolioItem as addPortfolioItemService,
    removePortfolioItem,
    addUserWebsite,
    removeUserWebsite,
} from "@/services/profile";
import { getUserIdFromToken } from "@/services/auth";
import PointsOverview from "@/components/profile/PointsOverview";
import Achievements from "@/components/profile/Achievements";
import Leaderboard from "@/pages/dashboard/Leaderboard";
import ProfileSettings from "@/components/profile/ProfileSettings";

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
    const currentUserId = getUserIdFromToken(localStorage.getItem("token"));
    const isOwnProfile = !userId || userId === currentUserId?.toString();
    console.log("Profile component - userId from params:", userId);
    console.log("Profile component - currentUserId:", currentUserId);
    console.log("Profile component - isOwnProfile:", isOwnProfile);
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
        websites: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [newSkill, setNewSkill] = useState<Partial<Skill>>({});
    const [newPortfolio, setNewPortfolio] = useState<Partial<PortfolioItem>>({});
    const [newWebsite, setNewWebsite] = useState<Partial<Website>>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Form handling
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: profile.name,
            email: profile.email,
            bio: profile.bio,
            program: profile.program,
            graduationYear: profile.graduation_year,
        },
    });

    // Fetch user profile data
    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                let profileData: ProfileData | null = null;

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
                        websites: websites || [],
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
                    console.error("Profile data is null");
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
            console.log("Avatar file selected:", file.name);

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
            console.log("Submitting profile with avatar file:", avatarFile?.name);

            const profileData = {
                name: data.name,
                bio: data.bio,
                program: data.program,
                graduationYear: data.graduationYear,
            };

            const response = await updateUserProfile(profileData, avatarFile);
            console.log("Profile update response:", response);

            if (response.success) {
                // Update local state with new data
                const updatedProfile = {
                    ...profile,
                    name: data.name,
                    bio: data.bio,
                    program: data.program,
                    graduation_year: data.graduationYear,
                };

                // If avatar was uploaded, update it
                if (response.avatar) {
                    console.log("Updating avatar URL to:", response.avatar);
                    updatedProfile.avatar = response.avatar;

                    // Update user data in localStorage
                    const userData = JSON.parse(localStorage.getItem("user") || "{}");
                    userData.avatar = response.avatar;
                    localStorage.setItem("user", JSON.stringify(userData));
                }

                setProfile(updatedProfile);
                setIsEditingBasic(false);
                setAvatarFile(null);
                setAvatarPreview(null);
                toast.success("Profile updated successfully!");
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Error updating profile");
        }
    };

    // Add new skill with backend call
    const addSkill = async () => {
        if (!newSkill.name) {
            toast.error("Skill name is required");
            return;
        }

        try {
            const response = await addUserSkill({
                name: newSkill.name,
                description: newSkill.description,
                acquiredFrom: newSkill.acquiredFrom,
            });

            if (response.success) {
                // Reload profile data to get updated skills
                const profileData = await fetchUserProfile();
                if (profileData) {
                    const { user, skills, portfolio, websites } = profileData;
                    setProfile({
                        ...user,
                        skills: skills || [],
                        portfolio: portfolio || [],
                        websites: websites || [],
                    });
                }

                setNewSkill({});
                toast.success("Skill added successfully!");
            }
        } catch (error) {
            console.error("Error adding skill:", error);
            toast.error("Failed to add skill");
        }
    };

    // Remove skill with backend call
    const removeSkill = async (id: string) => {
        try {
            const response = await removeUserSkill(id);

            if (response.success) {
                // Reload profile data to get updated skills
                const profileData = await fetchUserProfile();
                if (profileData) {
                    const { user, skills, portfolio, websites } = profileData;
                    setProfile({
                        ...user,
                        skills: skills || [],
                        portfolio: portfolio || [],
                        websites: websites || [],
                    });
                }

                toast.success("Skill removed successfully!");
            }
        } catch (error) {
            console.error("Error removing skill:", error);
            toast.error("Failed to remove skill");
        }
    };

    // Add new portfolio item with backend call
    const addPortfolioItem = async () => {
        if (!newPortfolio.title || !newPortfolio.url) {
            toast.error("Title and URL are required");
            return;
        }

        try {
            const response = await addPortfolioItemService({
                title: newPortfolio.title,
                description: newPortfolio.description,
                url: newPortfolio.url,
                type: newPortfolio.type,
            });

            if (response.success) {
                // Reload profile data to get updated portfolio
                const profileData = await fetchUserProfile();
                if (profileData) {
                    const { user, skills, portfolio, websites } = profileData;
                    setProfile({
                        ...user,
                        skills: skills || [],
                        portfolio: portfolio || [],
                        websites: websites || [],
                    });
                }

                setNewPortfolio({});
                toast.success("Portfolio item added successfully!");
            }
        } catch (error) {
            console.error("Error adding portfolio item:", error);
            toast.error("Failed to add portfolio item");
        }
    };

    // Remove portfolio item with backend call
    const handleRemovePortfolioItem = async (id: string) => {
        try {
            const response = await removePortfolioItem(id);

            if (response.success) {
                // Reload profile data to get updated portfolio
                const profileData = await fetchUserProfile();
                if (profileData) {
                    const { user, skills, portfolio, websites } = profileData;
                    setProfile({
                        ...user,
                        skills: skills || [],
                        portfolio: portfolio || [],
                        websites: websites || [],
                    });
                }

                toast.success("Portfolio item removed successfully!");
            }
        } catch (error) {
            console.error("Error removing portfolio item:", error);
            toast.error("Failed to remove portfolio item");
        }
    };

    // Add new website with backend call
    const addWebsite = async () => {
        if (!newWebsite.title || !newWebsite.url) {
            toast.error("Title and URL are required");
            return;
        }

        try {
            const response = await addUserWebsite({
                title: newWebsite.title,
                url: newWebsite.url,
                icon: newWebsite.icon,
            });

            if (response.success) {
                // Reload profile data to get updated websites
                const profileData = await fetchUserProfile();
                if (profileData) {
                    const { user, skills, portfolio, websites } = profileData;
                    setProfile({
                        ...user,
                        skills: skills || [],
                        portfolio: portfolio || [],
                        websites: websites || [],
                    });
                }

                setNewWebsite({});
                toast.success("Website link added successfully!");
            }
        } catch (error) {
            console.error("Error adding website:", error);
            toast.error("Failed to add website link");
        }
    };

    // Remove website with backend call
    const removeWebsite = async (id: string) => {
        try {
            const response = await removeUserWebsite(id);

            if (response.success) {
                // Reload profile data to get updated websites
                const profileData = await fetchUserProfile();
                if (profileData) {
                    const { user, skills, portfolio, websites } = profileData;
                    setProfile({
                        ...user,
                        skills: skills || [],
                        portfolio: portfolio || [],
                        websites: websites || [],
                    });
                }

                toast.success("Website link removed successfully!");
            }
        } catch (error) {
            console.error("Error removing website:", error);
            toast.error("Failed to remove website link");
        }
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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Your Profile</h1>
                {!isOwnProfile && (
                    <Button
                        onClick={() => navigate("/dashboard/profile")}
                        variant="outline">
                        Back to My Profile
                    </Button>
                )}
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile Info
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Leaderboard
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    {/* Basic User Information Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Profile Image</CardTitle>
                                <p className="text-sm text-muted-foreground">Upload a photo to personalize your profile</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
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
                                {isOwnProfile && (
                                    <div className="flex items-center justify-center">
                                        <label
                                            htmlFor="avatar-upload"
                                            className="flex items-center gap-2 px-4 py-2 border border-dashed border-muted-foreground rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                            <Plus className="h-4 w-4" />
                                            <span className="text-sm">Upload photo</span>
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Information Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Basic Information</CardTitle>
                                <p className="text-sm text-muted-foreground">Tell us about yourself</p>
                            </div>
                            {isOwnProfile && !isEditingBasic ? (
                                <Button
                                    onClick={() => setIsEditingBasic(true)}
                                    variant="outline"
                                    size="sm">
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            ) : isOwnProfile && isEditingBasic ? (
                                <div className="flex gap-2">
                                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                        Cancel
                                    </Button>
                                </div>
                            ) : null}
                        </CardHeader>
                        <CardContent>
                            {!isEditingBasic ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                        <p className="text-lg font-medium">{profile.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Bio</label>
                                        <p className="text-sm text-muted-foreground">{profile.bio || "No bio added yet"}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Program</label>
                                            <p className="text-sm">{profile.program || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Graduation Year</label>
                                            <p className="text-sm">{profile.graduation_year || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmitBasicInfo)} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium">
                                            Full Name
                                        </label>
                                        <Input
                                            id="name"
                                            {...register("name", { required: "Name is required" })}
                                            placeholder="Your name"
                                        />
                                        {errors.name && (
                                            <p className="text-destructive text-sm">{errors.name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-medium">
                                            Bio
                                        </label>
                                        <Textarea
                                            id="bio"
                                            {...register("bio")}
                                            placeholder="Tell us about yourself"
                                            className="h-24"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="program" className="block text-sm font-medium">
                                                Program
                                            </label>
                                            <Input
                                                id="program"
                                                {...register("program")}
                                                placeholder="Your program or major"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="graduationYear" className="block text-sm font-medium">
                                                Graduation Year
                                            </label>
                                            <Input
                                                id="graduationYear"
                                                {...register("graduationYear")}
                                                placeholder="Expected graduation year"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit">Save Changes</Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Points Overview */}
                    <PointsOverview />

                    {/* Achievements */}
                    <Achievements />

                    {/* Skills Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {profile.skills.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {profile.skills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                className="flex justify-between items-start p-4 border rounded-lg hover:shadow transition-shadow">
                                                <div className="space-y-1">
                                                    <h3 className="font-medium">{skill.name}</h3>
                                                    {skill.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {skill.description}
                                                        </p>
                                                    )}
                                                    {skill.acquiredFrom && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            <span className="font-medium">Acquired from:</span>{" "}
                                                            {skill.acquiredFrom}
                                                        </p>
                                                    )}
                                                </div>
                                                {isOwnProfile && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSkill(skill.id)}
                                                        className="text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground py-4 text-center">
                                        No skills added yet.
                                    </p>
                                )}

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
                                                    <label htmlFor="skillName" className="block text-sm font-medium">
                                                        Skill Name
                                                    </label>
                                                    <Input
                                                        id="skillName"
                                                        value={newSkill.name || ""}
                                                        onChange={(e) =>
                                                            setNewSkill({ ...newSkill, name: e.target.value })
                                                        }
                                                        placeholder="e.g., JavaScript, Design, Project Management"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="skillDescription" className="block text-sm font-medium">
                                                        Description
                                                    </label>
                                                    <Textarea
                                                        id="skillDescription"
                                                        value={newSkill.description || ""}
                                                        onChange={(e) =>
                                                            setNewSkill({
                                                                ...newSkill,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Describe your skill level or experience"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="skillAcquiredFrom" className="block text-sm font-medium">
                                                        Acquired From
                                                    </label>
                                                    <Input
                                                        id="skillAcquiredFrom"
                                                        value={newSkill.acquiredFrom || ""}
                                                        onChange={(e) =>
                                                            setNewSkill({
                                                                ...newSkill,
                                                                acquiredFrom: e.target.value,
                                                            })
                                                        }
                                                        placeholder="e.g., University course, Online course, Self-taught"
                                                    />
                                                </div>
                                                <Button onClick={addSkill} className="w-full">
                                                    Add Skill
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Portfolio Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Portfolio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {profile.portfolio.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {profile.portfolio.map((item) => (
                                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                                                <CardHeader className="p-4 pb-2">
                                                    <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                        {item.description || "No description provided"}
                                                    </p>
                                                    <div className="flex items-center">
                                                        <Link className="h-4 w-4 mr-1 text-muted-foreground" />
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline truncate"
                                                            title={item.url}>
                                                            {item.url.replace(/^https?:\/\//, "")}
                                                        </a>
                                                    </div>
                                                </CardContent>
                                                {isOwnProfile && (
                                                    <CardFooter className="p-4 pt-0 flex justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemovePortfolioItem(item.id)}
                                                            className="text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </CardFooter>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No portfolio items added yet.</p>
                                )}

                                {/* Add Portfolio Dialog */}
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
                                                    <label htmlFor="portfolioTitle" className="block text-sm font-medium">
                                                        Title
                                                    </label>
                                                    <Input
                                                        id="portfolioTitle"
                                                        value={newPortfolio.title || ""}
                                                        onChange={(e) =>
                                                            setNewPortfolio({ ...newPortfolio, title: e.target.value })
                                                        }
                                                        placeholder="Project Title"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="portfolioDescription" className="block text-sm font-medium">
                                                        Description
                                                    </label>
                                                    <Textarea
                                                        id="portfolioDescription"
                                                        value={newPortfolio.description || ""}
                                                        onChange={(e) =>
                                                            setNewPortfolio({ ...newPortfolio, description: e.target.value })
                                                        }
                                                        placeholder="Describe your project"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="portfolioURL" className="block text-sm font-medium">
                                                        URL
                                                    </label>
                                                    <Input
                                                        id="portfolioURL"
                                                        value={newPortfolio.url || ""}
                                                        onChange={(e) =>
                                                            setNewPortfolio({ ...newPortfolio, url: e.target.value })
                                                        }
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <Button onClick={addPortfolioItem} className="w-full">
                                                    Add Portfolio Item
                                                </Button>
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
                                            <li
                                                key={website.id}
                                                className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center">
                                                    <Link className="h-4 w-4 mr-2" />
                                                    <div>
                                                        <h3 className="font-medium">{website.title}</h3>
                                                        <a
                                                            href={website.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline">
                                                            {website.url}
                                                        </a>
                                                    </div>
                                                </div>
                                                {isOwnProfile && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeWebsite(website.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground">No website links added yet.</p>
                                )}

                                {/* Add Website Dialog */}
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
                                                    <label htmlFor="websiteTitle" className="block text-sm font-medium">
                                                        Title
                                                    </label>
                                                    <Input
                                                        id="websiteTitle"
                                                        value={newWebsite.title || ""}
                                                        onChange={(e) =>
                                                            setNewWebsite({ ...newWebsite, title: e.target.value })
                                                        }
                                                        placeholder="e.g., GitHub, LinkedIn, Personal Blog"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="websiteURL" className="block text-sm font-medium">
                                                        URL
                                                    </label>
                                                    <Input
                                                        id="websiteURL"
                                                        value={newWebsite.url || ""}
                                                        onChange={(e) =>
                                                            setNewWebsite({ ...newWebsite, url: e.target.value })
                                                        }
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <Button onClick={addWebsite} className="w-full">
                                                    Add Website Link
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leaderboard">
                    <Leaderboard />
                </TabsContent>

                <TabsContent value="settings">
                    <ProfileSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}