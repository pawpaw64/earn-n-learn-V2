import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Search, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fetchUnreadNotificationCount, fetchNotifications, markNotificationAsRead } from "@/services/notifications";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage or your auth context
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (userData) {
      setUser({
        name: userData.name || userData.email?.split('@')[0] || "User",
        email: userData.email || "",
        avatar: userData.avatar || userData.image || "",
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

  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/");
    // You might want to add a global state update here if using context
  };

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

  const getAvatarFallback = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return <User className="h-5 w-5" />;
  };

  return (
    <div className="sticky top-0 z-10 flex h-16 justify-between w-full items-center gap-4 border-b bg-background px-4 md:px-6 lg:px-8">
      <Sheet>
        <SheetTrigger className="md:hidden">
          <Button size="icon" variant="outline">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 sm:w-72">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>
      <div className="hidden md:flex" />
      
      <div className="flex-1 gap-2 flex md:flex items-center">
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-12 w-12 rounded-full" onClick={handleNotificationClick}>
              <Bell className="h-12 w-12" />
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center p-2">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;