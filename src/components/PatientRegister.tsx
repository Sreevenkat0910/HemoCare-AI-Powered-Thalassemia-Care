import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle, Phone, Calendar, UserCheck, MapPin, Droplets, Heart } from 'lucide-react';
import apiService from '../services/api';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth: string;
  bloodGroup: 'A-' | 'A+' | 'O-' | 'AB-' | 'AB+' | 'B+' | 'B-';
  city: string;
  pincode: string;
  thalassemiaType?: string;
  diagnosisDate?: string;
  currentMedications?: string;
  allergies?: string;
  previousSurgeries?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactMobile?: string;
}

interface PatientRegisterProps {
  onNavigate: (page: string) => void;
}

const PatientRegister: React.FC<PatientRegisterProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    mobile: '',
    dateOfBirth: '',
    bloodGroup: 'A+',
    city: '',
    pincode: '',
    thalassemiaType: '',
    diagnosisDate: '',
    currentMedications: '',
    allergies: '',
    previousSurgeries: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactMobile: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await apiService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        mobile: formData.mobile,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        city: formData.city,
        pincode: formData.pincode,
        role: 'patient',
        thalassemiaType: formData.thalassemiaType || undefined,
        diagnosisDate: formData.diagnosisDate || undefined,
        currentMedications: formData.currentMedications ? formData.currentMedications.split(',').map(m => m.trim()) : undefined,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : undefined,
        previousSurgeries: formData.previousSurgeries ? formData.previousSurgeries.split(',').map(s => s.trim()) : undefined,
        emergencyContact: formData.emergencyContactName ? {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship || '',
          mobile: formData.emergencyContactMobile || ''
        } : undefined
      });
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Account created successfully! Redirecting to Patient Portal...'
        });

        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          gender: 'Male',
          mobile: '',
          dateOfBirth: '',
          bloodGroup: 'A+',
          city: '',
          pincode: '',
          thalassemiaType: '',
          diagnosisDate: '',
          currentMedications: '',
          allergies: '',
          previousSurgeries: '',
          emergencyContactName: '',
          emergencyContactRelationship: '',
          emergencyContactMobile: ''
        });

        // Redirect to patient portal after a delay
        setTimeout(() => {
          onNavigate('patient-dashboard');
        }, 3000);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Patient Account
          </h2>
          <p className="text-gray-600">
            Join Hemocare Healthcare Platform - Complete Your Profile
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border rounded-lg text-sm transition-colors ${
                      errors.firstName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border rounded-lg text-sm transition-colors ${
                      errors.lastName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm transition-colors ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm transition-colors ${
                        errors.mobile 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="+91 1234567890"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.mobile}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm transition-colors ${
                        errors.dateOfBirth 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-600" />
                Medical Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Droplets className="h-5 w-5 text-red-400" />
                    </div>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="thalassemiaType" className="block text-sm font-medium text-gray-700 mb-2">
                    Thalassemia Type
                  </label>
                  <input
                    id="thalassemiaType"
                    name="thalassemiaType"
                    type="text"
                    value={formData.thalassemiaType}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="e.g., Beta Thalassemia Major"
                  />
                </div>

                <div>
                  <label htmlFor="diagnosisDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis Date
                  </label>
                  <input
                    id="diagnosisDate"
                    name="diagnosisDate"
                    type="date"
                    value={formData.diagnosisDate}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    id="currentMedications"
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    rows={2}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="Separate multiple medications with commas"
                  />
                </div>

                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    rows={2}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="Separate multiple allergies with commas"
                  />
                </div>

                <div>
                  <label htmlFor="previousSurgeries" className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Surgeries
                  </label>
                  <textarea
                    id="previousSurgeries"
                    name="previousSurgeries"
                    value={formData.previousSurgeries}
                    onChange={handleInputChange}
                    rows={2}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="Separate multiple surgeries with commas"
                  />
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Location Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border rounded-lg text-sm transition-colors ${
                      errors.city 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder="e.g., Hyderabad, Mumbai, Delhi"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className={`block w-full px-3 py-3 border rounded-lg text-sm transition-colors ${
                      errors.pincode 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder="6-digit pincode"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-orange-600" />
                Emergency Contact (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="Emergency contact name"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <input
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="e.g., Father, Mother, Spouse"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactMobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Mobile
                  </label>
                  <input
                    id="emergencyContactMobile"
                    name="emergencyContactMobile"
                    type="tel"
                    value={formData.emergencyContactMobile}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="Emergency contact mobile"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-purple-600" />
                Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-sm transition-colors ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Create a password (min 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-sm transition-colors ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Create Account
                </div>
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Your health data is protected and secure</p>
          <p className="mt-1">© 2024 Hemocare Healthcare Platform</p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;