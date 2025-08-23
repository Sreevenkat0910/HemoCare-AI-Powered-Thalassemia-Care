import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Moon, Sun, Type, Languages, Menu, Bot, User, LogOut } from 'lucide-react';
import { Switch } from './ui/switch';

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isLargeFont: boolean;
  onToggleLargeFont: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export function Header({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  isLargeFont,
  onToggleLargeFont,
  language,
  onLanguageChange,
}: HeaderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('Header: User authenticated:', parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleSignOut();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('Header: No user authenticated');
      }
    };

    // Check immediately
    checkAuth();
    console.log('Header: Checking authentication state...');

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically to catch any missed updates
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    onNavigate('home');
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Hemocare</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="text-sm"
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'patient-dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('patient-dashboard')}
              className="text-sm"
            >
              Patient Portal
            </Button>
            <Button
              variant={currentPage === 'digital-twin' ? 'default' : 'ghost'}
              onClick={() => onNavigate('digital-twin')}
              className={`text-sm ${currentPage === 'digital-twin' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}`}
            >
              <Bot className="w-4 h-4 mr-1" />
              Digital Twin
            </Button>
            {isAuthenticated && user && (user.role === 'doctor' || user.role === 'admin') ? (
              // User is logged in as provider - show provider dashboard button
              <Button
                variant={currentPage === 'doctor-dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate('doctor-dashboard')}
                className="text-sm"
              >
                Healthcare Provider
              </Button>
            ) : (
              // User is not logged in or not a provider - show provider login button
              <Button
                variant="ghost"
                onClick={() => onNavigate('provider-login')}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                Healthcare Provider
              </Button>
            )}
            {isAuthenticated && user && user.role === 'admin' && (
              <Button
                variant={currentPage === 'donor-dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate('donor-dashboard')}
                className="text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                Donor Management
              </Button>
            )}
          </nav>
        </div>

        {/* Accessibility and Settings */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="hi">हिं</SelectItem>
                <SelectItem value="bn">বাং</SelectItem>
                <SelectItem value="ta">தமி</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <Switch
              checked={isLargeFont}
              onCheckedChange={onToggleLargeFont}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            {isDarkMode ? (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
            <Switch
              checked={isDarkMode}
              onCheckedChange={onToggleDarkMode}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated && user ? (
              // User is logged in - show user info and sign out
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              // User is not logged in - show login/register buttons
              <>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('login')}
                  className="text-sm"
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  onClick={() => onNavigate('register')}
                  className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && user ? (
              // Mobile user info
              <div className="flex items-center space-x-2 px-2 py-1 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {user.firstName}
                </span>
              </div>
            ) : null}
            
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}