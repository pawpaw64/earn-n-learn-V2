import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, type }: AuthModalProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    studentId: "",
    university: "",
    course: "",
    mobile: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (type === "login") {
        const response = await axios.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        }, { withCredentials: true });

        if (response.data.success) {
          toast({
            title: "Login successful",
            description: `Welcome back, ${response.data.name}!`,
          });
          
          onClose();
          navigate("/dashboard/browse");
        }
      } else {
        const response = await axios.post("/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          student_id: formData.studentId,
          university: formData.university,
          course: formData.course,
          mobile: formData.mobile,
        });

        if (response.data.success) {
          toast({
            title: "Registration successful",
            description: "Welcome to Earn-n-Learn! Please login to continue.",
          });
          
          onClose();
          navigate("/dashboard/browse");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {type === "login" ? "Welcome Back!" : "Join Our Community"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {type === "signup" && (
            <>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  required
                  placeholder="Your full name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  type="text"
                  id="studentId"
                  required
                  placeholder="Your student ID"
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Student ID authentication is mandatory to join our community
                </p>
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="university">University / Institution</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, university: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your institution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uni1">University One</SelectItem>
                    <SelectItem value="uni2">University Two</SelectItem>
                    <SelectItem value="uni3">University Three</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="course">Course / Department</Label>
                <Input
                  type="text"
                  id="course"
                  required
                  placeholder="Your course or department"
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                />
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  type="tel"
                  id="mobile"
                  required
                  placeholder="Your mobile number"
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              required
              placeholder="your@email.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              (type === "login" ? "Logging in..." : "Signing up...") : 
              (type === "login" ? "Login" : "Sign Up")
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
