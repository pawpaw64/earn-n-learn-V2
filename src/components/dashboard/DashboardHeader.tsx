
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data or tokens from localStorage if any
    localStorage.clear();
    // Navigate to home page
    navigate("/");
  };

  
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white/80 backdrop-blur-md">
      <a href="/" className="text-3xl font-bold text-emerald-600">
        Earn-n-Learn
      </a>
      
      <div className="flex items-center gap-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src="" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">John Doe</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
