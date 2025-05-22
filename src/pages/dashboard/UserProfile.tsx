
import React from "react";
import { useParams } from "react-router-dom";
import UserProfileView from "@/components/profile/UserProfileView";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-bold">User ID not provided</h2>
        <p className="text-muted-foreground">Cannot display profile without a user ID</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfileView />
    </div>
  );
}
