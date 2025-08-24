import { apiService } from './api';

export interface BloodDonorRegistration {
  email: string;
  password: string;
  user_id: string;
  bridge_id: string;
  role: 'donor' | 'recipient' | 'both';
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  gender: 'male' | 'female' | 'other';
  latitude: number;
  longitude: number;
  donor_type: 'emergency-donor' | 'bridge-donor' | 'volunteer';
  quantity_required?: number;
}

export interface BloodDonorLogin {
  email: string;
  password: string;
}

export interface BloodDonorProfile {
  _id: string;
  email: string;
  user_id: string;
  bridge_id: string;
  role: string;
  blood_group: string;
  gender: string;
  latitude: number;
  longitude: number;
  donor_type: string;
  quantity_required: number;
  last_transfusion_date?: string;
  expected_next_transfusion_date?: string;
  registration_date: string;
  last_donation_date?: string;
  next_eligible_date?: string;
  donations_till_date: number;
  eligibility_status: string;
  role_status: string;
  status: string;
  user_donation_active_status: string;
  cycle_of_donations: number;
  frequency_in_days: number;
  status_of_bridge: string;
  donated_earlier: boolean;
  last_bridge_donation_date?: string;
  calls_to_donations_ratio: number;
  total_calls: number;
  last_contacted_date?: string;
  inactive_trigger_comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodDonorResponse {
  success: boolean;
  message: string;
  data: BloodDonorProfile;
}

export interface BloodDonorListResponse {
  success: boolean;
  data: {
    donors: BloodDonorProfile[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_donors: number;
      limit: number;
    };
  };
}

export interface NearbyDonorsResponse {
  success: boolean;
  data: BloodDonorProfile[];
}

export class BloodDonorService {
  // Register a new blood donor
  static async register(donorData: BloodDonorRegistration): Promise<BloodDonorResponse> {
    try {
      const response = await apiService.request('/api/blood-donors/register', {
        method: 'POST',
        body: JSON.stringify(donorData),
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register blood donor');
    }
  }

  // Login blood donor
  static async login(loginData: BloodDonorLogin): Promise<{ token: string; donor: any }> {
    try {
      const response = await apiService.request('/api/blood-donors/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });
      return {
        token: response.token,
        donor: response.donor
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  }

  // Get blood donor profile
  static async getProfile(): Promise<BloodDonorProfile> {
    try {
      const token = localStorage.getItem('bloodDonorToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Sending token:', token.substring(0, 20) + '...');

      const response = await apiService.request('/api/blood-donors/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  // Update blood donor profile
  static async updateProfile(updateData: Partial<BloodDonorProfile>): Promise<BloodDonorResponse> {
    try {
      const token = localStorage.getItem('bloodDonorToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiService.request('/api/blood-donors/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  // Get all blood donors (for admin/healthcare providers)
  static async getAllDonors(params?: {
    page?: number;
    limit?: number;
    blood_group?: string;
    status?: string;
    eligibility_status?: string;
  }): Promise<BloodDonorListResponse> {
    try {
      const queryString = new URLSearchParams(params as any).toString();
      const endpoint = `/api/blood-donors${queryString ? `?${queryString}` : ''}`;
      const response = await apiService.request(endpoint, {
        method: 'GET',
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch donors');
    }
  }

  // Get nearby blood donors
  static async getNearbyDonors(params: {
    latitude: number;
    longitude: number;
    maxDistance?: number;
    blood_group?: string;
    limit?: number;
  }): Promise<NearbyDonorsResponse> {
    try {
      const queryString = new URLSearchParams(params as any).toString();
      const endpoint = `/api/blood-donors/nearby${queryString ? `?${queryString}` : ''}`;
      const response = await apiService.request(endpoint, {
        method: 'GET',
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch nearby donors');
    }
  }

  // Update donor eligibility status (for healthcare providers)
  static async updateEligibility(
    donorId: string,
    eligibilityData: {
      eligibility_status?: string;
      next_eligible_date?: string;
      inactive_trigger_comment?: string;
    }
  ): Promise<BloodDonorResponse> {
    try {
      const response = await apiService.request(`/api/blood-donors/${donorId}/eligibility`, {
        method: 'PATCH',
        body: JSON.stringify(eligibilityData),
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update eligibility status');
    }
  }
}

export default BloodDonorService;
