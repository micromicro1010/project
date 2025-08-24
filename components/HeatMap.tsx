import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  MapPin, 
  Clock, 
  BarChart3,
  RefreshCw,
  Zap,
  AlertCircle,
  Thermometer
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface HeatPoint {
  x: number;
  y: number;
  intensity: number;
  area: string;
  count: number;
}

interface AreaStats {
  name: string;
  currentCount: number;
  maxCapacity: number;
  peakTime: string;
  averageStay: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const mockHeatData: HeatPoint[] = [
  // المداخل
  { x: 15, y: 85, intensity: 95, area: 'المدخل الرئيسي', count: 42 },
  { x: 85, y: 15, area: 'المدخل الخلفي', count: 18, intensity: 75 },
  
  // المكاتب
  { x: 25, y: 30, intensity: 80, area: 'قسم تقنية المعلومات', count: 28 },
  { x: 70, y: 35, intensity: 65, area: 'قسم المالية', count: 15 },
  { x: 25, y: 65, intensity: 85, area: 'قسم الموارد البشرية', count: 22 },
  { x: 70, y: 65, intensity: 70, area: 'قسم التسويق', count: 18 },
  
  // المناطق العامة
  { x: 50, y: 50, intensity: 90, area: 'الاستقبال', count: 35 },
  { x: 45, y: 15, intensity: 60, area: 'غرفة الاجتماعات الكبرى', count: 12 },
  { x: 15, y: 50, intensity: 40, area: 'المطبخ', count: 8 },
  { x: 85, y: 50, intensity: 30, area: 'منطقة الاستراحة', count: 6 },
  
  // الممرات
  { x: 50, y: 85, intensity: 55, area: 'الممر الرئيسي', count: 25 },
  { x: 15, y: 30, intensity: 45, area: 'ممر القطاع الشمالي', count: 14 },
  { x: 85, y: 70, intensity: 50, area: 'ممر القطاع الجنوبي', count: 16 },
];

const areaStats: AreaStats[] = [
  {
    name: 'المدخل الرئيسي',
    currentCount: 42,
    maxCapacity: 50,
    peakTime: '08:30',
    averageStay: '2 دقيقة',
    riskLevel: 'high'
  },
  {
    name: 'قسم تقنية المعلومات',
    currentCount: 28,
    maxCapacity: 35,
    peakTime: '10:00',
    averageStay: '6 ساعات',
    riskLevel: 'high'
  },
  {
    name: 'الاستقبال',
    currentCount: 35,
    maxCapacity: 40,
    peakTime: '09:15',
    averageStay: '15 دقيقة',
    riskLevel: 'high'
  },
  {
    name: 'قسم الموارد البشرية',
    currentCount: 22,
    maxCapacity: 30,
    peakTime: '11:30',
    averageStay: '5.5 ساعات',
    riskLevel: 'medium'
  },
  {
    name: 'قسم التسويق',
    currentCount: 18,
    maxCapacity: 25,
    peakTime: '14:00',
    averageStay: '5 ساعات',
    riskLevel: 'medium'
  },
  {
    name: 'قسم المالية',
    currentCount: 15,
    maxCapacity: 20,
    peakTime: '09:45',
    averageStay: '6 ساعات',
    riskLevel: 'medium'
  }
];

export function HeatMap() {
  const [timeRange, setTimeRange] = useState('realtime');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // محاكاة التحديث التلقائي كل 30 ثانية
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setIsUpdating(false);
        setLastUpdate(new Date());
      }, 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getIntensityColor = (intensity: number): string => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    if (intensity >= 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getIntensityOpacity = (intensity: number): number => {
    return Math.max(0.3, intensity / 100);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  const totalPeople = mockHeatData.reduce((sum, point) => sum + point.count, 0);
  const highTrafficAreas = mockHeatData.filter(point => point.intensity >= 80).length;
  const averageIntensity = Math.round(mockHeatData.reduce((sum, point) => sum + point.intensity, 0) / mockHeatData.length);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsUpdating(true)}
            disabled={isUpdating}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">الزمن الحقيقي</SelectItem>
              <SelectItem value="hour">آخر ساعة</SelectItem>
              <SelectItem value="day">اليوم</SelectItem>
              <SelectItem value="week">الأسبوع</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
          </Badge>
        </div>

        <div className="text-right">
          <h1 className="text-2xl font-semibold">الخريطة الحرارية</h1>
          <p className="text-muted-foreground">تتبع حركة المرور والكثافة</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{totalPeople}</p>
                <p className="text-xs text-muted-foreground">إجمالي الأشخاص</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Zap className="h-8 w-8 text-red-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{highTrafficAreas}</p>
                <p className="text-xs text-muted-foreground">مناطق عالية الكثافة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Thermometer className="h-8 w-8 text-orange-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{averageIntensity}%</p>
                <p className="text-xs text-muted-foreground">متوسط الكثافة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">14</p>
                <p className="text-xs text-muted-foreground">منطقة مراقبة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heat Map Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-end">
              الخريطة الحرارية للمبنى
              <Activity className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-border overflow-hidden">
              {/* Building Layout Background */}
              <div className="absolute inset-0">
                {/* Floor Plan Elements */}
                <div className="absolute top-4 left-4 right-4 h-8 bg-gray-200 rounded border-2 border-gray-300 flex items-center justify-center text-xs">
                  المدخل الرئيسي
                </div>
                <div className="absolute bottom-4 right-4 w-16 h-8 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-xs">
                  مدخل خلفي
                </div>
                
                {/* Office Areas */}
                <div className="absolute top-16 left-4 w-32 h-24 bg-blue-100 rounded border border-blue-300 flex items-center justify-center text-xs text-center p-1">
                  تقنية المعلومات
                </div>
                <div className="absolute top-16 right-4 w-32 h-24 bg-green-100 rounded border border-green-300 flex items-center justify-center text-xs text-center p-1">
                  المالية
                </div>
                <div className="absolute bottom-16 left-4 w-32 h-24 bg-purple-100 rounded border border-purple-300 flex items-center justify-center text-xs text-center p-1">
                  الموارد البشرية
                </div>
                <div className="absolute bottom-16 right-4 w-32 h-24 bg-orange-100 rounded border border-orange-300 flex items-center justify-center text-xs text-center p-1">
                  التسويق
                </div>
                
                {/* Central Reception */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-100 rounded-full border-2 border-yellow-300 flex items-center justify-center text-xs text-center">
                  الاستقبال
                </div>
              </div>

              {/* Heat Points */}
              {mockHeatData.map((point, index) => (
                <div
                  key={index}
                  className={`absolute w-8 h-8 rounded-full ${getIntensityColor(point.intensity)} cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 hover:z-10`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    opacity: getIntensityOpacity(point.intensity),
                  }}
                  onClick={() => setSelectedArea(selectedArea === point.area ? null : point.area)}
                  title={`${point.area}: ${point.count} شخص`}
                >
                  <div className="w-full h-full rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{point.count}</span>
                  </div>
                  
                  {/* Ripple effect for high intensity */}
                  {point.intensity >= 80 && (
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></div>
                  )}
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur rounded-lg p-2 text-xs">
                <div className="font-medium mb-1">مستوى الكثافة:</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>عالي</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>متوسط</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>منخفض</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Area Details */}
            {selectedArea && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-right mb-2">{selectedArea}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {mockHeatData
                    .filter(point => point.area === selectedArea)
                    .map(point => (
                      <div key={point.area} className="space-y-1">
                        <p>عدد الأشخاص: <span className="font-medium">{point.count}</span></p>
                        <p>مستوى الكثافة: <span className="font-medium">{point.intensity}%</span></p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Area Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-end">
              إحصائيات المناطق
              <BarChart3 className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {areaStats.map((area, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getRiskColor(area.riskLevel)} text-xs`}>
                      {getRiskText(area.riskLevel)}
                    </Badge>
                    <h5 className="font-medium text-sm text-right">{area.name}</h5>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>{area.currentCount}/{area.maxCapacity}</span>
                      <span>السعة:</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (area.currentCount / area.maxCapacity) > 0.8 
                            ? 'bg-red-500' 
                            : (area.currentCount / area.maxCapacity) > 0.6 
                              ? 'bg-orange-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (area.currentCount / area.maxCapacity) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>{area.peakTime}</span>
                      <span>ذروة النشاط:</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>{area.averageStay}</span>
                      <span>متوسط البقاء:</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right text-orange-800">
            التنبيهات الحالية
            <AlertCircle className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-100 border border-red-200 rounded-lg">
              <div className="flex-1 text-right">
                <p className="font-medium text-red-800">كثافة عالية في المدخل الرئيسي</p>
                <p className="text-sm text-red-600">42 شخص من أصل 50 (84% من السعة)</p>
              </div>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
              <div className="flex-1 text-right">
                <p className="font-medium text-yellow-800">اقتراب من الحد الأقصى في قسم تقنية المعلومات</p>
                <p className="text-sm text-yellow-600">28 شخص من أصل 35 (80% من السعة)</p>
              </div>
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}