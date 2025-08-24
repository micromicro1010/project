import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  AlertTriangle,
  TrendingUp,
  Clock,
  Building,
  Activity,
  Brain,
  Zap,
  Database,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { apiClient, type DashboardStats, formatDateTime, checkApiConnection, getBackendStatus } from "../lib/api";
import { toast } from "sonner";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<{ available: boolean; mode: 'simulation' | 'connected'; message: string }>({ available: false, mode: 'simulation', message: '' });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // فحص الاتصال وتحميل البيانات
  useEffect(() => {
    loadData();
    
    // تحديث البيانات كل 30 ثانية
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    if (!refreshing) setLoading(true);
    
    try {
      // فحص حالة Backend
      const status = getBackendStatus();
      setBackendStatus(status);
      
      // محاولة تحميل البيانات
      const response = await apiClient.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
        setLastUpdate(new Date());
        
        if (status.mode === 'connected') {
          if (!refreshing) toast.success("تم تحديث البيانات من قاعدة البيانات");
        } else {
          if (!refreshing) toast.info("يتم عرض البيانات التجريبية - Python Backend غير متصل");
        }
      } else {
        if (!refreshing) toast.error(response.error || "خطأ في تحميل البيانات");
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      if (!refreshing) toast.error("خطأ في الاتصال مع النظام");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  // بيانات تجريبية للرسوم البيانية
  const chartData = [
    { name: "السبت", حضور: 87, زوار: 12 },
    { name: "الأحد", حضور: 92, زوار: 8 },
    { name: "الاثنين", حضور: 89, زوار: 15 },
    { name: "الثلاثاء", حضور: 94, زوار: 10 },
    { name: "الأربعاء", حضور: 86, زوار: 18 },
    { name: "الخميس", حضور: 90, زوار: 14 },
    { name: "الجمعة", حضور: 78, زوار: 6 },
  ];

  const departmentData = [
    { name: "تقنية المعلومات", value: 35, color: "#8884d8" },
    { name: "الموارد البشرية", value: 20, color: "#82ca9d" },
    { name: "المالية", value: 25, color: "#ffc658" },
    { name: "التسويق", value: 20, color: "#ff7300" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p>جاري تحميل البيانات...</p>
          <p className="text-sm text-muted-foreground mt-2">
            {backendStatus.mode === 'connected' ? 'من قاعدة البيانات المحلية' : 'البيانات التجريبية'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-6 space-y-6 w-full max-w-none">
        {/* رأس الصفحة مع حالة النظام */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              تحديث البيانات
            </Button>
            
            {/* حالة Backend */}
            <div className="flex items-center gap-2">
              <Badge 
                variant={backendStatus.available ? "default" : "secondary"} 
                className="gap-1"
              >
                {backendStatus.available ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {backendStatus.available ? "Python Backend متصل" : "وضع المحاكاة"}
              </Badge>
              
              <Badge variant="outline" className="gap-1">
                <Database className="h-3 w-3" />
                {backendStatus.available ? "SQLite متصل" : "بيانات تجريبية"}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <h1 className="text-2xl font-semibold flex items-center justify-end gap-2 mb-2">
              <Brain className="h-8 w-8 text-blue-600" />
              لوحة التحكم الذكية
            </h1>
            <p className="text-muted-foreground">
              آخر تحديث: {formatDateTime(lastUpdate.toISOString())}
            </p>
            <p className="text-xs text-muted-foreground">
              {backendStatus.message}
            </p>
          </div>
        </div>

        {/* تنبيه حالة النظام */}
        {!backendStatus.available && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div className="flex-1 text-right">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">
                    وضع المحاكاة نشط
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Python Backend غير متصل. يتم عرض البيانات التجريبية. 
                    لتفعيل الميزات الكاملة، يرجى تشغيل:
                  </p>
                  <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900 rounded text-xs font-mono">
                    تشغيل_النظام_الكامل.bat
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* بطاقات الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    الموظفين الحاضرين اليوم
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.present_today || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    من أصل {stats?.total_employees || 0} موظف
                  </p>
                </div>
                <UserCheck className="h-12 w-12 text-green-600" />
              </div>
              {!backendStatus.available && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  بيانات تجريبية
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    الزوار اليوم
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats?.visitors_today || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    زائر مسجل
                  </p>
                </div>
                <UserPlus className="h-12 w-12 text-blue-600" />
              </div>
              {!backendStatus.available && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  بيانات تجريبية
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    معدل الحضور
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.attendance_rate || 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    هذا الأسبوع
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600" />
              </div>
              {!backendStatus.available && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  بيانات تجريبية
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    التنبيهات الأمنية
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats?.security_alerts || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    غير محلولة
                  </p>
                </div>
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              {!backendStatus.available && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  بيانات تجريبية
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-right flex items-center justify-between">
                <span>إحصائيات الحضور الأسبوعية</span>
                {!backendStatus.available && (
                  <Badge variant="outline" className="text-xs">
                    بيانات تجريبية
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="حضور" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="زوار" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-right flex items-center justify-between">
                <span>توزيع الموظفين حسب الأقسام</span>
                {!backendStatus.available && (
                  <Badge variant="outline" className="text-xs">
                    بيانات تجريبية
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* الأنشطة الحديثة وحالة النظام */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-right flex items-center justify-end gap-2">
                <Clock className="h-5 w-5" />
                الأنشطة الحديثة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recent_activities?.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant={activity.entry_type === 'check_in' ? 'default' : 'secondary'}>
                        {activity.entry_type === 'check_in' ? 'دخول' : 'خروج'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(activity.timestamp)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{activity.employee_name || activity.employee_id}</p>
                      <p className="text-sm text-muted-foreground">
                        دقة: {((activity.confidence_score || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أنشطة حديثة</p>
                    {!backendStatus.available && (
                      <p className="text-xs text-amber-600 mt-2">
                        تشغيل Python Backend لعرض البيانات الحقيقية
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-right flex items-center justify-end gap-2">
                <Database className="h-5 w-5" />
                حالة النظام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={backendStatus.available ? "default" : "secondary"}>
                    {backendStatus.available ? "متصل" : "وضع محاكاة"}
                  </Badge>
                  <span className="font-medium">Python Backend</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={backendStatus.available ? "default" : "secondary"}>
                    {backendStatus.available ? "متصل" : "محاكاة"}
                  </Badge>
                  <span className="font-medium">قاعدة البيانات SQLite</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">جاهز</Badge>
                  <span className="font-medium">محرك الذكاء الاصطناعي</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">جاهز</Badge>
                  <span className="font-medium">نظام التعرف الحيوي</span>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>99.2%</span>
                    <span>أداء النظام</span>
                  </div>
                  <Progress value={99.2} className="h-2" />
                </div>

                {!backendStatus.available && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 text-right">
                      💡 لتفعيل جميع الميزات، قم بتشغيل Python Backend
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* أزرار التنقل السريع */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2"
            onClick={() => onNavigate("attendance")}
          >
            <UserCheck className="h-6 w-6" />
            <span>تسجيل الحضور</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2"
            onClick={() => onNavigate("visitors")}
          >
            <UserPlus className="h-6 w-6" />
            <span>إدارة الزوار</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2"
            onClick={() => onNavigate("ai-analytics")}
          >
            <Brain className="h-6 w-6" />
            <span>التحليلات الذكية</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2"
            onClick={() => onNavigate("security")}
          >
            <Shield className="h-6 w-6" />
            <span>مركز الأمان</span>
          </Button>
        </div>

        {/* رسالة إرشادية للمستخدمين الجدد */}
        {!backendStatus.available && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="text-right">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🚀 مرحباً بك في نظام الحضور الذكي
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  أنت الآن تستخدم وضع المحاكاة مع بيانات تجريبية. للحصول على التجربة الكاملة مع:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 mb-4">
                  <li>• قاعدة بيانات SQLite حقيقية</li>
                  <li>• محرك الذكاء الاصطناعي للتعرف الحيوي</li>
                  <li>• تحليل الأنماط والسلوكيات</li>
                  <li>• كشف الحالات الشاذة</li>
                </ul>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm">
                    دليل التشغيل
                  </Button>
                  <Button size="sm">
                    تشغيل Python Backend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
