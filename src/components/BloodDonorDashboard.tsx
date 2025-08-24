import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  User, 
  MapPin, 
  Droplets, 
  Calendar, 
  Phone, 
  Mail, 
  Activity,
  Heart,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  LogOut
} from 'lucide-react';
import { BloodDonorService } from '../services/bloodDonorApi';

interface BloodDonorDashboardProps {
  onNavigate: (page: string) => void;
}

interface BloodDonorProfile {
  user_id: string;
  bridge_id: string;
  role: string;
  role_status: boolean;
  bridge_status: boolean;
  blood_group: string;
  gender: string;
  latitude: number;
  longitude: number;
  bridge_gender?: string;
  bridge_blood_group?: string;
  quantity_required?: number;
  last_transfusion_date?: string;
  expected_next_transfusion_date?: string;
  registration_date: string;
  donor_type: string;
  last_contacted_date: string;
  last_donation_date?: string;
  next_eligible_date?: string;
  donations_till_date: number;
  eligibility_status: string;
  cycle_of_donations: number;
  total_calls: number;
  frequency_in_days: number;
  status_of_bridge: boolean;
  status: string;
  donated_earlier: boolean;
  last_bridge_donation_date?: string;
  calls_to_donations_ratio: number;
  user_donation_active_status: string;
  inactive_trigger_comment?: string;
  email: string;
}

export default function BloodDonorDashboard({ onNavigate }: BloodDonorDashboardProps) {
  const [donorProfile, setDonorProfile] = useState<BloodDonorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDonorProfile();
  }, []);

  const loadDonorProfile = async () => {
    try {
      // Try to get profile from stored data first (mirroring doctor dashboard pattern)
      const storedData = localStorage.getItem('userData');
      const bloodDonorData = localStorage.getItem('bloodDonorData');
      
      if (storedData) {
        try {
          const userData = JSON.parse(storedData);
          if (userData.role === 'blood-donor') {
            // Use stored data instead of API call
            console.log('Loading profile from stored data');
            setDonorProfile(userData);
            setIsLoading(false);
            return;
          }
        } catch (parseError) {
          console.error('Error parsing stored data:', parseError);
        }
      }
      
      // Fallback to blood donor data
      if (bloodDonorData) {
        try {
          const donorData = JSON.parse(bloodDonorData);
          console.log('Loading profile from blood donor data');
          setDonorProfile(donorData);
          setIsLoading(false);
          return;
        } catch (parseError) {
          console.error('Error parsing blood donor data:', parseError);
        }
      }
      
      // If no stored data, try API call as last resort
      const token = localStorage.getItem('bloodDonorToken');
      if (!token) {
        setError('No authentication data found. Please login again.');
        return;
      }

      const profile = await BloodDonorService.getProfile();
      setDonorProfile(profile);
    } catch (error: any) {
      console.error('Profile loading error:', error);
      setError('Failed to load profile. Using stored data instead.');
      
      // Try to use stored data as fallback
      const bloodDonorData = localStorage.getItem('bloodDonorData');
      if (bloodDonorData) {
        try {
          const donorData = JSON.parse(bloodDonorData);
          setDonorProfile(donorData);
        } catch (parseError) {
          setError('Unable to load profile data. Please login again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear both authentication formats (mirroring doctor logout pattern)
    localStorage.removeItem('bloodDonorToken');
    localStorage.removeItem('bloodDonorData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    onNavigate('blood-donor-login');
  };

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDonorTypeColor = (type: string | undefined | null) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type) {
      case 'emergency-donor': return 'bg-red-100 text-red-800';
      case 'bridge-donor': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => onNavigate('blood-donor-login')} className="bg-red-600 hover:bg-red-700">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!donorProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Donor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {donorProfile.firstName || 'Blood'} {donorProfile.lastName || 'Donor'}!</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>



        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Personal Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium">{donorProfile.user_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge ID:</span>
                <span className="font-medium">{donorProfile.bridge_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <Badge variant="outline">{donorProfile.role || 'donor'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{donorProfile.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{donorProfile.gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blood Group:</span>
                <Badge className="bg-red-100 text-red-800">
                  <Droplets className="w-3 h-3 mr-1" />
                  {donorProfile.blood_group}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donor Type:</span>
                <Badge className={getDonorTypeColor(donorProfile.donor_type)}>
                  {donorProfile.donor_type ? donorProfile.donor_type.replace('-', ' ') : 'N/A'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Location & Status */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Location & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Latitude:</span>
                <span className="font-medium">{donorProfile.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longitude:</span>
                <span className="font-medium">{donorProfile.longitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={getStatusColor(donorProfile.status)}>
                  {donorProfile.status || 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role Status:</span>
                <Badge variant={donorProfile.role_status ? "default" : "secondary"}>
                  {donorProfile.role_status ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge Status:</span>
                <Badge variant={donorProfile.bridge_status ? "default" : "secondary"}>
                  {donorProfile.bridge_status ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registration Date:</span>
                <span className="font-medium">
                  {donorProfile.registration_date ? new Date(donorProfile.registration_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Donation Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Donation Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Donations:</span>
                <span className="font-medium">{donorProfile.donations_till_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Eligibility:</span>
                <Badge className={donorProfile.eligibility_status === 'eligible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {donorProfile.eligibility_status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Eligible:</span>
                <span className="font-medium">
                  {donorProfile.next_eligible_date ? new Date(donorProfile.next_eligible_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Donation:</span>
                <span className="font-medium">
                  {donorProfile.last_donation_date ? new Date(donorProfile.last_donation_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cycle (days):</span>
                <span className="font-medium">{donorProfile.cycle_of_donations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Calls:</span>
                <span className="font-medium">{donorProfile.total_calls}</span>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Transfusion:</span>
                <span className="font-medium">
                  {donorProfile.last_transfusion_date ? new Date(donorProfile.last_transfusion_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Next:</span>
                <span className="font-medium">
                  {donorProfile.expected_next_transfusion_date ? new Date(donorProfile.expected_next_transfusion_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity Required:</span>
                <span className="font-medium">{donorProfile.quantity_required || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donated Earlier:</span>
                <Badge variant={donorProfile.donated_earlier ? "default" : "secondary"}>
                  {donorProfile.donated_earlier ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge Donation:</span>
                <span className="font-medium">
                  {donorProfile.last_bridge_donation_date ? new Date(donorProfile.last_bridge_donation_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Bridge Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                Bridge Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge Gender:</span>
                <span className="font-medium">{donorProfile.bridge_gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge Blood Group:</span>
                <span className="font-medium">{donorProfile.bridge_blood_group || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status of Bridge:</span>
                <Badge variant={donorProfile.status_of_bridge ? "default" : "secondary"}>
                  {donorProfile.status_of_bridge ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frequency (days):</span>
                <span className="font-medium">{donorProfile.frequency_in_days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calls/Donations Ratio:</span>
                <span className="font-medium">{donorProfile.calls_to_donations_ratio}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Update Profile
              </Button>
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                Check Eligibility
              </Button>
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                View History
              </Button>
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Last contacted on {new Date(donorProfile.last_contacted_date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline">Contact</Badge>
                </div>
                
                {donorProfile.last_donation_date && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Last donation on {new Date(donorProfile.last_donation_date).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="outline">Donation</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Profile updated on {new Date(donorProfile.registration_date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline">Profile</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Alerts */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Emergency Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donorProfile.eligibility_status === 'eligible' ? (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-green-800 font-medium">You are eligible to donate!</p>
                  <p className="text-green-600 text-sm">Ready to save lives</p>
                </div>
              ) : (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-yellow-800 font-medium">Not eligible yet</p>
                  <p className="text-yellow-600 text-sm">Next eligible: {donorProfile.next_eligible_date ? new Date(donorProfile.next_eligible_date).toLocaleDateString() : 'TBD'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
