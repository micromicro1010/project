import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  Progress,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator
} from "./components/ui";
import {
  Users,
  UserCheck,
  Clock,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Camera,
  Fingerprint,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Building,
  Phone,
  Mail,
  Star,
  Award,
  Target,
  Zap,
  Database,
  Server,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  ChevronDown,
  Brain,
  Cpu,
  AlertCircle
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Import contexts
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { LanguageProvider, useLanguage } from "./lib/LanguageContext";

// Import components
import { AppWrapper } from './components/AppWrapper';
import { LoginScreen } from "./components/LoginScreen";
import { EmployeeManagement } from "./components/EmployeeManagement";
import { apiClient, type DashboardStats, getBackendStatus } from "./lib/api";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./components/Dashboard";
import { AttendanceSystem } from "./components/AttendanceSystem";
import { VisitorManagement } from "./components/VisitorManagement";
import { HeatMap } from "./components/HeatMap";
import { ReportsAnalytics } from "./components/ReportsAnalytics";
import { AIBiometric } from "./components/AIBiometric";
import { AIAnalytics } from "./components/AIAnalytics";

type ViewType =
  | "dashboard"
  | "attendance"
  | "visitors"
  | "security"
  | "heatmap"
  | "reports"
  | "alerts"
  | "settings"
  | "ai-biometric"
  | "ai-analytics"
  | "employees";

const mockNotifications = [
  {
    id: 1,
    title: "🧠 نظام الذكاء الاصطناعي - تحديث",
    message: "تم تحسين دقة التعرف إلى 99.2%",
    type: "success",
    time: "2 دقائق مضت",
    read: false,
  },
  {
    id: 2,
    title: "⚠️ نمط شاذ مكتشف",
    message: "محاولة دخول مشبوهة في المدخل الخلفي",
    type: "warning",
    time: "5 دقائق مضت",
    read: false,
  },
  {
    id: 3,
    title: "✅ تسجيل حضور ناجح",
    message: "تم التعرف على أحمد محمد بنجاح (98.7%)",
    type: "success",
    time: "8 دقائق مضت",
    read: false,
  },
  {
    id: 4,
    title: "📊 تقرير التحليلات اليومي",
    message: "متاح الآن - معدل الحضور 87.3%",
    type: "info",
    time: "15 دقيقة مضت",
    read: true,
  },
];

const systemStatus = {
  ai_engine: { status: 'online', performance: 99.2, load: 23 },
  database: { status: 'online', performance: 98.1, load: 45 },
  recognition: { status: 'online', performance: 99.1, load: 31 },
  security: { status: 'online', performance: 97.8, load: 18 }
};

function MainApp() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [aiSystemStatus, setAiSystemStatus] = useState('online');
  const [backendStatus, setBackendStatus] = useState<{ available: boolean; mode: "simulation" | "connected"; message: string }>({ available: false, mode: "simulation", message: "" });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // مراقبة حالة Backend
  useEffect(() => {
    const checkBackend = () => {
      const status = getBackendStatus();
      setBackendStatus(status);
    };

    checkBackend();
    const interval = setInterval(checkBackend, 10000); // كل 10 ثوان

    return () => clearInterval(interval);
  }, []);

  // محاكاة حالة نظام الذكاء الاصطناعي
  useEffect(() => {
    const statusTimer = setInterval(() => {
      const statuses = ['online', 'processing', 'maintenance'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setAiSystemStatus(randomStatus);
    }, 30000); // تحديث كل 30 ثانية

    return () => clearInterval(statusTimer);
  }, []);

  const getViewTitle = (view: ViewType): string => {
    const titles = {
      dashboard: t('nav.dashboard'),
      attendance: t('nav.attendance'),
      visitors: t('nav.visitors'),
      security: t('nav.security'),
      heatmap: t('nav.heatmap'),
      reports: t('nav.reports'),
      alerts: t('nav.alerts'),
      settings: t('nav.settings'),
      'ai-biometric': t('nav.ai_biometric'),
      'ai-analytics': t('nav.ai_analytics'),
      employees: t('nav.employees')
    };
    return titles[view] || t('nav.dashboard');
  };

  // وظيفة التنقل بين الصفحات
  const handleViewChange = (view: string) => {
    setCurrentView(view as ViewType);
    toast.success(`تم الانتقال إلى ${getViewTitle(view as ViewType)}`);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={handleViewChange} />;
      case "attendance":
        return <AttendanceSystem />;
      case "visitors":
        return <VisitorManagement />;
      case "security":
        return <SecurityCenter />;
      case "heatmap":
        return <HeatMap />;
      case "reports":
        return <ReportsAnalytics />;
      case "alerts":
        return <AlertsCenter />;
      case "settings":
        return <SettingsPanel />;
      case "ai-biometric":
        return <AIBiometric />;
      case "ai-analytics":
        return <AIAnalytics />;
      case "employees":
        return <EmployeeManagement />;
      default:
        return <Dashboard onNavigate={handleViewChange} />;
    }
  };

  const unreadNotifications = notifications.filter(
    (n) => !n.read,
  ).length;

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const SecurityCenter = () => (
    <div className="w-full">
      <div className="p-6 space-y-6 w-full max-w-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleViewChange('alerts')}
            >
              <Bell className="h-4 w-4" />
              مركز التنبيهات
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleViewChange('ai-analytics')}
            >
              <Brain className="h-4 w-4" />
              التحليلات المتقدمة
            </Button>
          </div>
          
          <div className="text-right">
            <h1 className="text-2xl font-semibold flex items-center justify-end gap-2 mb-2">
              <Shield className="h-8 w-8 text-green-600" />
              مركز الأمن والحماية المتقدم
            </h1>
            <p className="text-muted-foreground">
              مراقبة وإدارة الأمان في الزمن الحقيقي مع الذكاء الاصطناعي
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-green-600 mb-2">
                نظام الأمان
              </h3>
              <Badge className="bg-green-100 text-green-800 mb-2">
                {systemStatus.security.status === 'online' ? 'متصل' : 'غير متصل'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                الأداء: {systemStatus.security.performance}%
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-purple-600 mb-2">
                محرك الذكاء الاصطناعي
              </h3>
              <Badge className="bg-purple-100 text-purple-800 mb-2">
                {systemStatus.ai_engine.status === 'online' ? 'نشط' : 'غير نشط'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                الأداء: {systemStatus.ai_engine.performance}%
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold text-blue-600 mb-2">
                قاعدة البيانات
              </h3>
              <Badge className="bg-blue-100 text-blue-800 mb-2">
                {systemStatus.database.status === 'online' ? 'متصل' : 'غير متصل'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                الأداء: {systemStatus.database.performance}%
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <Cpu className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold text-orange-600 mb-2">
                نظام التعرف
              </h3>
              <Badge className="bg-orange-100 text-orange-800 mb-2">
                {systemStatus.recognition.status === 'online' ? 'نشط' : 'غير نشط'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                الأداء: {systemStatus.recognition.performance}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-right flex items-center justify-end gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                حالة الأنظمة الفرعية
              </h3>
              <div className="space-y-4">
                {Object.entries(systemStatus).map(([system, data]) => (
                  <div key={system} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant={data.status === 'online' ? 'default' : 'destructive'}>
                        {data.status === 'online' ? 'متصل' : 'غير متصل'}
                      </Badge>
                      <span className="text-sm">الحمولة: {data.load}%</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {system === 'ai_engine' ? 'محرك الذكاء الاصطناعي' :
                         system === 'database' ? 'قاعدة البيانات' :
                         system === 'recognition' ? 'نظام التعرف' : 'الأمان'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        أداء: {data.performance}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-right flex items-center justify-end gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                التنبيهات الأمنية الحديثة
              </h3>
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
                  onClick={() => handleViewChange('alerts')}
                >
                  <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>
                  <div className="text-right flex-1 mr-3">
                    <p className="font-medium">كثافة عالية في المدخل الرئيسي</p>
                    <p className="text-sm text-muted-foreground">5 دقائق مضت</p>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleViewChange('alerts')}
                >
                  <Badge className="bg-green-100 text-green-800">منخفض</Badge>
                  <div className="text-right flex-1 mr-3">
                    <p className="font-medium">تم حل مشكلة الكاميرا #3</p>
                    <p className="text-sm text-muted-foreground">10 دقائق مضت</p>
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleViewChange('alerts')}
                >
                  <Badge className="bg-blue-100 text-blue-800">معلومات</Badge>
                  <div className="text-right flex-1 mr-3">
                    <p className="font-medium">تحديث نظام الذكاء الاصطناعي مكتمل</p>
                    <p className="text-sm text-muted-foreground">15 دقيقة مضت</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const AlertsCenter = () => (
    <div className="w-full">
      <div className="p-6 space-y-6 w-full max-w-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleViewChange('security')}
            >
              <Shield className="h-4 w-4" />
              مركز الأمان
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleViewChange('dashboard')}
            >
              <Activity className="h-4 w-4" />
              لوحة التحكم
            </Button>
          </div>
          
          <div className="text-right">
            <h1 className="text-2xl font-semibold flex items-center justify-end gap-2 mb-2">
              <Bell className="h-8 w-8 text-blue-600" />
              مركز التنبيهات الذكي
            </h1>
            <p className="text-muted-foreground">
              إدارة ومتابعة جميع التنبيهات مع التحليل الذكي للأولويات
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
          <Card className="w-full">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-sm text-muted-foreground">تنبيهات حرجة</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">7</p>
              <p className="text-sm text-muted-foreground">تنبيهات متوسطة</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-muted-foreground">إشعارات عامة</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">89</p>
              <p className="text-sm text-muted-foreground">تم حلها اليوم</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 w-full">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md w-full ${
                !notification.read
                  ? "border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/30"
                  : ""
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {notification.time}
                    </span>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">
                        جديد
                      </Badge>
                    )}
                    <Badge
                      variant={
                        notification.type === 'success' ? 'default' :
                        notification.type === 'warning' ? 'destructive' :
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {notification.type === 'success' ? 'نجح' :
                       notification.type === 'warning' ? 'تحذير' :
                       notification.type === 'error' ? 'خطأ' : 'معلومات'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsPanel = () => (
    <div className="w-full">
      <div className="p-6 space-y-6 w-full max-w-none">
        <div className="text-right">
          <h1 className="text-2xl font-semibold flex items-center justify-end gap-2 mb-2">
            <Settings className="h-8 w-8 text-gray-600" />
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">
            تخصيص النظام وإعدادات الأمان والذكاء الاصطناعي واللغة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* User Profile Card */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-right flex items-center justify-end gap-2">
                <User className="h-5 w-5" />
                معلومات المستخدم
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user?.name?.substring(0, 2) || 'NN'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{user?.department}</Badge>
                  <label className="text-sm font-medium">القسم:</label>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {user?.role === 'admin' ? 'مدير عام' : 
                     user?.role === 'manager' ? 'مدير قسم' : 'موظف'}
                  </Badge>
                  <label className="text-sm font-medium">الصلاحية:</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language & Appearance Settings */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-right flex items-center justify-end gap-2">
                <Sun className="h-5 w-5" />
                {t('settings.appearance')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="text-sm font-medium">
                    {t('settings.language')}:
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="gap-2"
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    {isDarkMode ? t('settings.light_mode') : t('settings.dark_mode')}
                  </Button>
                  <label className="text-sm font-medium">
                    {t('settings.theme')}:
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-right flex items-center justify-end gap-2">
                <Shield className="h-5 w-5" />
                {t('settings.security')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
                  <label className="text-sm font-medium">التحقق الثنائي:</label>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
                  <label className="text-sm font-medium">التشفير الشامل:</label>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">نشط</Badge>
                  <label className="text-sm font-medium">مراقبة الأنشطة:</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-right flex items-center justify-end gap-2">
                <Brain className="h-5 w-5" />
                {t('settings.ai')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-100 text-purple-800">99.2%</Badge>
                  <label className="text-sm font-medium">دقة التعرف:</label>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800">مُفعل</Badge>
                  <label className="text-sm font-medium">كشف الأنماط الشاذة:</label>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">نشط</Badge>
                  <label className="text-sm font-medium">التعلم التكيفي:</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="w-full">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-right">الإجراءات</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => toast.success('تم تصدير النسخة الاحتياطية')}
                >
                  <Download className="h-4 w-4" />
                  تصدير النسخة الاحتياطية
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => toast.success('تم مسح الكاش')}
                >
                  <RefreshCw className="h-4 w-4" />
                  مسح الكاش
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full gap-2"
                  onClick={() => {
                    logout();
                    toast.success(t('auth.logout_success'));
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {t('auth.logout')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-right">{t('settings.system_info')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
              <div>
                <p className="text-sm text-muted-foreground">إصدار النظام:</p>
                <p className="font-medium">v2.0.0 Advanced</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاريخ البناء:</p>
                <p className="font-medium">{new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">وضع التشغيل:</p>
                <p className="font-medium">إنتاج متقدم</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">محرك الذكاء الاصطناعي:</p>
                <p className="font-medium">TensorFlow 2.15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getAiStatusBadge = () => {
    switch (aiSystemStatus) {
      case 'online':
        return (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <Brain className="h-3 w-3" />
            الذكاء الاصطناعي نشط
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 gap-1">
            <Activity className="h-3 w-3 animate-pulse" />
            جاري المعالجة
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
            <Settings className="h-3 w-3" />
            صيانة
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <Brain className="h-3 w-3" />
            غير معروف
          </Badge>
        );
    }
  };

  const getBackendStatusBadge = () => {
    return (
      <Badge 
        variant={backendStatus.available ? "default" : "secondary"} 
        className="gap-1"
      >
        {backendStatus.available ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <AlertCircle className="h-3 w-3" />
        )}
        {backendStatus.available ? "Backend متصل" : "وضع محاكاة"}
      </Badge>
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-background text-foreground"
    >
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-full w-full">
          <SidebarInset>
            <AppSidebar currentView={currentView} onViewChange={handleViewChange} />
          </SidebarInset>
          <main className="flex-1">
            <header>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>الرئيسية</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <section>{renderCurrentView()}</section>
          </main>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppWrapper>
          <MainApp />
        </AppWrapper>
      </LanguageProvider>
    </AuthProvider>
  );
}