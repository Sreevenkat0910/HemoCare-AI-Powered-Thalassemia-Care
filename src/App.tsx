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
import BloodDonorLogin from './components/BloodDonorLogin';
import { BloodDonorRegister } from './components/BloodDonorRegister';
import BloodDonorDashboard from './components/BloodDonorDashboard';

type Page = 'home' | 'onboarding' | 'symptom-logging' | 'patient-dashboard' | 'doctor-dashboard' | 'ai-predictions' | 'digital-twin' | 'login' | 'register' | 'provider-login' | 'blood-donor-login' | 'blood-donor-register' | 'blood-donor-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [language, setLanguage] = useState('en');
  const [requestedPage, setRequestedPage] = useState<Page | null>(null);

  // Monitor authentication state changes
  useEffect(() => {
    const checkAuth = () => {
      // Check for blood donor authentication first (priority)
      const bloodDonorToken = localStorage.getItem('bloodDonorToken');
      const bloodDonorData = localStorage.getItem('bloodDonorData');
      
      if (bloodDonorToken && bloodDonorData) {
        try {
          const donor = JSON.parse(bloodDonorData);
          // If blood donor is on login page and authenticated, redirect to dashboard
          if (currentPage === 'blood-donor-login') {
            console.log('App: Blood donor authenticated, redirecting to dashboard');
            setCurrentPage('blood-donor-dashboard');
            return; // Exit early to prevent further checks
          }
        } catch (error) {
          console.error('App: Error parsing blood donor data:', error);
        }
      }
      
      // Check for regular user authentication (only if no blood donor auth)
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          // If user is on login page and authenticated, redirect to appropriate portal
          if (currentPage === 'login') {
            if (user.role === 'patient' || user.role === 'Fighter' || user.role === 'Bridge Don' || user.role === 'Emergency') {
              setCurrentPage('patient-dashboard');
            } else if (user.role === 'doctor' || user.role === 'admin') {
              setCurrentPage('doctor-dashboard');
            } else {
              setCurrentPage('patient-dashboard'); // Default fallback
            }
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
      if (e.key === 'authToken' || e.key === 'userData' || e.key === 'bloodDonorToken' || e.key === 'bloodDonorData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically
    const interval = setInterval(checkAuth, 5000); // Increased to 5 seconds to prevent loops

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []); // Removed currentPage dependency to prevent loops

  const handleNavigate = (page: string) => {
    console.log('App: handleNavigate called with page:', page);
    
    // Check if user is trying to access protected pages
    const protectedPages: Page[] = ['patient-dashboard', 'digital-twin', 'doctor-dashboard', 'ai-predictions'];
    
    // Check if user is trying to access blood donor dashboard
    if (page === 'blood-donor-dashboard') {
      const bloodDonorToken = localStorage.getItem('bloodDonorToken');
      const bloodDonorData = localStorage.getItem('bloodDonorData');
      
      if (!bloodDonorToken || !bloodDonorData) {
        // Blood donor is not authenticated, redirect to login
        console.log('App: Blood donor not authenticated, redirecting to login');
        setCurrentPage('blood-donor-login');
        return;
      }
    }
    
    if (protectedPages.includes(page as Page)) {
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        // User is not authenticated, redirect to login
        console.log('App: User not authenticated, redirecting to login');
        setRequestedPage(page as Page);
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
    setCurrentPage(page as Page);
    setRequestedPage(null); // Clear requested page when navigating normally
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
        return <PatientLogin onNavigate={handleNavigate} />;
      case 'register':
        return <PatientRegister onNavigate={handleNavigate} />;
      case 'provider-login':
        return <ProviderLogin onNavigate={handleNavigate} />;
      case 'blood-donor-login':
        return <BloodDonorLogin onNavigate={handleNavigate} />;
      case 'blood-donor-register':
        return <BloodDonorRegister onNavigate={handleNavigate} />;
      case 'blood-donor-dashboard':
        return <BloodDonorDashboard onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}