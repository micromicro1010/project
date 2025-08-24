import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { LoginScreen } from './LoginScreen';
import { Loader2 } from 'lucide-react';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { isAuthenticated, loading } = useAuth();
  const { dir } = useLanguage();

  // Show loading screen
  if (loading) {
    return (
      <div 
        dir={dir}
        className="min-h-screen flex items-center justify-center bg-background text-foreground"
      >
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-lg font-semibold">تحميل النظام...</p>
            <p className="text-sm text-muted-foreground">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show main app if authenticated
  return <>{children}</>;
}