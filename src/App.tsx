import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { PatientOnboarding } from './components/PatientOnboarding';
import { SymptomLogging } from './components/SymptomLogging';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AIPredictions } from './components/AIPredictions';
import { DigitalTwin } from './components/DigitalTwin';
import PatientLogin from './components/PatientLogin';
import PatientRegister from './components/PatientRegister';
import ProviderLogin from './components/ProviderLogin';

type Page = 'home' | 'onboarding' | 'symptom-logging' | 'patient-dashboard' | 'doctor-dashboard' | 'ai-predictions' | 'digital-twin' | 'login' | 'register' | 'provider-login';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [language, setLanguage] = useState('en');
  const [requestedPage, setRequestedPage] = useState<Page | null>(null);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply large font class to document
  useEffect(() => {
    if (isLargeFont) {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '14px';
    }
  }, [isLargeFont]);

  // Monitor authentication state changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          console.log('App: User authenticated, current page:', currentPage);
          
          // If user is on login page and authenticated, redirect to patient portal
          if (currentPage === 'login' && user.role === 'patient') {
            console.log('App: Redirecting authenticated patient to portal');
            setCurrentPage('patient-dashboard');
          }
        } catch (error) {
          console.error('App: Error parsing user data:', error);
        }
      }
    };

    // Check immediately
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    console.log('App: handleNavigate called with page:', page);
    
    // Check if user is trying to access protected pages
    const protectedPages: Page[] = ['patient-dashboard', 'digital-twin', 'doctor-dashboard', 'ai-predictions'];
    
    if (protectedPages.includes(page)) {
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        // User is not authenticated, redirect to login
        console.log('App: User not authenticated, redirecting to login');
        setRequestedPage(page);
        setCurrentPage('login');
        return;
      }
      
      // Check role-based access for provider pages
      if (page === 'doctor-dashboard') {
        try {
          const user = JSON.parse(userData);
          if (user.role !== 'doctor' && user.role !== 'admin') {
            // User doesn't have access to provider pages
            console.log('App: User role not authorized for provider pages');
            setCurrentPage('home');
            return;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          setCurrentPage('home');
          return;
        }
      }
    }
    
    console.log('App: Setting current page to:', page);
    setCurrentPage(page);
    setRequestedPage(null); // Clear requested page when navigating normally
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleLargeFont = () => {
    setIsLargeFont(!isLargeFont);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'onboarding':
        return <PatientOnboarding onNavigate={handleNavigate} />;
      case 'symptom-logging':
        return <SymptomLogging onNavigate={handleNavigate} />;
      case 'patient-dashboard':
        return <PatientDashboard onNavigate={handleNavigate} />;
      case 'doctor-dashboard':
        return <DoctorDashboard onNavigate={handleNavigate} />;
      case 'ai-predictions':
        return <AIPredictions onNavigate={handleNavigate} />;
      case 'digital-twin':
        return <DigitalTwin onNavigate={handleNavigate} />;
      case 'login':
        return <PatientLogin onNavigate={handleNavigate} requestedPage={requestedPage} currentPage={currentPage} />;
      case 'register':
        return <PatientRegister onNavigate={handleNavigate} />;
      case 'provider-login':
        return <ProviderLogin onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isLargeFont={isLargeFont}
        onToggleLargeFont={handleToggleLargeFont}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <main>
        {renderPage()}
      </main>
    </div>
  );
}