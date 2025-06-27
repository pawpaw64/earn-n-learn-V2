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
const [isFetching, setIsFetching] = useState(false);
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
    
    const intervalId = setInterval(fetchCount, 30000); // Check every 30 seconds
    const handleStorageChange = () => {
      const updatedUserData = JSON.parse(localStorage.getItem("user") || "{}");
      if (updatedUserData) {
        setUser({
          name: updatedUserData.name || updatedUserData.email?.split('@')[0] || "User",
          email: updatedUserData.email || "",
          avatar: updatedUserData.avatar || updatedUserData.image || "",
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
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
  if (showNotifications && notifications.length > 0) return;
  
  try {
    setIsFetching(true);
    const notificationData = await fetchNotifications();
    const notificationsArray = Array.isArray(notificationData) ? notificationData : [];
    setNotifications(notificationsArray);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    toast.error("Failed to load notifications");
  } finally {
    setIsFetching(false);
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
const handleMarkAllAsRead = async () => {
  try {
    // Get all unread notification IDs
    const unreadIds = notifications
      .filter(notif => !notif.is_read)
      .map(notif => notif.id);

    if (unreadIds.length === 0) return;

    // Call API to mark all as read (you'll need to implement this endpoint)
    await Promise.all(unreadIds.map(id => markNotificationAsRead(id)));
    
    // Update local state
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, is_read: true }))
    );
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    toast.error("Failed to mark all as read");
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
  {/* Notifications Dropdown - Fixed Version */}
  <DropdownMenu 
    open={showNotifications} 
    onOpenChange={(open) => {
      setShowNotifications(open);
      if (open) {
        handleNotificationClick();
      }
    }}
  >
    <DropdownMenuTrigger asChild>
      <Button 
        variant="outline" 
        size="icon" 
        className="relative h-10 w-10 rounded-full"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      align="end" 
      className="w-[350px] max-h-[60vh] overflow-y-auto z-[100]"
    >
      <div className="p-3 font-medium border-b sticky top-0 bg-background flex justify-between items-center">
    <span>Notifications ({notifications.length})</span>
    {unreadCount > 0 && (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleMarkAllAsRead}
        className="h-6 text-xs"
      >
        Mark all as read
      </Button>
    )}
  </div>
      <div className="divide-y">
        {isFetching && notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-3 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationRead(notification.id)}
            >
              <div className="w-full space-y-1">
                <div className="font-medium flex justify-between items-start">
                  <span>{notification.title}</span>
                  {!notification.is_read && (
                    <span className="text-xs text-green-600 ml-2">New</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{notification.message}</div>
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
</div>
        
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
    
  );
};

export default DashboardHeader;