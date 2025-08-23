import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  MapPin, 
  Droplets, 
  Activity, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';

interface Donor {
  _id: string;
  userId: string;
  role: string;
  bloodGroup: string;
  gender: string;
  latitude: number;
  longitude: number;
  status: string;
  eligibilityStatus: string;
  donationsTillDate: number;
  totalCalls: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  createdAt: string;
}

interface DonorStats {
  overall: {
    totalDonors: number;
    activeDonors: number;
    eligibleDonors: number;
    emergencyDonors: number;
    bridgeDonors: number;
    volunteers: number;
  };
  bloodGroups: Array<{ _id: string; count: number }>;
  gender: Array<{ _id: string; count: number }>;
}

const DonorDashboard: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bloodGroup: '',
    status: '',
    eligibilityStatus: '',
    role: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchDonors();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await api.get(`/donors?${params}`);
      setDonors(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/donors/stats/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchDonors();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEligibilityColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'bg-blue-100 text-blue-800';
      case 'not eligible': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Emergency Donor': return 'bg-red-100 text-red-800';
      case 'Bridge Donor': return 'bg-purple-100 text-purple-800';
      case 'Volunteer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Donor Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and monitor blood donor information and statistics
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overall.totalDonors}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overall.activeDonors} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eligible Donors</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overall.eligibleDonors}</div>
              <p className="text-xs text-muted-foreground">
                Ready for donation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Donors</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overall.emergencyDonors}</div>
              <p className="text-xs text-muted-foreground">
                Available for urgent needs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bridge Donors</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overall.bridgeDonors}</div>
              <p className="text-xs text-muted-foreground">
                Regular donors
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search donors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            
            <Select value={filters.bloodGroup} onValueChange={(value) => handleFilterChange('bloodGroup', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Blood Groups</SelectItem>
                <SelectItem value="A Positive">A+</SelectItem>
                <SelectItem value="A Negative">A-</SelectItem>
                <SelectItem value="B Positive">B+</SelectItem>
                <SelectItem value="B Negative">B-</SelectItem>
                <SelectItem value="AB Positive">AB+</SelectItem>
                <SelectItem value="AB Negative">AB-</SelectItem>
                <SelectItem value="O Positive">O+</SelectItem>
                <SelectItem value="O Negative">O-</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.eligibilityStatus} onValueChange={(value) => handleFilterChange('eligibilityStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Eligibility</SelectItem>
                <SelectItem value="eligible">Eligible</SelectItem>
                <SelectItem value="not eligible">Not Eligible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setFilters({ bloodGroup: '', status: '', eligibilityStatus: '', role: '' });
                setSearchTerm('');
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donors Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Donor Records</CardTitle>
              <CardDescription>
                Showing {donors.length} of {pagination.total} donors
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Donations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor) => (
                <TableRow key={donor._id}>
                  <TableCell className="font-mono text-sm">
                    {donor.userId.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(donor.role)}>
                      {donor.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{donor.bloodGroup}</Badge>
                  </TableCell>
                  <TableCell>{donor.gender}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(donor.status)}>
                      {donor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEligibilityColor(donor.eligibilityStatus)}>
                      {donor.eligibilityStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{donor.donationsTillDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDashboard;
