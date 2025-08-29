
import React from 'react';
import { PostFeed } from '@/components/campus/PostFeed';
import "../../styles/dashboard-global.css";

export default function Campus() {
  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-content-area space-y-6">
        <div>
          <h1 className="dashboard-header text-3xl font-bold">Campus Hub</h1>
          <p className="text-muted-foreground">
            Connect, share knowledge, and engage with your campus community
          </p>
        </div>
        
        <PostFeed />
      </div>
    </div>
  );
}
