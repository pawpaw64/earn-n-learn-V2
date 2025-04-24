
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {/* This is where child routes will be rendered */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;