
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "./AuthModal";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-emerald-600">
              EarnLearn
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowLoginModal(true)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              Login
            </Button>
            <Button
              onClick={() => setShowSignupModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        type="login"
      />
      <AuthModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        type="signup"
      />
    </header>
  );
};

export default Header;
