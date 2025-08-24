import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  method: 'password' | 'biometric' | 'face' | 'fingerprint';
  rememberMe?: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo
const DEMO_USERS: User[] = [
  {
    id: 'admin-001',
    name: 'أحمد المدير',
    email: 'admin@company.com',
    role: 'admin',
    department: 'الإدارة',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    permissions: ['*'], // All permissions
    lastLogin: new Date()
  },
  {
    id: 'manager-001',
    name: 'فاطمة المدير',
    email: 'manager@company.com',
    role: 'manager',
    department: 'الموارد البشرية',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    permissions: ['employees.read', 'attendance.read', 'reports.read'],
    lastLogin: new Date()
  },
  {
    id: 'emp-001',
    name: 'محمد الموظف',
    email: 'employee@company.com',
    role: 'employee',
    department: 'تقنية المعلومات',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    permissions: ['attendance.own'],
    lastLogin: new Date()
  }
];

// Default credentials for demo
const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'admin123', userId: 'admin-001' },
  { username: 'manager', password: 'manager123', userId: 'manager-001' },
  { username: 'employee', password: 'emp123', userId: 'emp-001' },
  // Biometric simulation
  { username: 'biometric', password: 'bio123', userId: 'admin-001' },
  { username: 'face', password: 'face123', userId: 'admin-001' },
  { username: 'fingerprint', password: 'finger123', userId: 'admin-001' }
];

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const savedAuth = localStorage.getItem('smart_attendance_auth');
        if (savedAuth) {
          const { user, expiry } = JSON.parse(savedAuth);
          
          // Check if session is expired
          if (new Date().getTime() < expiry) {
            setAuthState({
              isAuthenticated: true,
              user,
              loading: false
            });
            return;
          } else {
            // Remove expired session
            localStorage.removeItem('smart_attendance_auth');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('smart_attendance_auth');
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    };

    checkExistingAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check credentials
      const validCredential = DEMO_CREDENTIALS.find(
        cred => cred.username === credentials.username && cred.password === credentials.password
      );

      if (!validCredential) {
        throw new Error('بيانات الدخول غير صحيحة');
      }

      const user = DEMO_USERS.find(u => u.id === validCredential.userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // Update last login
      user.lastLogin = new Date();

      // Set auth state
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false
      });

      // Save to localStorage if remember me
      if (credentials.rememberMe) {
        const authData = {
          user,
          expiry: new Date().getTime() + (30 * 24 * 60 * 60 * 1000) // 30 days
        };
        localStorage.setItem('smart_attendance_auth', JSON.stringify(authData));
      }

      return true;
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
      throw error;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
    localStorage.removeItem('smart_attendance_auth');
  };

  const refreshAuth = async () => {
    // Simulate refresh
    if (authState.user) {
      setAuthState(prev => ({
        ...prev,
        user: { ...prev.user!, lastLogin: new Date() }
      }));
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Permission checker hook
export function usePermission() {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    user
  };
}