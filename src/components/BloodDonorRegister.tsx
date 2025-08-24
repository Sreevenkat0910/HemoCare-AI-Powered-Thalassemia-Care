import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, User, Phone, Droplets, Heart, Navigation, Mail, Lock } from 'lucide-react';
import { BloodDonorService } from '../services/bloodDonorApi';

interface BloodDonorRegisterProps {
  onNavigate: (page: string) => void;
}

export function BloodDonorRegister({ onNavigate }: BloodDonorRegisterProps) {
  console.log('BloodDonorRegister component rendering...');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    gender: '',
    bloodGroup: '',
    donorType: '',
    latitude: '',
    longitude: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enter coordinates manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.contact || !formData.gender || 
        !formData.bloodGroup || !formData.donorType || !formData.latitude || !formData.longitude) {
      setError('Please fill in all fields');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate coordinates
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Please enter valid coordinates');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate unique IDs with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substr(2, 9);
      const userId = `DONOR_${timestamp}_${randomString}`;
      const bridgeId = `BRIDGE_${timestamp}_${randomString}`;

      const donorData = {
        email: formData.email,
        password: formData.password,
        user_id: userId,
        bridge_id: bridgeId,
        role: 'donor' as const,
        blood_group: formData.bloodGroup as any,
        gender: formData.gender as any,
        latitude: lat,
        longitude: lng,
        donor_type: formData.donorType as any,
        quantity_required: 0
      };

      const result = await BloodDonorService.register(donorData);
      
      if (result.success) {
        // Registration successful
        alert('Registration successful! You can now login with your email address.');
        onNavigate('blood-donor-login');
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Donor Registration</h1>
          <p className="text-gray-600">Join our lifesaving community</p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-red-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Field */}
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                Contact Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="contact"
                  type="tel"
                  placeholder="Enter your contact number"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Blood Group Field */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">
                Blood Group
              </Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Donor Type Field */}
            <div className="space-y-2">
              <Label htmlFor="donorType" className="text-sm font-medium text-gray-700">
                Donor Type
              </Label>
              <Select value={formData.donorType} onValueChange={(value) => handleInputChange('donorType', value)}>
                <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                  <SelectValue placeholder="Select donor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency-donor">Emergency Donor</SelectItem>
                  <SelectItem value="bridge-donor">Bridge Donor</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Location Coordinates
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  {isLoading ? 'Getting...' : 'Get Current Location'}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-xs text-gray-600">
                    Latitude
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      className="pl-8 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-xs text-gray-600">
                    Longitude
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      className="pl-8 text-sm border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register as Blood Donor'}
            </Button>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onNavigate('blood-donor-login')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Join our lifesaving blood donor network</p>
        </div>
      </div>
    </div>
  );
}
