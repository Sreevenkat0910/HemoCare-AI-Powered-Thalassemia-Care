import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, User, Languages, Heart, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface PatientOnboardingProps {
  onNavigate: (page: string) => void;
}

export function PatientOnboarding({ onNavigate }: PatientOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    // Language & Preferences
    preferredLanguage: '',
    communicationPreference: '',
    // Medical Info
    thalassemiaType: '',
    diagnosisDate: '',
    currentHospital: '',
    emergencyContact: '',
    // Additional Notes
    medicalHistory: '',
    currentMedications: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    onNavigate('patient-dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => updateFormData('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Languages className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Language & Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Preferred Language for Communication</Label>
                <Select onValueChange={(value) => updateFormData('preferredLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>How would you like to receive updates?</Label>
                <RadioGroup 
                  value={formData.communicationPreference}
                  onValueChange={(value) => updateFormData('communicationPreference', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-pref" />
                    <Label htmlFor="email-pref">Email notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="sms-pref" />
                    <Label htmlFor="sms-pref">SMS notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both-pref" />
                    <Label htmlFor="both-pref">Both email and SMS</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold">Medical Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="thalassemiaType">Type of Thalassemia</Label>
                <Select onValueChange={(value) => updateFormData('thalassemiaType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select thalassemia type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alpha">Alpha Thalassemia</SelectItem>
                    <SelectItem value="beta-major">Beta Thalassemia Major</SelectItem>
                    <SelectItem value="beta-minor">Beta Thalassemia Minor</SelectItem>
                    <SelectItem value="beta-intermedia">Beta Thalassemia Intermedia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="diagnosisDate">Date of Diagnosis</Label>
                <Input
                  id="diagnosisDate"
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) => updateFormData('diagnosisDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentHospital">Current Healthcare Provider</Label>
                <Input
                  id="currentHospital"
                  value={formData.currentHospital}
                  onChange={(e) => updateFormData('currentHospital', e.target.value)}
                  placeholder="Hospital/Clinic name"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                  placeholder="Name and phone number"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Additional Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => updateFormData('medicalHistory', e.target.value)}
                  placeholder="Any relevant medical history, surgeries, or conditions..."
                  className="min-h-24"
                />
              </div>
              <div>
                <Label htmlFor="currentMedications">Current Medications (Optional)</Label>
                <Textarea
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => updateFormData('currentMedications', e.target.value)}
                  placeholder="List your current medications and dosages..."
                  className="min-h-24"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center">Join Hemocare</CardTitle>
            <CardDescription className="text-center">
              Let's set up your account to get started with personalized care
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="flex items-center space-x-2">
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Complete Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}