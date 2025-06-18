
import React from 'react';
import { PostFeed } from '@/components/campus/PostFeed';

export default function Campus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campus Hub</h1>
        <p className="text-muted-foreground">
          Connect, share knowledge, and engage with your campus community
        </p>
      </div>
      
      <PostFeed />
    </div>
  );
}
