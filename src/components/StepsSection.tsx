import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Search, Handshake, DollarSign } from 'lucide-react';

const StepsSection = () => {
    const steps = [
        {
            icon: <UserPlus className="h-8 w-8 text-emerald-600" />,
            title: "Sign Up",
            description: "Create your account in minutes with just your email and basic information.",
            step: "01"
        },
        {
            icon: <Search className="h-8 w-8 text-emerald-600" />,
            title: "Explore Opportunities",
            description: "Browse through jobs, skill sharing, and material exchange opportunities.",
            step: "02"
        },
        {
            icon: <Handshake className="h-8 w-8 text-emerald-600" />,
            title: "Connect & Collaborate",
            description: "Apply for jobs, offer your skills, or connect with peers for materials.",
            step: "03"
        },
        {
            icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
            title: "Earn & Learn",
            description: "Start earning money while gaining valuable experience and skills.",
            step: "04"
        }
    ];

    return (
        <section id="how-it-works" className="py-20 px-4 bg-white">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Getting started on Earn-n-Learn is simple. Follow these four easy steps to begin your journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <Card key={index} className="relative h-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="absolute -top-4 -left-4 bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                {step.step}
                            </div>
                            <CardHeader className="pt-8">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors duration-300">
                                        {step.icon}
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-semibold text-center text-gray-900">
                                    {step.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StepsSection;