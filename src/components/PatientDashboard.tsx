import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Calendar, 
  Activity, 
  Heart, 
  Bell, 
  User, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplet,
  Brain
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PatientDashboardProps {
  onNavigate: (page: string) => void;
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const nextTransfusion = {
    date: "August 25, 2024",
    time: "10:00 AM",
    hospital: "City General Hospital",
    daysRemaining: 5
  };

  const healthMetrics = [
    { name: 'Hemoglobin', value: 8.2, unit: 'g/dL', status: 'low', target: '12-16' },
    { name: 'Iron Level', value: 180, unit: 'μg/dL', status: 'high', target: '60-170' },
    { name: 'Heart Rate', value: 82, unit: 'bpm', status: 'normal', target: '60-100' },
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', target: '<140/90' }
  ];

  const recentSymptoms = [
    { date: 'Today', symptoms: 'Mild fatigue, dizziness', severity: 'mild' },
    { date: 'Yesterday', symptoms: 'Headache, weakness', severity: 'moderate' },
    { date: '2 days ago', symptoms: 'Chest tightness', severity: 'severe' }
  ];

  const transfusionHistory = [
    { month: 'Feb', hemoglobin: 7.8 },
    { month: 'Mar', hemoglobin: 9.2 },
    { month: 'Apr', hemoglobin: 8.5 },
    { month: 'May', hemoglobin: 9.8 },
    { month: 'Jun', hemoglobin: 8.9 },
    { month: 'Jul', hemoglobin: 9.5 },
    { month: 'Aug', hemoglobin: 8.2 }
  ];

  const medicationSchedule = [
    { name: 'Deferasirox', time: '8:00 AM', taken: true },
    { name: 'Folic Acid', time: '12:00 PM', taken: true },
    { name: 'Vitamin C', time: '6:00 PM', taken: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'low': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'severe': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, Sarah</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Here's your health overview for today</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button onClick={() => onNavigate('ai-predictions')} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
              <Brain className="w-4 h-4" />
              <span>AI Predictions</span>
            </Button>
            <Button onClick={() => onNavigate('symptom-logging')} className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Log Symptoms</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Upload Report</span>
            </Button>
          </div>
        </div>

        {/* Next Transfusion Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <Calendar className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <strong>Next transfusion scheduled:</strong> {nextTransfusion.date} at {nextTransfusion.time} - {nextTransfusion.hospital}
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {nextTransfusion.daysRemaining} days remaining
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* AI Insight Alert */}
        <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
          <Brain className="w-4 h-4 text-purple-600" />
          <AlertDescription className="text-purple-700 dark:text-purple-300">
            <div className="flex items-center justify-between">
              <div>
                <strong>AI Health Insight:</strong> Your symptoms may worsen over the next week. Consider adjusting your activity level.
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onNavigate('ai-predictions')}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                View Details
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Health Metrics & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Current Health Metrics</span>
                </CardTitle>
                <CardDescription>Latest test results and vital signs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-900 dark:text-white">{metric.name}</h4>
                        <Badge className={getStatusColor(metric.status)} variant="secondary">
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {metric.value} <span className="text-sm font-normal text-slate-500">{metric.unit}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Target: {metric.target}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hemoglobin Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Hemoglobin Trend</span>
                </CardTitle>
                <CardDescription>Your hemoglobin levels over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transfusionHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[6, 12]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="hemoglobin" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Daily Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Today's Medications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {medicationSchedule.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{med.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{med.time}</div>
                    </div>
                    {med.taken ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span>Recent Symptoms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSymptoms.map((log, index) => (
                  <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{log.date}</span>
                      <Badge className={getSeverityColor(log.severity)} variant="secondary">
                        {log.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{log.symptoms}</p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('symptom-logging')}
                  className="w-full mt-3"
                >
                  Log New Symptoms
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Droplet className="w-4 h-4 mr-2" />
                  Find Blood Donors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Medical Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}