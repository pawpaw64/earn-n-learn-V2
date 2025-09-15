import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import SkillCard from "@/components/SkillCard";
import MaterialCard from "@/components/MaterialCard";
import AuthModal from "@/components/AuthModal";
import ImageSlider from "@/components/ImageSlider";
import StepsSection from "@/components/StepsSection";
import { Facebook, Twitter, Instagram, Linkedin, CheckCircle, Users, BookOpen } from "lucide-react";
import slider1 from "@/assets/slider-1.jpg";
import slider2 from "@/assets/slider-2.jpg";
import slider3 from "@/assets/slider-3.jpg";

const Index = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const handleApply = () => {
        setShowLoginModal(true);
    };
    const handleViewDetails = () => {
        setShowLoginModal(true);
    };
    const sliderImages = [slider1, slider2, slider3];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section with Image Slider */}
            <section className="pt-16">
                <ImageSlider slides={sliderImages}>
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animated-gradient-text">
                            Earn, Learn & Grow – All in One Platform!
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                            Connect with opportunities, share your skills, and build your future with fellow students
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button onClick={() => setShowSignupModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg" size="lg">
                                Get Started Today
                            </Button>
                            <Button onClick={() => setShowLoginModal(true)} variant="outline" size="lg" className="border-white hover:bg-white px-8 py-3 text-lg text-green-400 font-bold">
                                Sign In
                            </Button>
                        </div>
                    </div>
                </ImageSlider>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Earn-n-Learn?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to succeed as a student, all in one platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-emerald-50 rounded-xl transition-transform transform hover:scale-105 duration-300">
                            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Verified Opportunities</h3>
                            <p className="text-gray-600 leading-relaxed">
                                All jobs and opportunities are verified to ensure safe and legitimate experiences for students.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-blue-50 rounded-xl transition-transform transform hover:scale-105 duration-300">
                            <Users className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Student Community</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Connect with like-minded students, share experiences, and build lasting professional networks.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-purple-50 rounded-xl transition-transform transform hover:scale-105 duration-300">
                            <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Skill Development</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Learn new skills, teach others, and grow professionally while earning money.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <StepsSection />

            {/* Featured Jobs Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-emerald-50">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Featured Opportunities
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover exciting job opportunities tailored for students
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <JobCard title="Campus Ambassador" type="On-campus" description="Represent leading brands on campus and earn while building valuable marketing experience." payment="$15/hour" onApply={handleApply} onViewDetails={handleViewDetails} />
                        <JobCard title="Web Development" type="Remote" description="Help local businesses with their websites. Perfect for CS students!" payment="$25/hour" onApply={handleApply} onViewDetails={handleViewDetails} />
                        <JobCard title="Research Assistant" type="Part-time" description="Assist in ongoing research projects in the Biology department." payment="$18/hour" onApply={handleApply} onViewDetails={handleViewDetails} />
                    </div>
                </div>
            </section>

            {/* Skill Share Section */}
            <section id="skills" className="py-20 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Skill Share Spotlight
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Learn from peers and share your expertise
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SkillCard name="Alex M." skill="Python Programming" pricing="$20/hour" description="Expert Python developer with 5+ years of experience in web and data projects." experienceLevel="Advanced" onContact={handleApply} onViewDetails={handleViewDetails} />
                        <SkillCard name="Sarah K." skill="Digital Marketing" pricing="$15/hour" description="Specializing in social media campaigns and content strategy for small businesses." experienceLevel="Intermediate" onContact={handleApply} onViewDetails={handleViewDetails} />
                        <SkillCard name="James R." skill="Guitar Lessons" pricing="$25/hour" description="Personalized guitar lessons for beginners to intermediate players. All styles covered." experienceLevel="Expert" onContact={handleApply} onViewDetails={handleViewDetails} />
                        <SkillCard name="Emily W." skill="Academic Writing" pricing="$18/hour" description="Assistance with essays, research papers, and academic editing. English major." experienceLevel="Advanced" onContact={handleApply} onViewDetails={handleViewDetails} />
                    </div>
                </div>
            </section>

            {/* Material Share Section */}
            <section id="materials" className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Material Share Spotlight
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Buy, sell, and rent academic materials with ease
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MaterialCard name="Mike S." material="Chemistry Textbook" condition="Like New" price="$45" availability="For Sale" description="Chemistry 101 textbook, 12th edition. Used for one semester, no highlights." onContact={handleApply} onViewDetails={handleViewDetails} />
                        <MaterialCard name="Lisa P." material="Art Supplies Bundle" condition="Good Condition" price="$30" availability="For Sale" description="Set of acrylic paints, brushes, and small canvases. Perfect starter kit." onContact={handleApply} onViewDetails={handleViewDetails} />
                        <MaterialCard name="Tom R." material="Scientific Calculator" condition="Excellent" price="$5/week" availability="Available for Rent" description="TI-84 Plus graphing calculator. Perfect for statistics and calculus courses." onContact={handleApply} onViewDetails={handleViewDetails} />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Earn-n-Learn</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Empowering students to earn, learn, and grow through meaningful opportunities.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
                                <li><a href="#skills" className="hover:text-emerald-400 transition-colors">Skills</a></li>
                                <li><a href="#materials" className="hover:text-emerald-400 transition-colors">Materials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:text-emerald-400 transition-colors">
                                    <Facebook size={24} />
                                </a>
                                <a href="#" className="hover:text-emerald-400 transition-colors">
                                    <Twitter size={24} />
                                </a>
                                <a href="#" className="hover:text-emerald-400 transition-colors">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" className="hover:text-emerald-400 transition-colors">
                                    <Linkedin size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2024 Earn-n-Learn. Built by students, for students.
                        </p>
                    </div>
                </div>
            </footer>

            <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} type="login" />
            <AuthModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} type="signup" />
        </div>
    );
};
export default Index;
