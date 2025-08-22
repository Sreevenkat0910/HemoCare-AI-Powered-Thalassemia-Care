import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Mic, MicOff, Send, Upload, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SymptomLoggingProps {
  onNavigate: (page: string) => void;
}

export function SymptomLogging({ onNavigate }: SymptomLoggingProps) {
  const [symptomText, setSymptomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [severity, setSeverity] = useState('');
  const [recentSymptoms, setRecentSymptoms] = useState([
    {
      id: 1,
      text: "Feeling very tired after walking short distances",
      severity: "moderate",
      timestamp: "2 hours ago",
      date: "Today"
    },
    {
      id: 2,
      text: "Mild headache and dizziness",
      severity: "mild",
      timestamp: "Yesterday",
      date: "Aug 19"
    },
    {
      id: 3,
      text: "Chest pain during exercise",
      severity: "severe",
      timestamp: "2 days ago",
      date: "Aug 18"
    }
  ]);

  const commonSymptoms = [
    "Fatigue", "Weakness", "Dizziness", "Headache", "Shortness of breath",
    "Chest pain", "Joint pain", "Nausea", "Loss of appetite", "Pale skin"
  ];

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
    if (!isRecording) {
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        setSymptomText("I'm experiencing fatigue and slight dizziness today. It started this morning.");
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleSymptomSubmit = () => {
    if (symptomText.trim() && severity) {
      const newSymptom = {
        id: recentSymptoms.length + 1,
        text: symptomText,
        severity,
        timestamp: "Just now",
        date: "Today"
      };
      setRecentSymptoms([newSymptom, ...recentSymptoms]);
      setSymptomText('');
      setSeverity('');
    }
  };

  const addQuickSymptom = (symptom: string) => {
    setSymptomText(prev => prev ? `${prev}, ${symptom.toLowerCase()}` : symptom);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Log Your Symptoms</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track how you're feeling to help your healthcare team provide better care
          </p>
        </div>

        {/* Main Logging Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Symptom Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <span>Describe Your Symptoms</span>
                </CardTitle>
                <CardDescription>
                  Tell us how you're feeling today. You can type or use voice input.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Recording Alert */}
                {isRecording && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <Mic className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      Recording... Speak clearly about your symptoms.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Text Input */}
                <div className="relative">
                  <Textarea
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    placeholder="Describe your symptoms in detail. For example: 'I'm feeling very tired and have been experiencing shortness of breath when climbing stairs...'"
                    className="min-h-32 pr-16"
                  />
                  <Button
                    size="icon"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={handleVoiceToggle}
                    className="absolute bottom-3 right-3"
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Quick Symptom Tags */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Quick Add Common Symptoms:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                        onClick={() => addQuickSymptom(symptom)}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Severity Selection */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Symptom Severity:
                  </label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Mild - Minor discomfort</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="moderate">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Moderate - Noticeable symptoms</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="severe">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Severe - Significant impact</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Report</span>
                  </Button>
                  <Button 
                    onClick={handleSymptomSubmit}
                    disabled={!symptomText.trim() || !severity}
                    className="flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Log Symptom</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Symptoms */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Recent Logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSymptoms.map((symptom) => (
                  <div key={symptom.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getSeverityColor(symptom.severity)} variant="secondary">
                        {symptom.severity}
                      </Badge>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {symptom.timestamp}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {symptom.text}
                    </p>
                    <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{symptom.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Success Message */}
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 mt-4">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Your symptoms are being tracked. Your healthcare team will be notified of any concerning patterns.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('patient-dashboard')}
            className="px-8"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}