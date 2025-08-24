import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  UserCheck,
  UserX,
  Settings,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  FileText,
  Key,
  Lock,
  Unlock,
  UserPlus,
  RefreshCw,
  Camera,
  Fingerprint,
  IdCard,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { apiClient, type Employee } from "../lib/api";

interface EmployeeWithStats extends Employee {
  attendance_rate?: number;
  last_seen?: string;
  total_hours?: number;
  status?: 'active' | 'inactive' | 'suspended';
  biometric_enrolled?: boolean;
  access_level?: 'basic' | 'advanced' | 'admin';
}

const departments = [
  'تقنية المعلومات',
  'الموارد البشرية', 
  'المالية',
  'التسويق',
  'المبيعات',
  'العمليات',
  'الأمان',
  'الإدارة العامة'
];

const positions = [
  'مطور برمجيات',
  'مدير مشروع',
  'محلل أنظمة',
  'مصمم واجهات',
  'متخصص قواعد بيانات',
  'مدير تقني',
  'مسؤول أنظمة',
  'أخصائي أمن سيبراني',
  'مدير موارد بشرية',
  'محاسب',
  'مسؤول مالي',
  'مسؤول تسويق',
  'مندوب مبيعات',
  'مدير عام',
  'مساعد إداري'
];

const accessLevels = [
  { value: 'basic', label: 'أساسي', color: 'bg-gray-100 text-gray-800' },
  { value: 'advanced', label: 'متقدم', color: 'bg-blue-100 text-blue-800' },
  { value: 'admin', label: 'مدير', color: 'bg-purple-100 text-purple-800' }
];

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<EmployeeWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithStats | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isBiometricDialogOpen, setIsBiometricDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    name: '',
    department: '',
    position: '',
    phone: '',
    email: '',
    access_level: 'basic',
    hire_date: '',
    salary: '',
    address: '',
    emergency_contact: '',
    notes: ''
  });

  // Load employees
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    if (!refreshing) setLoading(true);
    
    try {
      const response = await apiClient.getEmployees();
      if (response.success && response.data) {
        // Enhance employee data with mock stats
        const enhancedEmployees: EmployeeWithStats[] = response.data.map(emp => ({
          ...emp,
          attendance_rate: Math.round(75 + Math.random() * 25), // 75-100%
          last_seen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          total_hours: Math.round(160 + Math.random() * 40), // 160-200 hours
          status: emp.is_active ? 'active' : 'inactive',
          biometric_enrolled: Math.random() > 0.3, // 70% enrolled
          access_level: ['basic', 'advanced', 'admin'][Math.floor(Math.random() * 3)] as any
        }));
        
        setEmployees(enhancedEmployees);
        
        if (!refreshing) {
          toast.success(`تم تحميل ${enhancedEmployees.length} موظف`);
        }
      } else {
        toast.error(response.error || 'خطأ في تحميل البيانات');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال مع الخادم');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEmployees();
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.phone?.includes(searchTerm);
    
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Add new employee
  const handleAddEmployee = async () => {
    try {
      const response = await apiClient.addEmployee(newEmployee);
      if (response.success) {
        toast.success('تم إضافة الموظف بنجاح');
        setIsAddDialogOpen(false);
        setNewEmployee({
          employee_id: '',
          name: '',
          department: '',
          position: '',
          phone: '',
          email: '',
          access_level: 'basic',
          hire_date: '',
          salary: '',
          address: '',
          emergency_contact: '',
          notes: ''
        });
        loadEmployees();
      } else {
        toast.error(response.error || 'خطأ في إضافة الموظف');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال مع الخادم');
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    
    try {
      const response = await apiClient.deleteEmployee(employeeId);
      if (response.success) {
        toast.success('تم حذف الموظف بنجاح');
        loadEmployees();
      } else {
        toast.error(response.error || 'خطأ في حذف الموظف');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال مع الخادم');
    }
  };

  // Toggle employee status
  const handleToggleStatus = async (employee: EmployeeWithStats) => {
    try {
      const response = await apiClient.updateEmployee(employee.employee_id, {
        is_active: !employee.is_active
      });
      if (response.success) {
        toast.success(`تم ${employee.is_active ? 'إيقاف' : 'تفعيل'} الموظف`);
        loadEmployees();
      } else {
        toast.error(response.error || 'خطأ في تحديث حالة الموظف');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال مع الخادم');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelColor = (level: string) => {
    const found = accessLevels.find(a => a.value === level);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelLabel = (level: string) => {
    const found = accessLevels.find(a => a.value === level);
    return found ? found.label : level;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p>جاري تحميل بيانات الموظفين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-6 space-y-6 w-full max-w-none">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              استيراد
            </Button>
          </div>
          
          <div className="text-right">
            <h1 className="text-2xl font-semibold flex items-center justify-end gap-2 mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              إدارة الموظفين المتقدمة
            </h1>
            <p className="text-muted-foreground">
              إدارة شاملة لبيانات الموظفين مع التشفير المتقدم والأمان الكامل
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">إجمالي الموظفين</p>
                  <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">الموظفين النشطين</p>
                  <p className="text-2xl font-bold text-green-600">
                    {employees.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">التسجيل الحيوي</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {employees.filter(e => e.biometric_enrolled).length}
                  </p>
                </div>
                <Fingerprint className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">الأقسام</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {new Set(employees.map(e => e.department)).size}
                  </p>
                </div>
                <Building className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في الموظفين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 ml-2" />
                    <SelectValue placeholder="فلترة حسب القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقسام</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة موظف جديد
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-right">
              قائمة الموظفين ({filteredEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الإجراءات</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">معدل الحضور</TableHead>
                    <TableHead className="text-right">التسجيل الحيوي</TableHead>
                    <TableHead className="text-right">مستوى الوصول</TableHead>
                    <TableHead className="text-right">القسم</TableHead>
                    <TableHead className="text-right">المنصب</TableHead>
                    <TableHead className="text-right">الاتصال</TableHead>
                    <TableHead className="text-right">الموظف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.employee_id}>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 ml-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 ml-2" />
                              تحرير
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsBiometricDialogOpen(true);
                              }}
                            >
                              <Fingerprint className="h-4 w-4 ml-2" />
                              التسجيل الحيوي
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(employee)}
                            >
                              {employee.is_active ? (
                                <>
                                  <UserX className="h-4 w-4 ml-2" />
                                  إيقاف
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 ml-2" />
                                  تفعيل
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEmployee(employee.employee_id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(employee.status || 'inactive')}>
                          {employee.status === 'active' ? 'نشط' : 
                           employee.status === 'suspended' ? 'موقف' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={employee.attendance_rate || 0}
                            className="w-16 h-2"
                          />
                          <span className="text-sm">{employee.attendance_rate || 0}%</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {employee.biometric_enrolled ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            مسجل
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <AlertCircle className="h-3 w-3 ml-1" />
                            غير مسجل
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getAccessLevelColor(employee.access_level || 'basic')}>
                          {getAccessLevelLabel(employee.access_level || 'basic')}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {employee.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {employee.phone}
                            </div>
                          )}
                          {employee.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.employee_id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Employee Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right flex items-center justify-end gap-2">
                <UserPlus className="h-5 w-5" />
                إضافة موظف جديد
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">رقم الموظف *</Label>
                  <Input
                    id="employee_id"
                    value={newEmployee.employee_id}
                    onChange={(e) => setNewEmployee({...newEmployee, employee_id: e.target.value})}
                    placeholder="EMP001"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="أحمد محمد علي"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">القسم *</Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">المنصب *</Label>
                  <Select
                    value={newEmployee.position}
                    onValueChange={(value) => setNewEmployee({...newEmployee, position: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنصب" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    placeholder="966501234567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    placeholder="ahmed@company.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="access_level">مستوى الوصول</Label>
                  <Select
                    value={newEmployee.access_level}
                    onValueChange={(value) => setNewEmployee({...newEmployee, access_level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hire_date">تاريخ التوظيف</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={newEmployee.hire_date}
                    onChange={(e) => setNewEmployee({...newEmployee, hire_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Textarea
                  id="address"
                  value={newEmployee.address}
                  onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                  placeholder="العنوان الكامل"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">جهة اتصال الطوارئ</Label>
                <Input
                  id="emergency_contact"
                  value={newEmployee.emergency_contact}
                  onChange={(e) => setNewEmployee({...newEmployee, emergency_contact: e.target.value})}
                  placeholder="اسم ورقم جهة الاتصال"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={newEmployee.notes}
                  onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={handleAddEmployee}>
                  إضافة الموظف
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Employee Dialog */}
        {selectedEmployee && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-right flex items-center justify-end gap-2">
                  <Eye className="h-5 w-5" />
                  تفاصيل الموظف: {selectedEmployee.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-right">
                    <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedEmployee.employee_id} • {selectedEmployee.position}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(selectedEmployee.status || 'inactive')}>
                        {selectedEmployee.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                      <Badge className={getAccessLevelColor(selectedEmployee.access_level || 'basic')}>
                        {getAccessLevelLabel(selectedEmployee.access_level || 'basic')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
                    <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
                    <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
                    <TabsTrigger value="security">الأمان</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>رقم الموظف</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded">{selectedEmployee.employee_id}</p>
                      </div>
                      <div>
                        <Label>الاسم الكامل</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded">{selectedEmployee.name}</p>
                      </div>
                      <div>
                        <Label>القسم</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded">{selectedEmployee.department}</p>
                      </div>
                      <div>
                        <Label>المنصب</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded">{selectedEmployee.position}</p>
                      </div>
                      <div>
                        <Label>تاريخ التوظيف</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded">
                          {new Date(selectedEmployee.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div>
                        <Label>آخر تحديث</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded">
                          {new Date(selectedEmployee.updated_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {selectedEmployee.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                          <Phone className="h-5 w-5" />
                          <div>
                            <Label>رقم الهاتف</Label>
                            <p>{selectedEmployee.phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedEmployee.email && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                          <Mail className="h-5 w-5" />
                          <div>
                            <Label>البريد الإلكتروني</Label>
                            <p>{selectedEmployee.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedEmployee.attendance_rate}%
                          </div>
                          <p className="text-sm text-muted-foreground">معدل الحضور</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedEmployee.total_hours}
                          </div>
                          <p className="text-sm text-muted-foreground">ساعات العمل الشهرية</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedEmployee.last_seen ? 
                              new Date(selectedEmployee.last_seen).toLocaleDateString('ar-SA') : 
                              'غير متاح'
                            }
                          </div>
                          <p className="text-sm text-muted-foreground">آخر حضور</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-right">
                              <h4 className="font-medium">التسجيل الحيوي</h4>
                              <p className="text-sm text-muted-foreground">
                                حالة تسجيل البصمة والوجه
                              </p>
                            </div>
                            <Fingerprint className="h-8 w-8 text-purple-600" />
                          </div>
                          <Badge className={selectedEmployee.biometric_enrolled ? 
                            "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }>
                            {selectedEmployee.biometric_enrolled ? 'مسجل' : 'غير مسجل'}
                          </Badge>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-right">
                              <h4 className="font-medium">مستوى الوصول</h4>
                              <p className="text-sm text-muted-foreground">
                                صلاحيات الوصول للنظام
                              </p>
                            </div>
                            <ShieldCheck className="h-8 w-8 text-blue-600" />
                          </div>
                          <Badge className={getAccessLevelColor(selectedEmployee.access_level || 'basic')}>
                            {getAccessLevelLabel(selectedEmployee.access_level || 'basic')}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Biometric Registration Dialog */}
        {selectedEmployee && (
          <Dialog open={isBiometricDialogOpen} onOpenChange={setIsBiometricDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-right flex items-center justify-end gap-2">
                  <Fingerprint className="h-5 w-5" />
                  التسجيل الحيوي
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-4">
                    <Avatar className="h-20 w-20 mx-auto">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {selectedEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-2 font-medium">{selectedEmployee.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.employee_id}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full gap-2" variant="outline">
                      <Camera className="h-4 w-4" />
                      تسجيل الوجه
                    </Button>
                    
                    <Button className="w-full gap-2" variant="outline">
                      <Fingerprint className="h-4 w-4" />
                      تسجيل البصمة
                    </Button>
                    
                    <Button className="w-full gap-2" variant="outline">
                      <IdCard className="h-4 w-4" />
                      ربط البطاقة
                    </Button>
                  </div>
                  
                  <Alert className="mt-4">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription>
                      جميع البيانات الحيوية مشفرة بأحدث تقنيات الأمان AES-256
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}