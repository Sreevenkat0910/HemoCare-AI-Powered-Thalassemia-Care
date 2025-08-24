const API_BASE_URL = 'http://localhost:5001';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // User registration
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: 'Male' | 'Female' | 'Other';
    mobile: string;
    dateOfBirth: string;
    bloodGroup: 'A-' | 'A+' | 'O-' | 'AB-' | 'AB+' | 'B+' | 'B-';
    city: string;
    pincode: string;
    role?: 'patient' | 'doctor' | 'admin' | 'Bridge Don' | 'Emergency' | 'Fighter';
    thalassemiaType?: string;
    diagnosisDate?: string;
    currentMedications?: string;
    allergies?: string;
    previousSurgeries?: string;
    emergencyContact?: {
      name: string;
      relationship: string;
      mobile: string;
    };
  }): Promise<ApiResponse> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User login
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Get current user profile
  async getCurrentUser(token: string): Promise<ApiResponse> {
    return this.request('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Update user profile
  async updateProfile(
    token: string,
    updates: Partial<{
      firstName: string;
      lastName: string;
      phoneNumber: string;
      dateOfBirth: string;
      gender: 'male' | 'female' | 'other';
    }>
  ): Promise<ApiResponse> {
    return this.request('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
