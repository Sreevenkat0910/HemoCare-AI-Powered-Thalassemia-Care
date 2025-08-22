import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Heart, 
  Shield, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Activity,
  Droplet,
  Clock,
  Target,
  Zap,
  User,
  BookOpen,
  Thermometer
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar
} from 'recharts';

interface AIPredictionsProps {
  onNavigate: (page: string) => void;
}

export function AIPredictions({ onNavigate }: AIPredictionsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

  // Mock AI prediction data
  const symptomPredictions = [
    { date: 'Today', fatigue: 65, weakness: 40, headache: 30, chestPain: 20, prediction: 'mild' },
    { date: 'Tomorrow', fatigue: 70, weakness: 45, headache: 35, chestPain: 25, prediction: 'mild' },
    { date: '3 days', fatigue: 75, weakness: 50, headache: 45, chestPain: 30, prediction: 'moderate' },
    { date: '1 week', fatigue: 80, weakness: 60, headache: 50, chestPain: 35, prediction: 'moderate' },
    { date: '2 weeks', fatigue: 85, weakness: 70, headache: 60, chestPain: 45, prediction: 'moderate' },
    { date: '3 weeks', fatigue: 90, weakness: 75, headache: 65, chestPain: 50, prediction: 'severe' },
    { date: '1 month', fatigue: 95, weakness: 80, headache: 70, chestPain: 55, prediction: 'severe' }
  ];

  const hemoglobinPrediction = [
    { week: 'Current', hemoglobin: 8.2, predicted: false },
    { week: 'Week 1', hemoglobin: 7.8, predicted: true },
    { week: 'Week 2', hemoglobin: 7.5, predicted: true },
    { week: 'Week 3', hemoglobin: 7.0, predicted: true },
    { week: 'Week 4', hemoglobin: 6.8, predicted: true },
    { week: 'After Transfusion', hemoglobin: 9.5, predicted: true }
  ];

  const riskFactors = [
    { factor: 'Iron Overload', score: 85, status: 'high' },
    { factor: 'Cardiac Risk', score: 45, status: 'moderate' },
    { factor: 'Liver Function', score: 30, status: 'low' },
    { factor: 'Bone Health', score: 60, status: 'moderate' },
    { factor: 'Infection Risk', score: 25, status: 'low' },
    { factor: 'Growth Issues', score: 40, status: 'moderate' }
  ];

  const personalizedTips = [
    {
      category: 'Nutrition',
      icon: <Heart className="w-5 h-5 text-red-500" />,
      title: 'Iron-Rich Diet Management',
      description: 'Based on your iron overload risk, limit iron-rich foods and increase calcium intake.',
      tips: ['Avoid red meat and iron supplements', 'Drink tea or coffee with meals', 'Include dairy products daily'],
      priority: 'high'
    },
    {
      category: 'Exercise',
      icon: <Activity className="w-5 h-5 text-green-500" />,
      title: 'Gentle Activity Plan',
      description: 'Your predicted fatigue levels suggest modified exercise routines.',
      tips: ['20-minute walks after meals', 'Light yoga or stretching', 'Avoid intense cardio before transfusion'],
      priority: 'medium'
    },
    {
      category: 'Medication',
      icon: <Droplet className="w-5 h-5 text-blue-500" />,
      title: 'Chelation Therapy Optimization',
      description: 'AI suggests adjustments to your iron chelation schedule.',
      tips: ['Take chelator 2 hours after meals', 'Monitor for side effects', 'Stay well hydrated'],
      priority: 'high'
    },
    {
      category: 'Lifestyle',
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      title: 'Infection Prevention',
      description: 'Your immune system may be compromised. Extra precautions recommended.',
      tips: ['Avoid crowded places before transfusion', 'Get recommended vaccinations', 'Practice good hand hygiene'],
      priority: 'medium'
    }
  ];

  const upcomingMilestones = [
    {
      date: 'August 25',
      event: 'Scheduled Transfusion',
      prediction: 'Hemoglobin expected to be 6.8 g/dL',
      status: 'critical',
      action: 'Confirm appointment'
    },
    {
      date: 'September 2',
      event: 'Iron Level Check',
      prediction: 'Ferritin may exceed 2000 ng/mL',
      status: 'warning',
      action: 'Adjust chelation dose'
    },
    {
      date: 'September 15',
      event: 'Cardiac Function Review',
      prediction: 'Stable cardiac function expected',
      status: 'good',
      action: 'Routine monitoring'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'good': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
              <Brain className="w-8 h-8 text-purple-600" />
              <span>AI Health Predictions</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Personalized insights and future health forecasts powered by AI
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button onClick={() => onNavigate('patient-dashboard')} variant="outline">
              <User className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={() => onNavigate('symptom-logging')}>
              <Activity className="w-4 h-4 mr-2" />
              Update Symptoms
            </Button>
          </div>
        </div>

        {/* AI Confidence Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <Zap className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <strong>AI Confidence: 87%</strong> - Predictions based on your 6-month symptom history, lab results, and similar patient patterns. 
            Last updated: 2 hours ago
          </AlertDescription>
        </Alert>

        {/* Main Content Tabs */}
        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Symptom Forecast</TabsTrigger>
            <TabsTrigger value="health-tips">Health Tips</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="milestones">Upcoming Events</TabsTrigger>
          </TabsList>

          {/* Symptom Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Symptom Severity Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <span>Symptom Severity Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    Predicted symptom intensity over the next 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={symptomPredictions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="fatigue" 
                          stackId="1"
                          stroke="#ef4444" 
                          fill="#ef4444" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="weakness" 
                          stackId="1"
                          stroke="#f59e0b" 
                          fill="#f59e0b" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="headache" 
                          stackId="1"
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Fatigue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Weakness</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Headache</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hemoglobin Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <span>Hemoglobin Forecast</span>
                  </CardTitle>
                  <CardDescription>
                    Predicted hemoglobin levels until next transfusion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hemoglobinPrediction}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[6, 10]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="hemoglobin" 
                          stroke="#dc2626" 
                          strokeWidth={3}
                          strokeDasharray={line => line.predicted ? "5,5" : "0"}
                          dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <AlertDescription className="text-orange-700 dark:text-orange-300">
                        <strong>Transfusion Needed:</strong> Your hemoglobin is predicted to drop to 6.8 g/dL by August 25th. 
                        Appointment already scheduled.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Symptom Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>This Week's Symptom Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Monday - Wednesday</h4>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Mild
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Expect mild fatigue in the afternoon. Good days for light activities.
                    </p>
                    <div className="mt-2">
                      <div className="text-xs text-slate-500">Energy Level</div>
                      <Progress value={75} className="h-2 mt-1" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Thursday - Friday</h4>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Moderate
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Increased weakness expected. Consider rescheduling non-essential activities.
                    </p>
                    <div className="mt-2">
                      <div className="text-xs text-slate-500">Energy Level</div>
                      <Progress value={45} className="h-2 mt-1" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Weekend</h4>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Severe
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Significant fatigue likely. Rest recommended before Monday's transfusion.
                    </p>
                    <div className="mt-2">
                      <div className="text-xs text-slate-500">Energy Level</div>
                      <Progress value={25} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tips Tab */}
          <TabsContent value="health-tips" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {personalizedTips.map((tip, index) => (
                <Card key={index} className={`border ${getPriorityColor(tip.priority)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {tip.icon}
                      <span>{tip.title}</span>
                      <Badge className={tip.priority === 'high' ? 'bg-red-100 text-red-800' : tip.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {tip.priority} priority
                      </Badge>
                    </CardTitle>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tip.tips.map((tipItem, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tipItem}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>AI-Generated Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Personalized suggestions based on your health patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Sleep Optimization</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your symptom patterns suggest better outcomes with 8+ hours of sleep. Consider going to bed 30 minutes earlier.
                  </p>
                </div>
                <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Hydration Timing</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Drinking water 30 minutes before chelation therapy may reduce gastrointestinal side effects by 40%.
                  </p>
                </div>
                <div className="p-4 border border-purple-200 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Stress Management</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    High stress days correlate with increased symptom severity. Try 10-minute meditation sessions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk-analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Risk Factor Radar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-red-500" />
                    <span>Risk Factor Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Current risk levels across different health areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={riskFactors}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="factor" className="text-xs" />
                        <PolarRadiusAxis angle={0} domain={[0, 100]} />
                        <Radar 
                          name="Risk Score" 
                          dataKey="score" 
                          stroke="#ef4444" 
                          fill="#ef4444" 
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Factor Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">{risk.factor}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={risk.score} className="w-24 h-2" />
                          <span className="text-xs text-slate-500">{risk.score}%</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(risk.status)} variant="secondary">
                        {risk.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Preventive Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Recommended Preventive Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">High Priority</h4>
                    <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                      <li>• Schedule cardiac MRI within 2 weeks</li>
                      <li>• Increase chelation therapy frequency</li>
                      <li>• Monitor liver enzymes monthly</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Medium Priority</h4>
                    <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                      <li>• Bone density scan in 3 months</li>
                      <li>• Dietary consultation</li>
                      <li>• Exercise physiotherapy assessment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <div className="space-y-4">
              {upcomingMilestones.map((milestone, index) => (
                <Card key={index} className={`border ${getMilestoneColor(milestone.status)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="w-5 h-5 text-slate-600" />
                          <h3 className="font-medium">{milestone.event}</h3>
                          <Badge className={
                            milestone.status === 'critical' ? 'bg-red-100 text-red-800' :
                            milestone.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {milestone.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {milestone.date}
                        </p>
                        <p className="text-sm">{milestone.prediction}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        {milestone.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Timeline Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>3-Month Health Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">August 2024</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Transfusion due, iron chelation optimization
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">September 2024</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Cardiac monitoring, dietary adjustments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">October 2024</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Comprehensive health review, treatment plan update
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}