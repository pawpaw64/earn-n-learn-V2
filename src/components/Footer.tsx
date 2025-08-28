import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-semibold">Earn-n-Learn</h3>
                        <p className="mt-4 text-gray-400">The ultimate platform for students to gain real-world experience and launch their careers.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/dashboard/browse" className="text-gray-400 hover:text-white transition">Browse Gigs</Link></li>
                            <li><Link to="/dashboard/campus" className="text-gray-400 hover:text-white transition">Campus</Link></li>
                            <li><Link to="/dashboard/profile" className="text-gray-400 hover:text-white transition">My Profile</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold">Connect With Us</h3>
                        <div className="flex mt-4 space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition"><Github /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Twitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Linkedin /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Earn-n-Learn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;