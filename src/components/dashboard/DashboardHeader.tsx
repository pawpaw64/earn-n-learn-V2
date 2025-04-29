
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fetchUnreadNotificationCount, fetchNotifications, markNotificationAsRead } from "@/services/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DashboardSidebar from "./DashboardSidebar";

const DashboardHeader = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://github.com/shadcn.png",
  });
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage or global state
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userAvatar = localStorage.getItem("userAvatar");
    
    if (userName && userEmail) {
      setUser({
        name: userName,
        email: userEmail,
        avatar: userAvatar || "https://github.com/shadcn.png",
      });
    }
    
    // Fetch unread notification count
    const fetchCount = async () => {
      try {
        const count = await fetchUnreadNotificationCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };
    
    fetchCount();
    
    // Set up an interval to check notifications
    const intervalId = setInterval(fetchCount, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async () => {
    try {
      const notificationData = await fetchNotifications();
      setNotifications(notificationData);
      setShowNotifications(true);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    }
  };

  const handleNotificationRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      
      // Update the local state
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, is_read: true } : notif
      ));
      
      // Update the unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="sticky top-0 z-10 flex h-16 justify-between w-full items-center gap-4 border-b bg-background px-4 md:px-6 lg:px-8">
      <Sheet>
        <SheetTrigger className="md:hidden">
          <Button
            size="icon"
            variant="outline"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 sm:w-72">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>
      <div className="hidden md:flex" />
      <div className="flex-1 gap-2 flex md:flex items-center">
        <div className="relative md:w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-full pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium border-b">Notifications</div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer ${!notification.is_read ? 'bg-slate-50' : ''}`}
                    onClick={() => handleNotificationRead(notification.id)}
                  >
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-500">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
