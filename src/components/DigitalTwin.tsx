import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { 
  Bot,
  Database,
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  Activity,
  Heart,
  Droplet,
  Calendar,
  Clock,
  Target,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Users,
  FileText,
  Smartphone,
  Stethoscope,
  TestTube,
  Pill
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
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface DigitalTwinProps {
  onNavigate: (page: string) => void;
}

export function DigitalTwin({ onNavigate }: DigitalTwinProps) {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [twinAccuracy, setTwinAccuracy] = useState(94.2);

  // Mock data sources and their last update times
  const dataSources = [
    { 
      name: 'Blood Warriors Dataset', 
      status: 'active', 
      lastSync: '2 min ago', 
      records: 15420,
      icon: <Database className="w-4 h-4" />
    },
    { 
      name: 'Hospital EMR System', 
      status: 'active', 
      lastSync: '5 min ago', 
      records: 847,
      icon: <FileText className="w-4 h-4" />
    },
    { 
      name: 'Wearable Devices', 
      status: 'connected', 
      lastSync: '1 min ago', 
      records: 2340,
      icon: <Smartphone className="w-4 h-4" />
    },
    { 
      name: 'Lab Results', 
      status: 'active', 
      lastSync: '1 hour ago', 
      records: 156,
      icon: <TestTube className="w-4 h-4" />
    },
    { 
      name: 'Patient Input', 
      status: 'active', 
      lastSync: 'Just now', 
      records: 89,
      icon: <Users className="w-4 h-4" />
    }
  ];

  // Digital Twin Profile Data
  const twinProfile = {
    patientId: 'PT-2024-001',
    name: 'Sarah Johnson',
    age: 28,
    genotype: 'β⁰/β⁺',
    baselineHemoglobin: 8.2,
    transfusionFrequency: 21, // days
    lastUpdate: '2 minutes ago',
    confidenceScore: 94.2,
    riskLevel: 'moderate'
  };

  // Simulation scenarios
  const scenarios = [
    {
      id: 'baseline',
      name: 'Current Treatment Plan',
      description: 'Continue current transfusion and chelation schedule'
    },
    {
      id: 'delayed-transfusion',
      name: 'Delayed Transfusion',
      description: 'What if next transfusion is delayed by 7 days?'
    },
    {
      id: 'missed-chelation',
      name: 'Inconsistent Chelation',
      description: 'Impact of missing 30% of chelation doses'
    },
    {
      id: 'increased-frequency',
      name: 'Increased Transfusion Frequency',
      description: 'Transfusions every 14 days instead of 21'
    },
    {
      id: 'lifestyle-change',
      name: 'Lifestyle Optimization',
      description: 'Improved diet, exercise, and stress management'
    }
  ];

  // Simulation results for different scenarios
  const scenarioResults = {
    baseline: {
      hemoglobinTrend: [
        { day: 0, hemoglobin: 8.2, ironLevel: 180, symptoms: 2 },
        { day: 7, hemoglobin: 7.8, ironLevel: 190, symptoms: 3 },
        { day: 14, hemoglobin: 7.4, ironLevel: 200, symptoms: 4 },
        { day: 21, hemoglobin: 7.0, ironLevel: 210, symptoms: 5 },
        { day: 22, hemoglobin: 9.5, ironLevel: 210, symptoms: 1 } // Post-transfusion
      ],
      riskScore: 35,
      hospitalizationRisk: 8,
      qualityOfLife: 78
    },
    'delayed-transfusion': {
      hemoglobinTrend: [
        { day: 0, hemoglobin: 8.2, ironLevel: 180, symptoms: 2 },
        { day: 7, hemoglobin: 7.8, ironLevel: 190, symptoms: 3 },
        { day: 14, hemoglobin: 7.4, ironLevel: 200, symptoms: 4 },
        { day: 21, hemoglobin: 7.0, ironLevel: 210, symptoms: 5 },
        { day: 28, hemoglobin: 6.5, ironLevel: 220, symptoms: 7 },
        { day: 29, hemoglobin: 9.2, ironLevel: 220, symptoms: 2 } // Delayed transfusion
      ],
      riskScore: 65,
      hospitalizationRisk: 22,
      qualityOfLife: 58
    }
  };

  // Real-time health indicators
  const healthIndicators = [
    { name: 'Hemoglobin Stability', value: 87, trend: 'stable', color: '#10b981' },
    { name: 'Iron Overload Risk', value: 42, trend: 'increasing', color: '#f59e0b' },
    { name: 'Cardiac Function', value: 94, trend: 'stable', color: '#3b82f6' },
    { name: 'Symptom Severity', value: 28, trend: 'decreasing', color: '#ef4444' },
    { name: 'Treatment Adherence', value: 91, trend: 'stable', color: '#8b5cf6' },
    { name: 'Quality of Life', value: 78, trend: 'improving', color: '#06b6d4' }
  ];

  // Actionable insights and recommendations
  const actionableInsights = [
    {
      priority: 'high',
      type: 'transfusion',
      title: 'Optimal Transfusion Timing',
      message: 'Schedule next transfusion on August 25th (±1 day) for optimal hemoglobin management',
      action: 'Schedule Appointment',
      confidence: 92
    },
    {
      priority: 'high',
      type: 'alert',
      title: 'Iron Overload Warning',
      message: 'Current chelation regimen may be insufficient. Consult doctor about dose adjustment.',
      action: 'Contact Doctor',
      confidence: 87
    },
    {
      priority: 'medium',
      type: 'lifestyle',
      title: 'Exercise Recommendation',
      message: 'Light cardio 3x/week could improve hemoglobin efficiency by 8-12%',
      action: 'View Exercise Plan',
      confidence: 78
    },
    {
      priority: 'medium',
      type: 'nutrition',
      title: 'Dietary Optimization',
      message: 'Iron-blocking foods during meals could reduce overload risk by 15%',
      action: 'View Diet Plan',
      confidence: 85
    },
    {
      priority: 'low',
      type: 'monitoring',
      title: 'Wearable Data Gap',
      message: 'Heart rate data missing for 3 days. Sync your wearable device.',
      action: 'Sync Device',
      confidence: 95
    }
  ];

  // Aggregate research data (simulated)
  const researchMetrics = {
    totalTwins: 1247,
    activeSimulations: 89,
    successfulPredictions: 94.2,
    dataPoints: 2.4, // millions
    improvementInCare: 23.7 // percentage
  };

  useEffect(() => {
    if (isSimulationRunning) {
      const interval = setInterval(() => {
        setSimulationProgress(prev => {
          if (prev >= 100) {
            setIsSimulationRunning(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isSimulationRunning]);

  const runSimulation = () => {
    setSimulationProgress(0);
    setIsSimulationRunning(true);
  };

  const resetSimulation = () => {
    setSimulationProgress(0);
    setIsSimulationRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'connected': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'syncing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
              <Bot className="w-8 h-8 text-blue-600" />
              <span>Digital Twin</span>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                v2.1
              </Badge>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Your personalized AI-powered health replica
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button onClick={() => onNavigate('patient-dashboard')} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
            <Button onClick={() => onNavigate('ai-predictions')}>
              <Brain className="w-4 h-4 mr-2" />
              AI Predictions
            </Button>
          </div>
        </div>

        {/* Twin Status Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{twinAccuracy}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Twin Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">18.9k</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Data Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Live</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">2 min</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Last Update</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Digital Twin Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <span>Digital Twin Profile</span>
                  </CardTitle>
                  <CardDescription>Your personalized health replica</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{twinProfile.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">ID: {twinProfile.patientId}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Age: {twinProfile.age} | Genotype: {twinProfile.genotype}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Baseline Hb</div>
                      <div className="font-medium">{twinProfile.baselineHemoglobin} g/dL</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Transfusion Cycle</div>
                      <div className="font-medium">{twinProfile.transfusionFrequency} days</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Confidence Score</div>
                      <div className="font-medium">{twinProfile.confidenceScore}%</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Risk Level</div>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {twinProfile.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Health Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>Health Indicators</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{indicator.name}</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{indicator.value}%</span>
                        </div>
                        <Progress value={indicator.value} className="h-2" style={{
                          background: `${indicator.color}20`
                        }} />
                      </div>
                      <div className="ml-3">
                        <Badge variant="outline" className={
                          indicator.trend === 'improving' ? 'text-green-700 border-green-200' :
                          indicator.trend === 'stable' ? 'text-blue-700 border-blue-200' :
                          'text-orange-700 border-orange-200'
                        }>
                          {indicator.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Current Health Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Real-Time Health Trends</span>
                </CardTitle>
                <CardDescription>Live data from your Digital Twin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scenarioResults.baseline.hemoglobinTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="hemoglobin" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                        name="Hemoglobin (g/dL)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ironLevel" 
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                        fillOpacity={0.3}
                        name="Iron Level (μg/dL)"
                        yAxisId="right"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation" className="space-y-6">
            {/* Simulation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <span>Scenario Simulation</span>
                </CardTitle>
                <CardDescription>
                  Run "what-if" scenarios to optimize your treatment plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Scenario</label>
                    <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scenarios.map(scenario => (
                          <SelectItem key={scenario.id} value={scenario.id}>
                            <div>
                              <div className="font-medium">{scenario.name}</div>
                              <div className="text-xs text-slate-500">{scenario.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={runSimulation}
                      disabled={isSimulationRunning}
                      className="flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Run Simulation</span>
                    </Button>
                    <Button 
                      onClick={resetSimulation}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </Button>
                  </div>
                </div>

                {/* Simulation Progress */}
                {(isSimulationRunning || simulationProgress > 0) && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isSimulationRunning ? 'Running Simulation...' : 'Simulation Complete'}
                      </span>
                      <span className="text-sm text-blue-600">{simulationProgress}%</span>
                    </div>
                    <Progress value={simulationProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Simulation Results */}
            {simulationProgress === 100 && (
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Predicted Health Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={scenarioResults[selectedScenario as keyof typeof scenarioResults]?.hemoglobinTrend || scenarioResults.baseline.hemoglobinTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="hemoglobin" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                            name="Hemoglobin"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="symptoms" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            name="Symptom Score"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Overall Risk Score', value: scenarioResults[selectedScenario as keyof typeof scenarioResults]?.riskScore || 35, color: '#ef4444' },
                      { name: 'Hospitalization Risk', value: scenarioResults[selectedScenario as keyof typeof scenarioResults]?.hospitalizationRisk || 8, color: '#f59e0b' },
                      { name: 'Quality of Life', value: scenarioResults[selectedScenario as keyof typeof scenarioResults]?.qualityOfLife || 78, color: '#10b981' }
                    ].map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <span className="text-sm">{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-4">
              {actionableInsights.map((insight, index) => (
                <Card key={index} className={`border ${getPriorityColor(insight.priority)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={
                            insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {insight.priority} priority
                          </Badge>
                          <Badge variant="outline">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                          {insight.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {insight.message}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        {insight.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="data-sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-green-600" />
                  <span>Connected Data Sources</span>
                </CardTitle>
                <CardDescription>
                  Real-time data feeds powering your Digital Twin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                        {source.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">{source.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {source.records.toLocaleString()} records • Last sync: {source.lastSync}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(source.status)} variant="secondary">
                      {source.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Data Quality & Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Data Completeness</h4>
                    <div className="space-y-2">
                      {[
                        { category: 'Transfusion Records', completeness: 98 },
                        { category: 'Lab Results', completeness: 94 },
                        { category: 'Symptom Logs', completeness: 87 },
                        { category: 'Medication History', completeness: 91 },
                        { category: 'Wearable Data', completeness: 76 }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.category}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={item.completeness} className="w-20 h-2" />
                            <span className="text-xs text-slate-500 w-10">{item.completeness}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Data Freshness</h4>
                    <div className="space-y-3">
                      {[
                        { source: 'Real-time vitals', age: '2 min', status: 'excellent' },
                        { source: 'Lab results', age: '1 hour', status: 'good' },
                        { source: 'Symptom logs', age: '3 hours', status: 'good' },
                        { source: 'Medical records', age: '1 day', status: 'acceptable' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.source}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-500">{item.age}</span>
                            <Badge variant="outline" className={
                              item.status === 'excellent' ? 'border-green-200 text-green-700' :
                              item.status === 'good' ? 'border-blue-200 text-blue-700' :
                              'border-yellow-200 text-yellow-700'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Users className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <strong>Contributing to Research:</strong> Your anonymized Digital Twin data helps improve care for all thalassemia patients. 
                You can opt out anytime in settings.
              </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Research Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span>Research Impact</span>
                  </CardTitle>
                  <CardDescription>
                    How Digital Twins are advancing thalassemia care
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{researchMetrics.totalTwins}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Active Twins</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{researchMetrics.activeSimulations}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Running Simulations</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{researchMetrics.successfulPredictions}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Prediction Accuracy</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{researchMetrics.improvementInCare}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Care Improvement</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Discoveries</h4>
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Optimal transfusion timing reduces complications by 15%</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Personalized chelation schedules improve adherence by 23%</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Early symptom detection prevents 40% of emergency visits</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blood Warriors Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Blood Warriors Network</span>
                  </CardTitle>
                  <CardDescription>
                    Aggregated insights from the global patient network
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Global Patient Insights</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Analysis of {researchMetrics.dataPoints}M data points reveals optimal care patterns across demographics and genotypes.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Network Benefits</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'Personalized treatment recommendations',
                        'Predictive complication alerts',
                        'Donor-patient matching optimization',
                        'Clinical trial participant identification'
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Research Publications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}