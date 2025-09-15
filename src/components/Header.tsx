import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#how-it-works", label: "How It Works" },
        { href: "#skills", label: "Skills" },
        { href: "#materials", label: "Materials" },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <a href="/" className="text-2xl font-bold text-emerald-600">Earn-n-Learn</a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} className="nav-link font-medium">
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" onClick={() => setShowLoginModal(true)} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300">
                                Login
                            </Button>
                            <Button onClick={() => setShowSignupModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 shadow-sm hover:shadow-md">
                                Sign Up
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden fixed inset-0 z-40 bg-white/80 backdrop-blur-lg transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col items-center justify-center h-full space-y-8 pt-16">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="text-2xl font-semibold text-gray-800 hover:text-emerald-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-8 flex flex-col items-center gap-4 w-4/5 max-w-xs">
                        <Button variant="ghost" onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="w-full text-lg py-6 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300">
                            Login
                        </Button>
                        <Button onClick={() => { setShowSignupModal(true); setIsMenuOpen(false); }} className="w-full text-lg py-6 bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 shadow-sm hover:shadow-md">
                            Sign Up
                        </Button>
                    </div>
                </nav>
            </div>

            <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} type="login" />
            <AuthModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} type="signup" />
        </>
    );
};
export default Header;
