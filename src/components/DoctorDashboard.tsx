import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Filter, 
  Users, 
  AlertTriangle, 
  Calendar, 
  Phone,
  Mail,
  FileText,
  Activity,
  Heart,
  Clock,
  TrendingUp,
  MessageSquare,
  Bot,
  Zap,
  Database,
  Brain
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DoctorDashboardProps {
  onNavigate: (page: string) => void;
}

export function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const patients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 28,
      type: 'Beta Thalassemia Major',
      lastTransfusion: '2024-08-15',
      nextTransfusion: '2024-08-25',
      status: 'stable',
      hemoglobin: 8.2,
      recentSymptoms: ['fatigue', 'dizziness'],
      urgency: 'low',
      phone: '+1 (555) 123-4567',
      email: 'sarah.j@email.com',
      digitalTwin: {
        accuracy: 94.2,
        lastUpdate: '2 min ago',
        riskScore: 35,
        activeAlerts: 1
      }
    },
    {
      id: 2,
      name: 'Ahmad Rahman',
      age: 22,
      type: 'Beta Thalassemia Major',
      lastTransfusion: '2024-08-10',
      nextTransfusion: '2024-08-22',
      status: 'needs-attention',
      hemoglobin: 6.8,
      recentSymptoms: ['chest pain', 'severe fatigue'],
      urgency: 'high',
      phone: '+1 (555) 987-6543',
      email: 'ahmad.r@email.com',
      digitalTwin: {
        accuracy: 91.5,
        lastUpdate: '5 min ago',
        riskScore: 72,
        activeAlerts: 3
      }
    },
    {
      id: 3,
      name: 'Maria Gonzalez',
      age: 35,
      type: 'Alpha Thalassemia',
      lastTransfusion: '2024-08-18',
      nextTransfusion: '2024-08-28',
      status: 'stable',
      hemoglobin: 9.1,
      recentSymptoms: ['mild headache'],
      urgency: 'low',
      phone: '+1 (555) 456-7890',
      email: 'maria.g@email.com',
      digitalTwin: {
        accuracy: 96.8,
        lastUpdate: '1 min ago',
        riskScore: 28,
        activeAlerts: 0
      }
    },
    {
      id: 4,
      name: 'David Chen',
      age: 19,
      type: 'Beta Thalassemia Intermedia',
      lastTransfusion: '2024-08-12',
      nextTransfusion: '2024-08-24',
      status: 'monitoring',
      hemoglobin: 7.5,
      recentSymptoms: ['weakness', 'pale skin'],
      urgency: 'medium',
      phone: '+1 (555) 321-9876',
      email: 'david.c@email.com',
      digitalTwin: {
        accuracy: 89.3,
        lastUpdate: '10 min ago',
        riskScore: 45,
        activeAlerts: 2
      }
    }
  ];

  const alerts = [
    {
      id: 1,
      patient: 'Ahmad Rahman',
      type: 'Critical',
      message: 'Digital Twin predicts 85% chance of complications if transfusion delayed',
      time: '2 hours ago',
      source: 'Digital Twin'
    },
    {
      id: 2,
      patient: 'David Chen',
      type: 'Reminder',
      message: 'Transfusion appointment tomorrow - Twin suggests earlier timing',
      time: '4 hours ago',
      source: 'AI Scheduler'
    },
    {
      id: 3,
      patient: 'Sarah Johnson',
      type: 'Symptom',
      message: 'Twin detected pattern: symptoms worsen before weekend',
      time: '6 hours ago',
      source: 'Pattern AI'
    }
  ];

  const upcomingAppointments = [
    {
      time: '9:00 AM',
      patient: 'Ahmad Rahman',
      type: 'Transfusion',
      status: 'confirmed',
      twinRecommendation: 'Urgent - High risk detected'
    },
    {
      time: '10:30 AM',
      patient: 'David Chen',
      type: 'Consultation',
      status: 'pending',
      twinRecommendation: 'Standard follow-up'
    },
    {
      time: '2:00 PM',
      patient: 'Maria Gonzalez',
      type: 'Follow-up',
      status: 'confirmed',
      twinRecommendation: 'Routine check-up'
    }
  ];

  // Digital Twin Network Statistics
  const networkStats = {
    totalTwins: 1247,
    activeSimulations: 89,
    averageAccuracy: 92.8,
    predictionsToday: 156,
    alertsGenerated: 23,
    careImprovements: 18.7 // percentage
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'needs-attention': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'Critical': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'Reminder': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      case 'Symptom': return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Healthcare Provider Portal</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage patients with AI-powered Digital Twins</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule Appointment</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats with Digital Twin Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{patients.length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{networkStats.totalTwins}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Digital Twins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{networkStats.averageAccuracy}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">AI Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{patients.filter(p => p.urgency === 'high').length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{networkStats.predictionsToday}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">AI Predictions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold">{networkStats.careImprovements}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Care Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient List with Digital Twin Integration */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Patient Management</span>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    AI-Enhanced
                  </Badge>
                </CardTitle>
                <CardDescription>Monitor patients with Digital Twin insights</CardDescription>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="needs-attention">Needs Attention</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getUrgencyColor(patient.urgency)}`}></div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{patient.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {patient.age} years • {patient.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(patient.status)} variant="secondary">
                          {patient.status.replace('-', ' ')}
                        </Badge>
                        {patient.digitalTwin.activeAlerts > 0 && (
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            {patient.digitalTwin.activeAlerts} alerts
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Digital Twin Metrics */}
                    <div className="grid sm:grid-cols-3 gap-3 mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Twin Accuracy:</span>
                        <div className="flex items-center space-x-1">
                          <Bot className="w-3 h-3 text-purple-600" />
                          <span className="font-medium">{patient.digitalTwin.accuracy}%</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Risk Score:</span>
                        <span className={`ml-1 font-medium ${patient.digitalTwin.riskScore > 50 ? 'text-red-600' : patient.digitalTwin.riskScore > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {patient.digitalTwin.riskScore}%
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Last Update:</span>
                        <span className="ml-1 font-medium text-green-600">{patient.digitalTwin.lastUpdate}</span>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Hemoglobin:</span>
                        <span className="ml-1 font-medium">{patient.hemoglobin} g/dL</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Next Transfusion:</span>
                        <span className="ml-1 font-medium">{patient.nextTransfusion}</span>
                      </div>
                    </div>
                    
                    {patient.recentSymptoms.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Recent symptoms:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {patient.recentSymptoms.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Bot className="w-3 h-3 mr-1" />
                        View Twin
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with AI Insights */}
          <div className="space-y-6">
            {/* AI Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-orange-500" />
                  <span>AI Insights & Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant="secondary" 
                        className={alert.type === 'Critical' ? 'bg-red-100 text-red-800' : 
                                  alert.type === 'Reminder' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-orange-100 text-orange-800'}
                      >
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{alert.patient}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{alert.message}</p>
                    <Badge variant="outline" className="text-xs">
                      {alert.source}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Today's Schedule with AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 dark:text-white">{appointment.time}</span>
                      <Badge 
                        variant="outline" 
                        className={appointment.status === 'confirmed' ? 'border-green-500 text-green-700' : 'border-yellow-500 text-yellow-700'}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{appointment.patient}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{appointment.type}</p>
                    <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                      <div className="flex items-center space-x-1">
                        <Bot className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-700 dark:text-purple-300">{appointment.twinRecommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Digital Twin Network Stats */}
            <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  <span>Twin Network</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{networkStats.activeSimulations}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Active Simulations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{networkStats.alertsGenerated}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Alerts Today</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Bot className="w-4 h-4 mr-2" />
                  Network Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Broadcast Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Blood Donor Network
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}