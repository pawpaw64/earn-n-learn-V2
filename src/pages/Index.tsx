import { useState, useEffect } from "react";
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Linkedin, 
    CheckCircle, 
    Users, 
    BookOpen,
    UserPlus,
    Search,
    Handshake,
    DollarSign,
    ArrowRight,
    Play,
    Menu,
    X,
    Star,
    Clock,
    MapPin,
    Award
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import ImageSlider from "@/components/ImageSlider";

const Header = ({ onSignIn, onSignUp }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Earn-n-Learn
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">About Us</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">How It Works</a>
            <a href="#opportunities" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Opportunities</a>
            
            {/* Auth buttons */}
            <button 
              onClick={onSignUp}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-5 py-2 rounded-xl font-medium transition-all hover:scale-105"
            >
              Sign Up
            </button>
            <button 
              onClick={onSignIn}
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-5 py-2 rounded-xl font-medium transition-all"
            >
              Log In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <a href="#features" className="block text-gray-700 hover:text-emerald-600 font-medium">About Us</a>
            <a href="#how-it-works" className="block text-gray-700 hover:text-emerald-600 font-medium">How It Works</a>
            <a href="#opportunities" className="block text-gray-700 hover:text-emerald-600 font-medium">Opportunities</a>
            <button 
              onClick={onSignIn}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2 rounded-xl font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={onSignUp}
              className="w-full border-2 border-emerald-600 text-emerald-600 py-2 rounded-xl font-medium hover:bg-emerald-600 hover:text-white"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

const JobCard = ({ title, type, description, payment, onApply, onViewDetails }) => (
  <div className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 
                  hover:shadow-xl hover:border-emerald-200 transition-all duration-300 
                  hover:-translate-y-1 flex flex-col w-full max-w-full">
    {/* Header */}
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-emerald-600 font-bold text-lg">{title.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate">{title}</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 mt-1">
            <Clock size={12} className="mr-1" />
            {type}
          </span>
        </div>
      </div>
    </div>

    {/* Description */}
    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-4">{description}</p>

    {/* Footer */}
    <div className="flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent truncate">{payment}</span>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
      </div>
      <div className="flex gap-3 flex-shrink-0">
        <button
          onClick={onViewDetails}
          className="text-emerald-600 hover:text-emerald-700 px-4 py-2 rounded-xl transition-colors font-medium border border-emerald-200 hover:bg-emerald-50 text-sm"
        >
          Details
        </button>
        <button
          onClick={onApply}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2 rounded-xl transition-all hover:scale-105 font-medium text-sm"
        >
          Apply Now
        </button>
      </div>
    </div>
  </div>
);


const SkillCard = ({ name, skill, pricing, description, experienceLevel, onContact, onViewDetails }) => (
  <div className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 flex flex-col w-full max-w-full">
    {/* Header */}
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-lg truncate">{name}</h3>
        <p className="text-emerald-600 font-semibold truncate">{skill}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(4.9)</span>
        </div>
      </div>
    </div>

    {/* Description */}
    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">{description}</p>

    {/* Pricing & Experience */}
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent truncate">{pricing}</span>
      <span className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center truncate">
        <Award size={12} className="mr-1" />
        {experienceLevel}
      </span>
    </div>

    {/* Buttons */}
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={onViewDetails}
        className="flex-1 border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium"
      >
        View Profile
      </button>
      <button
        onClick={onContact}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2.5 rounded-xl transition-all hover:scale-105 text-sm font-medium"
      >
        Contact
      </button>
    </div>
  </div>
);


const MaterialCard = ({ name, material, condition, price, availability, description, onContact, onViewDetails }) => (
  <div className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 flex flex-col w-full max-w-full">
    {/* Header */}
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-bold">{material.charAt(0)}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 truncate">{material}</h3>
      </div>
      <span className="bg-gradient-to-r from-green-50 to-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
        {availability}
      </span>
    </div>

    {/* Description */}
    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">{description}</p>

    {/* Details */}
    <div className="space-y-2 mb-6">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500 font-medium">Condition:</span>
        <span className="font-semibold text-gray-900 truncate">{condition}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500 font-medium">Seller:</span>
        <span className="font-semibold text-gray-900 truncate">{name}</span>
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center flex-wrap gap-2">
      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent truncate">{price}</span>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onViewDetails}
          className="text-emerald-600 hover:text-emerald-700 px-4 py-2 rounded-xl transition-colors text-sm font-medium border border-emerald-200 hover:bg-emerald-50 flex-1"
        >
          Details
        </button>
        <button
          onClick={onContact}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-xl transition-all hover:scale-105 text-sm font-medium flex-1"
        >
          Contact
        </button>
      </div>
    </div>
  </div>
);


const FloatingShape = ({ className, delay, duration }) => (
  <div 
    className={`absolute rounded-full opacity-20 ${className}`}
    style={{
      animation: `float ${duration}s infinite ease-in-out ${delay}s`
    }}
  />
);

const Index = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
  

    const handleApply = () => {
        setShowLoginModal(true);
    };
    
    const handleViewDetails = () => {
        setShowLoginModal(true);
    };

    const features = [
        {
            icon: <CheckCircle className="h-8 w-8 text-white" />,
            title: "Verified Opportunities",
            description: "All jobs and opportunities are verified to ensure safe and legitimate experiences for students.",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: <Users className="h-8 w-8 text-white" />,
            title: "Student Community", 
            description: "Connect with like-minded students, share experiences, and build lasting professional networks.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <BookOpen className="h-8 w-8 text-white" />,
            title: "Skill Development",
            description: "Learn new skills, teach others, and grow professionally while earning money.",
            color: "from-purple-500 to-purple-600"
        }
    ];

    const steps = [
        {
            icon: <UserPlus className="h-6 w-6 text-emerald-600" />,
            title: "Sign Up",
            description: "Create your account in minutes with just your email and basic information.",
            step: "01"
        },
        {
            icon: <Search className="h-6 w-6 text-emerald-600" />,
            title: "Explore Opportunities", 
            description: "Browse through jobs, skill sharing, and material exchange opportunities.",
            step: "02"
        },
        {
            icon: <Handshake className="h-6 w-6 text-emerald-600" />,
            title: "Connect & Collaborate",
            description: "Apply for jobs, offer your skills, or connect with peers for materials.",
            step: "03"
        },
        {
            icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
            title: "Earn & Learn",
            description: "Start earning money while gaining valuable experience and skills.",
            step: "04"
        }
    ];
   const FloatingCard = ({ icon, title, description, position, delay }) => (
  <div 
    className={`absolute ${position} bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-lg`}
    style={{
      animation: `float 6s infinite ease-in-out ${delay}s`
    }}
  >
    <div className="text-2xl mb-1">{icon}</div>
    <h4 className="text-white font-semibold text-sm">{title}</h4>
    <p className="text-white/70 text-xs">{description}</p>
  </div>
);


  const sliderImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  ];
    return (
        <div className="min-h-screen bg-gray-50">
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(3deg); }
              }
              
              @keyframes slideInFromBottom {
                from {
                  opacity: 0;
                  transform: translateY(100px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes slideInFromLeft {
                from {
                  opacity: 0;
                  transform: translateX(-100px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              
              @keyframes slideInFromRight {
                from {
                  opacity: 0;
                  transform: translateX(100px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              
              .hero-animation {
                animation: slideInFromBottom 0.8s ease-out;
              }
              
              .hero-animation-delayed {
                animation: slideInFromBottom 0.8s ease-out 0.2s both;
              }
              
              .hero-animation-delayed-2 {
                animation: slideInFromBottom 0.8s ease-out 0.4s both;
              }
            `}</style>
            
          <Header 
  onSignIn={() => setShowLoginModal(true)} 
  onSignUp={() => setShowSignupModal(true)} 
/>


            {/* Hero Section */}
            
            <section className="relative bg-gradient-to-br from-white via-emerald-50 to-emerald-100 overflow-hidden pt-20">
                {/* Floating Shapes */}
                <FloatingShape 
                  className="w-64 h-64 bg-emerald-200 top-20 -left-20"
                  delay="0"
                  duration="6"
                />
                <FloatingShape 
                  className="w-96 h-96 bg-emerald-300 top-40 -right-32"
                  delay="2"
                  duration="8"
                />
                <FloatingShape 
                  className="w-32 h-32 bg-blue-200 bottom-20 left-20"
                  delay="1"
                  duration="5"
                />

                <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-8 hero-animation">
                                <span className="w-2 h-2 bg-emerald-600 rounded-full mr-2 animate-pulse"></span>
                                #1 Student Platform
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight hero-animation-delayed">
                                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Earn, Learn &
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                                    Grow Together
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-12 leading-relaxed hero-animation-delayed-2">
                                The all-in-one platform where students connect, collaborate, and create opportunities. 
                                Turn your skills into income while building your future.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 hero-animation-delayed-2">
                                <button 
                                    onClick={() => setShowSignupModal(true)} 
                                    className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 font-semibold text-lg"
                                >
                                    Getting Started
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                
                            </div>
                            
                            {/* Stats */}
                           
                        </div>

                        {/* Right Visual */}
<div className="relative">
  <div 
    className="relative z-10 rounded-3xl overflow-hidden shadow-2xl h-[500] w-[650px] animate-[floatBox_6s_ease-in-out_infinite]"
  >   
    <ImageSlider slides={sliderImages} />

    <>
      {/* Floating Cards */}
      <FloatingCard 
        icon="🚀" 
        title="Fast Performance" 
        description="Lightning-fast opportunities"
        position="top-24 left-12 hidden lg:block"
        delay="0"
      />
      <FloatingCard 
        icon="💼" 
        title="Student Jobs" 
        description="Perfect for your schedule"
        position="top-72 right-20 hidden lg:block"
        delay="2"
      />
      <FloatingCard 
        icon="📚" 
        title="Skill Share" 
        description="Learn & teach"
        position="top-48 left-10 hidden lg:block"
        delay="4"
      />
      <FloatingCard 
        icon="🎨" 
        title="Creative Design" 
        description="Showcase your talent"
        position="bottom-20 left-24 hidden lg:block"
        delay="6"
      />
      <FloatingCard 
        icon="🤝" 
        title="Collaboration" 
        description="Work together, grow together"
        position="bottom-96 right-10 hidden lg:block"
        delay="1"
      />
    </>
  </div>

  {/* Decorative circles */}
  <div className="absolute -top-6 -right-6 w-80 h-80 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full opacity-20 animate-pulse"></div>
  <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20"></div>
</div>

{/* @ts-ignore */}
<style jsx>{`
  @keyframes floatBox {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(10px, -15px) rotate(1deg); /* Slow drift right */
  }
  66% {
    transform: translate(-5px, -20px) rotate(-1deg); /* Drift back left a bit */
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

`}</style>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Why Choose Us
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Everything You Need to <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Succeed</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built by students, for students. Our platform provides all the tools you need to thrive.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="relative z-10">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-emerald-50 to-blue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center bg-white text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                            Simple Process
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            How It <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Works</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Getting started is simple. Follow these steps to begin earning and learning.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute -top-4 left-8">
                                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {step.step}
                                    </div>
                                </div>
                                <div className="pt-8">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Opportunities Section */}
            <section id="opportunities" className="py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Featured Jobs
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Latest <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Opportunities</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover exciting job opportunities tailored specifically for students
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <JobCard 
                            title="Campus Ambassador" 
                            type="On-campus" 
                            description="Represent leading brands on campus and earn while building valuable marketing experience." 
                            payment="$15/hour" 
                            onApply={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                        <JobCard 
                            title="Web Development" 
                            type="Remote" 
                            description="Help local businesses with their websites. Perfect for CS students!" 
                            payment="$25/hour" 
                            onApply={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                        <JobCard 
                            title="Research Assistant" 
                            type="Part-time" 
                            description="Assist in ongoing research projects in the Biology department." 
                            payment="$18/hour" 
                            onApply={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                    </div>
                </div>
            </section>

            {/* Skill Share Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center bg-white text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                            Skill Sharing
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Learn From <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Top Students</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Connect with talented peers and share knowledge while earning money
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SkillCard 
                            name="Alex M." 
                            skill="Python Programming" 
                            pricing="$20/hour" 
                            description="Expert Python developer with 5+ years of experience in web and data projects." 
                            experienceLevel="Advanced" 
                            onContact={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                        <SkillCard 
                            name="Sarah K." 
                            skill="Digital Marketing" 
                            pricing="$15/hour" 
                            description="Specializing in social media campaigns and content strategy for small businesses." 
                            experienceLevel="Intermediate" 
                            onContact={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                        <SkillCard 
                            name="James R." 
                            skill="Guitar Lessons" 
                            pricing="$25/hour" 
                            description="Personalized guitar lessons for beginners to intermediate players. All styles covered." 
                            experienceLevel="Expert" 
                            onContact={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                        <SkillCard 
                            name="Emily W." 
                            skill="Academic Writing" 
                            pricing="$18/hour" 
                            description="Assistance with essays, research papers, and academic editing. English major." 
                            experienceLevel="Advanced" 
                            onContact={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                    </div>
                </div>
            </section>

            {/* Material Share Section */}
            <section className="py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Material Exchange
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Smart <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Material Sharing</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Buy, sell, and rent academic materials at student-friendly prices
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <MaterialCard 
                            name="Mike S." 
                            material="Chemistry Textbook" 
                            condition="Like New" 
                            price="$45" 
                            availability="For Sale" 
                            description="Chemistry 101 textbook, 12th edition. Used for one semester, no highlights." 
                            onContact={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                        <MaterialCard 
                            name="Lisa P." 
                            material="Art Supplies Bundle" 
                            condition="Good Condition" 
                            price="$30" 
                            availability="For Sale" 
                            description="Set of acrylic paints, brushes, and small canvases. Perfect starter kit." 
                            onContact={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                        <MaterialCard 
                            name="Tom R." 
                            material="Scientific Calculator" 
                            condition="Excellent" 
                            price="$5/week" 
                            availability="Available for Rent" 
                            description="TI-84 Plus graphing calculator. Perfect for statistics and calculus courses." 
                            onContact={handleApply} 
                            onViewDetails={handleViewDetails} 
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/20 to-emerald-800/20"></div>
                    <FloatingShape 
                        className="w-96 h-96 bg-white/10 -top-48 -left-48"
                        delay="0"
                        duration="8"
                    />
                    <FloatingShape 
                        className="w-64 h-64 bg-white/10 -bottom-32 -right-32"
                        delay="2"
                        duration="6"
                    />
                </div>
                
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of students who are already earning, learning, and growing with Earn-n-Learn
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <button 
                            onClick={() => setShowSignupModal(true)} 
                            className="group px-12 py-4 bg-white hover:bg-gray-100 text-emerald-600 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 font-bold text-lg"
                        >
                            Start Earning Today
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-12 py-4 border-2 border-white text-white hover:bg-white hover:text-emerald-600 rounded-2xl transition-all font-bold text-lg">
                            Learn More
                        </button>
                    </div>
                    
                    {/* Trust Indicators */}
                    <div className="flex justify-center items-center gap-12 opacity-80">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">10,000+</div>
                            <div className="text-emerald-200 text-sm">Happy Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">4.9/5</div>
                            <div className="text-emerald-200 text-sm">Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">500+</div>
                            <div className="text-emerald-200 text-sm">Universities</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-20">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">E</span>
                                </div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                                    Earn-n-Learn
                                </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-md">
                                Empowering students to earn, learn, and grow through meaningful opportunities. Built by students, for students.
                            </p>
                            <div className="flex gap-4 mt-8">
                                <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:scale-110">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:scale-110">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:scale-110">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:scale-110">
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold mb-8 text-white">Platform</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
                                <li><a href="#skills" className="hover:text-emerald-400 transition-colors">Skills</a></li>
                                <li><a href="#materials" className="hover:text-emerald-400 transition-colors">Materials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold mb-8 text-white">Support</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 mb-4 md:mb-0">
                            © 2024 Earn-n-Learn. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 text-gray-400">
                            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
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
        </div>
        
    )
};
export default Index;