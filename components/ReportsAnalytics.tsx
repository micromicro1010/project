import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Shield, 
  FileText,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { ChartStyle, ChartContainer, ChartTooltip } from './ui/chart';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

// Sample data for various reports
const attendanceData = [
  { date: '01/08', present: 142, absent: 8, late: 12 },
  { date: '02/08', present: 145, absent: 5, late: 8 },
  { date: '03/08', present: 138, absent: 12, late: 15 },
  { date: '04/08', present: 147, absent: 3, late: 6 },
  { date: '05/08', present: 149, absent: 1, late: 4 },
  { date: '06/08', present: 144, absent: 6, late: 9 },
  { date: '07/08', present: 146, absent: 4, late: 7 },
];

const departmentData = [
  { name: 'تقنية المعلومات', employees: 35, present: 32, absent: 3, rate: 91.4 },
  { name: 'المالية', employees: 20, present: 19, absent: 1, rate: 95.0 },
  { name: 'الموارد البشرية', employees: 25, present: 23, absent: 2, rate: 92.0 },
  { name: 'التسويق', employees: 18, present: 16, absent: 2, rate: 88.9 },
  { name: 'الإدارة العامة', employees: 12, present: 11, absent: 1, rate: 91.7 },
];

const securityIncidents = [
  { date: '01/08', incidents: 2, severity: 'منخفض' },
  { date: '02/08', incidents: 0, severity: 'لا يوجد' },
  { date: '03/08', incidents: 4, severity: 'متوسط' },
  { date: '04/08', incidents: 1, severity: 'منخفض' },
  { date: '05/08', incidents: 0, severity: 'لا يوجد' },
  { date: '06/08', incidents: 3, severity: 'متوسط' },
  { date: '07/08', incidents: 1, severity: 'منخفض' },
];

const visitorTrends = [
  { month: 'يناير', visitors: 245, averageStay: 45 },
  { month: 'فبراير', visitors: 267, averageStay: 42 },
  { month: 'مارس', visitors: 298, averageStay: 48 },
  { month: 'أبريل', visitors: 223, averageStay: 41 },
  { month: 'مايو', visitors: 312, averageStay: 46 },
  { month: 'يونيو', visitors: 334, averageStay: 43 },
  { month: 'يوليو', visitors: 289, averageStay: 44 },
];

const complianceData = [
  { metric: 'معدل الحضور', current: 92.3, target: 90, status: 'متجاوز' },
  { metric: 'دقة البيانات الحيوية', current: 99.1, target: 98, status: 'متجاوز' },
  { metric: 'وقت الاستجابة الأمنية', current: 2.1, target: 3, status: 'متجاوز' },
  { metric: 'معدل الأخطاء', current: 0.3, target: 1, status: 'متجاوز' },
  { metric: 'رضا المستخدمين', current: 4.2, target: 4, status: 'متجاوز' },
];

const pieData = [
  { name: 'حاضر', value: 146, color: '#22c55e' },
  { name: 'غائب', value: 4, color: '#ef4444' },
  { name: 'متأخر', value: 7, color: '#f59e0b' },
];

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedReport, setSelectedReport] = useState('attendance');

  const generateReport = (type: string) => {
    toast.success(`تم إنشاء تقرير ${getReportName(type)} بنجاح`, {
      description: 'سيتم تحميل التقرير خلال ثواني...'
    });
    
    // Simulate file download
    setTimeout(() => {
      toast.success('تم تحميل التقرير بنجاح');
    }, 2000);
  };

  const getReportName = (type: string) => {
    switch (type) {
      case 'attendance': return 'الحضور والغياب';
      case 'security': return 'الأمن والحماية';
      case 'visitors': return 'الزوار';
      case 'compliance': return 'الامتثال';
      default: return 'عام';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متجاوز': return 'text-green-600 bg-green-100';
      case 'مطابق': return 'text-blue-600 bg-blue-100';
      case 'أقل من المطلوب': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">يومي</SelectItem>
              <SelectItem value="week">أسبوعي</SelectItem>
              <SelectItem value="month">شهري</SelectItem>
              <SelectItem value="quarter">ربعي</SelectItem>
              <SelectItem value="year">سنوي</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">تقرير الحضور</SelectItem>
              <SelectItem value="security">تقرير الأمان</SelectItem>
              <SelectItem value="visitors">تقرير الزوار</SelectItem>
              <SelectItem value="compliance">تقرير الامتثال</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={() => generateReport(selectedReport)} 
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            تحميل التقرير
          </Button>
        </div>

        <div className="text-right">
          <h1 className="text-2xl font-semibold">التقارير والتحليلات</h1>
          <p className="text-muted-foreground">نظرة شاملة على أداء النظام</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">92.3%</p>
                <p className="text-xs text-muted-foreground">معدل الحضور</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">-12%</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">11</p>
                <p className="text-xs text-muted-foreground">حوادث أمنية</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+18%</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">289</p>
                <p className="text-xs text-muted-foreground">زوار هذا الشهر</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">2.1s</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">99.1%</p>
                <p className="text-xs text-muted-foreground">دقة النظام</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-end">
              اتجاهات الحضور الأسبوعية
              <Users className="h-5 w-5 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              present: { label: "حاضر", color: "#22c55e" },
              absent: { label: "غائب", color: "#ef4444" },
              late: { label: "متأخر", color: "#f59e0b" }
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    fill="url(#colorPresent)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="late" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    fill="url(#colorLate)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fill="url(#colorAbsent)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Today's Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-end">
              توزيع اليوم
              <PieChart className="h-5 w-5 text-purple-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{item.value} شخص</span>
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-end">
            أداء الأقسام
            <BarChart3 className="h-5 w-5 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            rate: { label: "معدل الحضور", color: "#3b82f6" }
          }} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="horizontal">
                <XAxis type="number" domain={[0, 100]} className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={120} />
                <ChartTooltip />
                <Bar 
                  dataKey="rate" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="p-3 border border-border rounded-lg">
                <h4 className="font-medium text-right mb-2">{dept.name}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{dept.employees}</span>
                    <span>إجمالي الموظفين:</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>{dept.present}</span>
                    <span>حاضر:</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>{dept.absent}</span>
                    <span>غائب:</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>{dept.rate}%</span>
                    <span>معدل الحضور:</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Incidents & Visitor Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-end">
              الحوادث الأمنية
              <Shield className="h-5 w-5 text-red-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              incidents: { label: "الحوادث", color: "#ef4444" }
            }} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={securityIncidents}>
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-end">
              اتجاهات الزوار
              <Activity className="h-5 w-5 text-orange-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              visitors: { label: "الزوار", color: "#f59e0b" },
              averageStay: { label: "متوسط البقاء", color: "#8b5cf6" }
            }} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorTrends}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    fill="url(#colorVisitors)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-end">
            لوحة الامتثال
            <FileText className="h-5 w-5 text-purple-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceData.map((item, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <h4 className="font-medium text-right">{item.metric}</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{item.current}{item.metric.includes('وقت') ? 'ث' : '%'}</span>
                    <span>القيمة الحالية:</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.target}{item.metric.includes('وقت') ? 'ث' : '%'}</span>
                    <span>الهدف:</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'متجاوز' ? 'bg-green-500' : 
                        item.status === 'مطابق' ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (item.current / item.target) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}