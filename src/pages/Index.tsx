
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import SkillCard from "@/components/SkillCard";
import MaterialCard from "@/components/MaterialCard";
import AuthModal from "@/components/AuthModal";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Index = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleApply = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Earn, Learn & Grow – All in One Platform!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find jobs, share your skills, and connect with student opportunities.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowSignupModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            >
              Sign Up
            </Button>
            <Button
              onClick={() => setShowLoginModal(true)}
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8"
            >
              Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCard
              title="Campus Ambassador"
              type="On-campus"
              description="Represent leading brands on campus and earn while building valuable marketing experience."
              payment="$15/hour"
              onApply={handleApply}
            />
            <JobCard
              title="Web Development"
              type="Remote"
              description="Help local businesses with their websites. Perfect for CS students!"
              payment="$25/hour"
              onApply={handleApply}
            />
            <JobCard
              title="Research Assistant"
              type="Part-time"
              description="Assist in ongoing research projects in the Biology department."
              payment="$18/hour"
              onApply={handleApply}
            />
          </div>
        </div>
      </section>

      {/* Skill Share Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Skill Share Spotlight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard
              name="Alex M."
              skill="Python Programming"
              pricing="$20/hour"
              onContact={handleApply}
            />
            <SkillCard
              name="Sarah K."
              skill="Digital Marketing"
              pricing="$15/hour"
              onContact={handleApply}
            />
            <SkillCard
              name="James R."
              skill="Guitar Lessons"
              pricing="$25/hour"
              onContact={handleApply}
            />
            <SkillCard
              name="Emily W."
              skill="Academic Writing"
              pricing="$18/hour"
              onContact={handleApply}
            />
          </div>
        </div>
      </section>

      {/* Material Share Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Material Share Spotlight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MaterialCard
              name="Mike S."
              material="Chemistry Textbook"
              condition="Like New"
              price="$45"
              availability="For Sale"
              onContact={handleApply}
            />
            <MaterialCard
              name="Lisa P."
              material="Art Supplies Bundle"
              condition="Good Condition"
              price="$30"
              availability="For Sale"
              onContact={handleApply}
            />
            <MaterialCard
              name="Tom R."
              material="Scientific Calculator"
              condition="Excellent"
              price="$5/week"
              availability="Available for Rent"
              onContact={handleApply}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex space-x-6 mb-6">
              <a href="#" className="hover:text-emerald-400">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-emerald-400">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-emerald-400">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-emerald-400">
                <Linkedin size={24} />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Built by students, for students.
            </p>
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
  );
};

export default Index;
