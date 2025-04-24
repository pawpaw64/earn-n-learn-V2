import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { fetchUserProfile } from "@/services";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
}

const Profile = () => {
  // Mock user profile data
  const userProfile: UserProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Software Engineer | Web Developer | Open Source Enthusiast",
    location: "New York, USA",
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6">
          <Avatar src={userProfile.avatarUrl} alt={userProfile.name} className="w-32 h-32 rounded-full mb-4" />
          <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
          <p className="text-gray-500">{userProfile.email}</p>
          <p className="text-gray-700 mt-4 text-center">{userProfile.bio}</p>
          <p className="text-gray-600 mt-2">Location: {userProfile.location}</p>
          <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
