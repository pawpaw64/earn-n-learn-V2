import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Get user data from localStorage when component mounts
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear any stored user data or tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to home page
    navigate("/");
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white/80 backdrop-blur-md">
      <a href="/" className="text-3xl font-bold text-emerald-600">
        Earn-n-Learn
      </a>
      
      <div className="flex items-center gap-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>
            {user ? getInitials(user.name) : 'U'}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">
          {user?.name || 'User'}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;