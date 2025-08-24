import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Search, 
  Camera, 
  Fingerprint, 
  Check, 
  Clock, 
  UserCheck, 
  UserX, 
  AlertCircle,
  Scan,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from './ui/progress';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  status: 'present' | 'absent' | 'late';
  checkIn?: string;
  checkOut?: string;
  biometricVerified: boolean;
}

const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'أحمد محمد علي',
    department: 'تقنية المعلومات',
    position: 'مطور برمجيات',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    status: 'present',
    checkIn: '08:15',
    biometricVerified: true
  },
  {
    id: 'EMP002',
    name: 'فاطمة أحمد',
    department: 'الموارد البشرية',
    position: 'مختصة توظيف',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a5?w=150',
    status: 'present',
    checkIn: '07:45',
    checkOut: '16:30',
    biometricVerified: true
  },
  {
    id: 'EMP003',
    name: 'عبدالرحمن صالح',
    department: 'المالية',
    position: 'محاسب أول',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'late',
    checkIn: '09:30',
    biometricVerified: false
  },
  {
    id: 'EMP004',
    name: 'نورا خالد',
    department: 'التسويق',
    position: 'مديرة التسويق',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    status: 'absent',
    biometricVerified: false
  }
];

export function AttendanceSystem() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [scanType, setScanType] = useState<'face' | 'fingerprint'>('face');

  const filteredEmployees = employees.filter(emp => 
    emp.name.includes(searchTerm) || 
    emp.id.includes(searchTerm) ||
    emp.department.includes(searchTerm)
  );

  const stats = {
    present: employees.filter(e => e.status === 'present').length,
    absent: employees.filter(e => e.status === 'absent').length,
    late: employees.filter(e => e.status === 'late').length,
    total: employees.length
  };

  const startBiometricScan = (employee: Employee, type: 'face' | 'fingerprint') => {
    setSelectedEmployee(employee);
    setScanType(type);
    setIsScanning(true);
    setBiometricProgress(0);

    // محاكاة عملية المسح الحيوي
    const interval = setInterval(() => {
      setBiometricProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // محاكاة نجاح التحقق
          setTimeout(() => {
            const currentTime = new Date().toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            });
            
            setEmployees(prev => prev.map(emp => 
              emp.id === employee.id 
                ? { 
                    ...emp, 
                    status: 'present' as const,
                    checkIn: currentTime,
                    biometricVerified: true 
                  }
                : emp
            ));
            
            toast.success(
              `تم تسجيل حضور ${employee.name} بنجاح`, 
              { description: `الوقت: ${currentTime}` }
            );
            setSelectedEmployee(null);
            setBiometricProgress(0);
          }, 500);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'حاضر';
      case 'absent': return 'غائب';
      case 'late': return 'متأخر';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-right">
        <h1 className="text-2xl font-semibold">نظام إدارة الحضور</h1>
        <p className="text-muted-foreground mt-2">التعرف الحيوي والتسجيل السريع</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.present}</p>
                <p className="text-xs text-muted-foreground">حاضر</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.absent}</p>
                <p className="text-xs text-muted-foreground">غائب</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.late}</p>
                <p className="text-xs text-muted-foreground">متأخر</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">البحث والتحكم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث بالاسم أو الرقم الوظيفي أو القسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biometric Scanner */}
      {isScanning && selectedEmployee && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              {scanType === 'face' ? (
                <>
                  <Camera className="h-5 w-5 text-blue-600" />
                  مسح الوجه جاري...
                </>
              ) : (
                <>
                  <Fingerprint className="h-5 w-5 text-blue-600" />
                  مسح البصمة جاري...
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-blue-200 overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src={selectedEmployee.avatar} />
                  <AvatarFallback>{selectedEmployee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                  {scanType === 'face' ? (
                    <Scan className="h-8 w-8 text-blue-600 animate-pulse" />
                  ) : (
                    <Fingerprint className="h-8 w-8 text-blue-600 animate-pulse" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">{selectedEmployee.name}</p>
                <Progress value={biometricProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-muted-foreground">{biometricProgress}% مكتمل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">قائمة الموظفين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Biometric Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startBiometricScan(employee, 'face')}
                      disabled={isScanning}
                      className="gap-1"
                    >
                      <Camera className="h-3 w-3" />
                      وجه
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startBiometricScan(employee, 'fingerprint')}
                      disabled={isScanning}
                      className="gap-1"
                    >
                      <Fingerprint className="h-3 w-3" />
                      بصمة
                    </Button>
                  </div>

                  {/* Status and Times */}
                  <div className="text-left space-y-1">
                    <Badge className={getStatusColor(employee.status)}>
                      {getStatusText(employee.status)}
                    </Badge>
                    {employee.checkIn && (
                      <p className="text-xs text-muted-foreground">
                        دخول: {employee.checkIn}
                      </p>
                    )}
                    {employee.checkOut && (
                      <p className="text-xs text-muted-foreground">
                        خروج: {employee.checkOut}
                      </p>
                    )}
                    {employee.biometricVerified && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="h-3 w-3" />
                        تم التحقق حيوياً
                      </div>
                    )}
                  </div>
                </div>

                {/* Employee Info */}
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                    <p className="text-xs text-muted-foreground">{employee.id}</p>
                  </div>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}