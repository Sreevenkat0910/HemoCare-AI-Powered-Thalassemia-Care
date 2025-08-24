import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { BloodDonorService } from '../services/bloodDonorApi';

interface BloodDonorLoginProps {
  onNavigate: (page: string) => void;
}

export default function BloodDonorLogin({ onNavigate }: BloodDonorLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Form submitted, preventing default and stopping propagation');
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***' });
      const response = await BloodDonorService.login({ email, password });
      console.log('Login response:', response);
      
      if (response.token && response.donor) {
        // Clear ALL existing authentication data to prevent conflicts
        localStorage.clear();
        
        // Store blood donor data in the same format as doctor login (mirroring doctor login pattern)
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify({
          ...response.donor,
          role: 'blood-donor', // Add role for compatibility
          firstName: response.donor.firstName || 'Blood',
          lastName: response.donor.lastName || 'Donor'
        }));
        
        // Also store in blood donor format for backward compatibility
        localStorage.setItem('bloodDonorToken', response.token);
        localStorage.setItem('bloodDonorData', JSON.stringify(response.donor));
        
        console.log('Cleared localStorage and stored blood donor data in both formats, navigating to dashboard');
        
        // Show success message and redirect after delay (mirroring doctor login)
        setError(''); // Clear any previous errors
        setSuccessMessage(`Welcome back, ${response.donor.firstName || 'Blood Donor'}! Redirecting to dashboard...`);
        setTimeout(() => {
          onNavigate('blood-donor-dashboard');
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-red-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Blood Donor Portal
          </CardTitle>
          <CardDescription className="text-gray-600">
            Access your blood donation dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="space-y-4" 
            noValidate
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key pressed, preventing default');
              }
            }}
            onChange={() => console.log('Form changed')}
          >
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked, manually submitting form');
                if (formRef.current) {
                  formRef.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
              }}
            >
              {isLoading ? 'Signing in...' : 'Access Blood Donor Portal'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                New blood donor?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('blood-donor-register')}
                  className="text-red-600 hover:text-red-700 font-medium underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
