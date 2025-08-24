import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Eye,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Radar as RadarIcon,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnomalyData {
  id: string;
  type: 'suspicious_timing' | 'unusual_access' | 'failed_recognition' | 'security_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  location: string;
  confidence: number;
}

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  accuracy: number;
  trend: 'up' | 'down' | 'stable';
}

export function AIAnalytics() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);

  // بيانات وهمية للتحليلات المتقدمة
  const attendanceTrends = [
    { time: '08:00', current: 45, predicted: 48, anomaly: false },
    { time: '09:00', current: 89, predicted: 85, anomaly: false },
    { time: '10:00', current: 156, predicted: 160, anomaly: false },
    { time: '11:00', current: 187, predicted: 185, anomaly: false },
    { time: '12:00', current: 203, predicted: 200, anomaly: false },
    { time: '13:00', current: 167, predicted: 170, anomaly: false },
    { time: '14:00', current: 145, predicted: 150, anomaly: false },
    { time: '15:00', current: 123, predicted: 125, anomaly: false },
    { time: '16:00', current: 98, predicted: 95, anomaly: false },
    { time: '17:00', current: 67, predicted: 70, anomaly: true }
  ];

  const securityMetrics = [
    { name: 'نجح التحقق', value: 94.2, color: '#10b981' },
    { name: 'فشل التحقق', value: 3.8, color: '#ef4444' },
    { name: 'محاولات مشبوهة', value: 1.2, color: '#f59e0b' },
    { name: 'انتهاكات أمنية', value: 0.8, color: '#dc2626' }
  ];

  const behaviorAnalysis = [
    { subject: 'نمط الحضور', A: 120, B: 110, fullMark: 150 },
    { subject: 'أوقات الوصول', A: 98, B: 130, fullMark: 150 },
    { subject: 'مدة البقاء', A: 86, B: 100, fullMark: 150 },
    { subject: 'تكرار الزيارات', A: 99, B: 85, fullMark: 150 },
    { subject: 'المناطق المتكررة', A: 85, B: 90, fullMark: 150 },
    { subject: 'التفاعل الاجتماعي', A: 65, B: 85, fullMark: 150 }
  ];

  const anomaliesData: AnomalyData[] = [
    {
      id: '1',
      type: 'suspicious_timing',
      severity: 'medium',
      description: 'محاولة دخول في وقت غير معتاد (3:30 ص)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'المدخل الرئيسي',
      confidence: 87.3
    },
    {
      id: '2',
      type: 'failed_recognition',
      severity: 'high',
      description: 'فشل متكرر في التعرف على الوجه (5 محاولات)',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      location: 'مدخل المختبر',
      confidence: 95.1
    },
    {
      id: '3',
      type: 'unusual_access',
      severity: 'critical',
      description: 'محاولة الوصول لمنطقة محظورة',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      location: 'غرفة الخوادم',
      confidence: 99.2
    }
  ];

  const predictionsData: PredictionData[] = [
    {
      metric: 'معدل الحضور',
      current: 87.3,
      predicted: 89.1,
      accuracy: 94.2,
      trend: 'up'
    },
    {
      metric: 'أوقات الذروة',
      current: 156,
      predicted: 162,
      accuracy: 91.8,
      trend: 'up'
    },
    {
      metric: 'الانتهاكات الأمنية',
      current: 3,
      predicted: 2,
      accuracy: 88.5,
      trend: 'down'
    },
    {
      metric: 'كفاءة النظام',
      current: 98.1,
      predicted: 98.3,
      accuracy: 96.7,
      trend: 'stable'
    }
  ];

  useEffect(() => {
    setAnomalies(anomaliesData);
    setPredictions(predictionsData);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    
    // محاكاة تحديث البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getSeverityColor = (severity: AnomalyData['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: AnomalyData['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Eye className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: PredictionData['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* العنوان والتحكم */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            onClick={refreshData} 
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            إعدادات
          </Button>
        </div>
        
        <div className="text-right">
          <h1 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Brain className="h-8 w-8 text-purple-600" />
            التحليلات الذكية المتقدمة
          </h1>
          <p className="text-muted-foreground">
            آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
          </p>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">98.7%</p>
            <p className="text-sm text-muted-foreground">دقة النظام</p>
            <Badge className="mt-2 bg-green-100 text-green-800">ممتاز</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">2.1s</p>
            <p className="text-sm text-muted-foreground">متوسط وقت الاستجابة</p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">سريع</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">3</p>
            <p className="text-sm text-muted-foreground">الأنماط الشاذة المكتشفة</p>
            <Badge className="mt-2 bg-purple-100 text-purple-800">نشط</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">1,247</p>
            <p className="text-sm text-muted-foreground">عمليات اليوم</p>
            <Badge className="mt-2 bg-orange-100 text-orange-800">عالي</Badge>
          </CardContent>
        </Card>
      </div>

      {/* علامات التبويب الرئيسية */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            الأنماط الشاذة
          </TabsTrigger>
          <TabsTrigger value="predictions" className="gap-2">
            <Brain className="h-4 w-4" />
            التنبؤات
          </TabsTrigger>
          <TabsTrigger value="behavior" className="gap-2">
            <RadarIcon className="h-4 w-4" />
            تحليل السلوك
          </TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">اتجاهات الحضور المباشرة</CardTitle>
                <CardDescription className="text-right">
                  مقارنة البيانات الحالية مع التوقعات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={attendanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => `الوقت: ${value}`}
                      formatter={(value, name) => [
                        value, 
                        name === 'current' ? 'الحالي' : 'المتوقع'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="current" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">مقاييس الأمان</CardTitle>
                <CardDescription className="text-right">
                  توزيع نتائج عمليات التحقق
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={securityMetrics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {securityMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* الأنماط الشاذة */}
        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                الأنماط الشاذة المكتشفة
              </CardTitle>
              <CardDescription className="text-right">
                الأنشطة غير العادية التي تم اكتشافها بواسطة الذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <Alert key={anomaly.id} className={getSeverityColor(anomaly.severity)}>
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(anomaly.severity)}
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {anomaly.confidence.toFixed(1)}% ثقة
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {anomaly.timestamp.toLocaleTimeString('ar-SA')}
                            </span>
                          </div>
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity === 'critical' ? 'حرج' :
                             anomaly.severity === 'high' ? 'عالي' :
                             anomaly.severity === 'medium' ? 'متوسط' : 'منخفض'}
                          </Badge>
                        </div>
                        <AlertDescription>
                          <p className="font-medium mb-1">{anomaly.description}</p>
                          <p className="text-sm text-muted-foreground">
                            الموقع: {anomaly.location}
                          </p>
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التنبؤات */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                تنبؤات الذكاء الاصطناعي
              </CardTitle>
              <CardDescription className="text-right">
                توقعات النظام للفترة القادمة بناءً على التحليل الذكي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((prediction, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(prediction.trend)}
                          <Badge variant="outline">
                            دقة {prediction.accuracy}%
                          </Badge>
                        </div>
                        <h4 className="font-medium text-right">{prediction.metric}</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {prediction.current}
                          </p>
                          <p className="text-sm text-muted-foreground">الحالي</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            {prediction.predicted}
                          </p>
                          <p className="text-sm text-muted-foreground">المتوقع</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">{prediction.accuracy}%</span>
                          <span className="text-sm text-right">دقة التنبؤ</span>
                        </div>
                        <Progress value={prediction.accuracy} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحليل السلوك */}
        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">تحليل أنماط السلوك</CardTitle>
              <CardDescription className="text-right">
                تحليل متعدد الأبعاد لسلوكيات المستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={behaviorAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar
                    name="النمط الحالي"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="النمط المتوقع"
                    dataKey="B"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}