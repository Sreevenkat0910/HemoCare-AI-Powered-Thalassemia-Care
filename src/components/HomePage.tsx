import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Heart, Shield, Users, Mic, Calendar, Activity, UserPlus, LogIn } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      title: "Symptom Tracking",
      description: "Log symptoms with voice input and get AI-powered insights"
    },
    {
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      title: "Transfusion Reminders",
      description: "Never miss important appointments with smart scheduling"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      title: "Donor Network",
      description: "Connect with verified blood donors in your area"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Privacy First",
      description: "Your health data is encrypted and securely stored"
    },
    {
      icon: <Mic className="w-6 h-6 text-red-500" />,
      title: "Voice Support",
      description: "Speak your symptoms in your preferred language"
    },
    {
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      title: "Care Network",
      description: "Stay connected with your healthcare team"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                AI-Powered Thalassemia Care
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Empowering <span className="text-blue-600">Thalassemia</span> Patients
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Your comprehensive digital companion for managing thalassemia care. 
              Track symptoms, connect with donors, and stay on top of your health journey.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => onNavigate('register')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Start as Patient
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('login')}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Patient Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                // Check if user is authenticated and has provider role
                const token = localStorage.getItem('authToken');
                const userData = localStorage.getItem('userData');
                
                if (token && userData) {
                  try {
                    const user = JSON.parse(userData);
                    if (user.role === 'doctor' || user.role === 'admin') {
                      // User is authenticated provider, go to dashboard
                      onNavigate('doctor-dashboard');
                    } else {
                      // User is authenticated but not provider, go to provider login
                      onNavigate('provider-login');
                    }
                  } catch (error) {
                    // Error parsing user data, go to provider login
                    onNavigate('provider-login');
                  }
                } else {
                  // User not authenticated, go to provider login
                  onNavigate('provider-login');
                }
              }}
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg"
            >
              <Shield className="w-5 h-5 mr-2" />
              Healthcare Provider
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Complete Care Management
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to manage thalassemia care in one secure, easy-to-use platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">
            Trusted by Patients Worldwide
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-slate-600 dark:text-slate-400">Active Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-slate-600 dark:text-slate-400">Registered Donors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">99.9%</div>
              <div className="text-slate-600 dark:text-slate-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}