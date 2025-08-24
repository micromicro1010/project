import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages
export type Language = 'ar' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation strings
const translations = {
  ar: {
    // Auth & Login
    'auth.login': 'تسجيل الدخول',
    'auth.welcome': 'مرحباً بك',
    'auth.username': 'اسم المستخدم',
    'auth.password': 'كلمة المرور',
    'auth.remember': 'تذكرني',
    'auth.forgot_password': 'نسيت كلمة المرور؟',
    'auth.biometric_login': 'تسجيل دخول حيوي',
    'auth.face_recognition': 'التعرف على الوجه',
    'auth.fingerprint': 'البصمة',
    'auth.login_method': 'طريقة تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.login_success': 'تم تسجيل الدخول بنجاح',
    'auth.login_error': 'خطأ في تسجيل الدخول',
    'auth.logout_success': 'تم تسجيل الخروج بنجاح',

    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.attendance': 'سجل الحضور',
    'nav.employees': 'الموظفين',
    'nav.visitors': 'إدارة الزوار',
    'nav.security': 'الأمن والحماية',
    'nav.heatmap': 'الخريطة الحرارية',
    'nav.reports': 'التقارير',
    'nav.alerts': 'التنبيهات',
    'nav.settings': 'الإعدادات',
    'nav.ai_biometric': 'التعرف الحيوي الذكي',
    'nav.ai_analytics': 'التحليلات الذكية',

    // Dashboard
    'dashboard.welcome': 'مرحباً بك في نظام الحضور الذكي',
    'dashboard.total_employees': 'إجمالي الموظفين',
    'dashboard.present_today': 'الحاضرون اليوم',
    'dashboard.attendance_rate': 'معدل الحضور',
    'dashboard.security_alerts': 'التنبيهات الأمنية',
    'dashboard.recent_activity': 'النشاط الحديث',
    'dashboard.system_status': 'حالة النظام',

    // Settings
    'settings.title': 'الإعدادات المتقدمة',
    'settings.appearance': 'إعدادات المظهر',
    'settings.language': 'اللغة',
    'settings.theme': 'نمط الألوان',
    'settings.dark_mode': 'الوضع الداكن',
    'settings.light_mode': 'الوضع الفاتح',
    'settings.security': 'إعدادات الأمان',
    'settings.ai': 'إعدادات الذكاء الاصطناعي',
    'settings.system_info': 'معلومات النظام',

    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.refresh': 'تحديث',

    // Time & Date
    'time.today': 'اليوم',
    'time.yesterday': 'أمس',
    'time.this_week': 'هذا الأسبوع',
    'time.this_month': 'هذا الشهر',
    'time.online': 'متصل',
    'time.offline': 'غير متصل',

    // Status
    'status.active': 'نشط',
    'status.inactive': 'غير نشط',
    'status.processing': 'جاري المعالجة',
    'status.completed': 'مكتمل',
    'status.pending': 'في الانتظار',
    'status.approved': 'موافق عليه',
    'status.rejected': 'مرفوض'
  },
  en: {
    // Auth & Login
    'auth.login': 'Login',
    'auth.welcome': 'Welcome',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.remember': 'Remember me',
    'auth.forgot_password': 'Forgot password?',
    'auth.biometric_login': 'Biometric Login',
    'auth.face_recognition': 'Face Recognition',
    'auth.fingerprint': 'Fingerprint',
    'auth.login_method': 'Login Method',
    'auth.logout': 'Logout',
    'auth.login_success': 'Login successful',
    'auth.login_error': 'Login error',
    'auth.logout_success': 'Logout successful',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.attendance': 'Attendance',
    'nav.employees': 'Employees',
    'nav.visitors': 'Visitors',
    'nav.security': 'Security',
    'nav.heatmap': 'Heat Map',
    'nav.reports': 'Reports',
    'nav.alerts': 'Alerts',
    'nav.settings': 'Settings',
    'nav.ai_biometric': 'AI Biometric',
    'nav.ai_analytics': 'AI Analytics',

    // Dashboard
    'dashboard.welcome': 'Welcome to Smart Attendance System',
    'dashboard.total_employees': 'Total Employees',
    'dashboard.present_today': 'Present Today',
    'dashboard.attendance_rate': 'Attendance Rate',
    'dashboard.security_alerts': 'Security Alerts',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.system_status': 'System Status',

    // Settings
    'settings.title': 'Advanced Settings',
    'settings.appearance': 'Appearance Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.dark_mode': 'Dark Mode',
    'settings.light_mode': 'Light Mode',
    'settings.security': 'Security Settings',
    'settings.ai': 'AI Settings',
    'settings.system_info': 'System Information',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.refresh': 'Refresh',

    // Time & Date
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
    'time.this_week': 'This Week',
    'time.this_month': 'This Month',
    'time.online': 'Online',
    'time.offline': 'Offline',

    // Status
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.processing': 'Processing',
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected'
  }
};

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get saved language from localStorage
    const saved = localStorage.getItem('smart_attendance_language');
    return (saved as Language) || 'ar'; // Default to Arabic
  });

  // Update document attributes and localStorage when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('smart_attendance_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    dir
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={dir}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language options for UI
export const LANGUAGE_OPTIONS = [
  { value: 'ar' as Language, label: 'العربية', flag: '🇸🇦' },
  { value: 'en' as Language, label: 'English', flag: '🇺🇸' }
];