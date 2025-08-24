import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { 
  Plus, 
  Scan, 
  Camera, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Building,
  Search,
  QrCode,
  AlertTriangle,
  CheckCircle,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface Visitor {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  purpose: string;
  hostEmployee: string;
  department: string;
  checkIn: string;
  checkOut?: string;
  status: 'active' | 'completed' | 'pending';
  photo?: string;
  idScanned: boolean;
  qrCode: string;
}

const mockVisitors: Visitor[] = [
  {
    id: 'VIS001',
    name: 'سارة أحمد المطيري',
    company: 'شركة التقنيات المتقدمة',
    phone: '0501234567',
    email: 'sara@advanced-tech.sa',
    purpose: 'اجتماع عمل - مناقشة مشروع جديد',
    hostEmployee: 'أحمد محمد علي',
    department: 'تقنية المعلومات',
    checkIn: '09:30',
    status: 'active',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a5?w=150',
    idScanned: true,
    qrCode: 'QR001'
  },
  {
    id: 'VIS002',
    name: 'عبدالله محمد الشمري',
    company: 'مؤسسة الاستشارات المالية',
    phone: '0559876543',
    purpose: 'استشارة مالية',
    hostEmployee: 'عبدالرحمن صالح',
    department: 'المالية',
    checkIn: '11:15',
    checkOut: '12:30',
    status: 'completed',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    idScanned: true,
    qrCode: 'QR002'
  },
  {
    id: 'VIS003',
    name: 'مريم خالد العتيبي',
    phone: '0567891234',
    purpose: 'مقابلة عمل - مطورة واجهات',
    hostEmployee: 'نورا خالد',
    department: 'الموارد البشرية',
    checkIn: '14:00',
    status: 'active',
    idScanned: false,
    qrCode: 'QR003'
  }
];

export function VisitorManagement() {
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingVisitor, setIsAddingVisitor] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    purpose: '',
    hostEmployee: '',
    department: ''
  });

  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.includes(searchTerm) || 
    visitor.company?.includes(searchTerm) ||
    visitor.phone.includes(searchTerm) ||
    visitor.hostEmployee.includes(searchTerm)
  );

  const stats = {
    active: visitors.filter(v => v.status === 'active').length,
    completed: visitors.filter(v => v.status === 'completed').length,
    pending: visitors.filter(v => v.status === 'pending').length,
    total: visitors.length
  };

  const simulateIdScan = () => {
    setIsScanning(true);
    
    // محاكاة مسح الهوية
    setTimeout(() => {
      const scannedData = {
        name: 'محمد عبدالعزيز الغامدي',
        phone: '0512345678',
        email: 'mohammed@email.com'
      };
      
      setNewVisitor(prev => ({
        ...prev,
        ...scannedData
      }));
      
      toast.success('تم مسح الهوية بنجاح', {
        description: 'تم تعبئة البيانات الأساسية تلقائياً'
      });
      setIsScanning(false);
    }, 2000);
  };

  const addVisitor = () => {
    if (!newVisitor.name || !newVisitor.phone || !newVisitor.purpose || !newVisitor.hostEmployee) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const visitor: Visitor = {
      id: `VIS${String(visitors.length + 1).padStart(3, '0')}`,
      ...newVisitor,
      checkIn: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }),
      status: 'active',
      idScanned: true,
      qrCode: `QR${String(visitors.length + 1).padStart(3, '0')}`
    };

    setVisitors(prev => [visitor, ...prev]);
    setNewVisitor({
      name: '',
      company: '',
      phone: '',
      email: '',
      purpose: '',
      hostEmployee: '',
      department: ''
    });
    setIsAddingVisitor(false);
    
    toast.success(`تم تسجيل الزائر ${visitor.name} بنجاح`, {
      description: `رمز QR: ${visitor.qrCode}`
    });
  };

  const checkOutVisitor = (visitorId: string) => {
    const currentTime = new Date().toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });

    setVisitors(prev => prev.map(visitor => 
      visitor.id === visitorId 
        ? { ...visitor, checkOut: currentTime, status: 'completed' as const }
        : visitor
    ));

    toast.success('تم تسجيل الخروج بنجاح');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'pending': return 'في الانتظار';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Dialog open={isAddingVisitor} onOpenChange={setIsAddingVisitor}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              تسجيل زائر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">تسجيل زائر جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* ID Scan Section */}
              <div className="p-4 border border-dashed border-border rounded-lg text-center">
                <Button
                  onClick={simulateIdScan}
                  disabled={isScanning}
                  variant="outline"
                  className="gap-2 w-full"
                >
                  {isScanning ? (
                    <>
                      <Timer className="h-4 w-4 animate-spin" />
                      جاري المسح...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4" />
                      مسح الهوية تلقائياً
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  أو املأ البيانات يدوياً
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-right block mb-1">الاسم الكامل *</Label>
                  <Input
                    placeholder="الاسم الكامل"
                    value={newVisitor.name}
                    onChange={(e) => setNewVisitor(prev => ({ ...prev, name: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-1">الشركة</Label>
                  <Input
                    placeholder="اسم الشركة (اختياري)"
                    value={newVisitor.company}
                    onChange={(e) => setNewVisitor(prev => ({ ...prev, company: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-1">رقم الهاتف *</Label>
                  <Input
                    placeholder="05xxxxxxxx"
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor(prev => ({ ...prev, phone: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-1">البريد الإلكتروني</Label>
                  <Input
                    placeholder="example@email.com"
                    value={newVisitor.email}
                    onChange={(e) => setNewVisitor(prev => ({ ...prev, email: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-1">الغرض من الزيارة *</Label>
                  <Textarea
                    placeholder="وصف الغرض من الزيارة..."
                    value={newVisitor.purpose}
                    onChange={(e) => setNewVisitor(prev => ({ ...prev, purpose: e.target.value }))}
                    className="text-right min-h-20"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-1">الموظف المضيف *</Label>
                  <Select onValueChange={(value) => setNewVisitor(prev => ({ ...prev, hostEmployee: value }))}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر الموظف المضيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أحمد محمد علي">أحمد محمد علي - تقنية المعلومات</SelectItem>
                      <SelectItem value="فاطمة أحمد">فاطمة أحمد - الموارد البشرية</SelectItem>
                      <SelectItem value="عبدالرحمن صالح">عبدالرحمن صالح - المالية</SelectItem>
                      <SelectItem value="نورا خالد">نورا خالد - التسويق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-right block mb-1">القسم</Label>
                  <Select onValueChange={(value) => setNewVisitor(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تقنية المعلومات">تقنية المعلومات</SelectItem>
                      <SelectItem value="الموارد البشرية">الموارد البشرية</SelectItem>
                      <SelectItem value="المالية">المالية</SelectItem>
                      <SelectItem value="التسويق">التسويق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddingVisitor(false)}>
                  إلغاء
                </Button>
                <Button className="flex-1" onClick={addVisitor}>
                  تسجيل الزائر
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="text-right">
          <h1 className="text-2xl font-semibold">إدارة الزوار</h1>
          <p className="text-muted-foreground">التسجيل الذكي ومتابعة الزوار</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-green-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">زائر نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">مكتمل</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">في الانتظار</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-8 w-8 text-purple-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي اليوم</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث بالاسم، الشركة، رقم الهاتف، أو الموظف المضيف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-right"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visitors List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">قائمة الزوار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVisitors.map((visitor) => (
              <div
                key={visitor.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <QrCode className="h-3 w-3" />
                      {visitor.qrCode}
                    </Button>
                    {visitor.status === 'active' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => checkOutVisitor(visitor.id)}
                        className="gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        تسجيل خروج
                      </Button>
                    )}
                  </div>

                  {/* Status and Times */}
                  <div className="text-left space-y-1">
                    <Badge className={getStatusColor(visitor.status)}>
                      {getStatusText(visitor.status)}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      دخول: {visitor.checkIn}
                    </p>
                    {visitor.checkOut && (
                      <p className="text-xs text-muted-foreground">
                        خروج: {visitor.checkOut}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs">
                      {visitor.idScanned ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          تم مسح الهوية
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <AlertTriangle className="h-3 w-3" />
                          لم يتم المسح
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visitor Info */}
                <div className="flex items-center gap-3 text-right max-w-md">
                  <div className="space-y-1">
                    <h3 className="font-medium">{visitor.name}</h3>
                    {visitor.company && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {visitor.company}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {visitor.phone}
                    </p>
                    {visitor.email && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {visitor.email}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      الغرض: {visitor.purpose}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      مع {visitor.hostEmployee} - {visitor.department}
                    </p>
                  </div>
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={visitor.photo} />
                    <AvatarFallback>{visitor.name.charAt(0)}</AvatarFallback>
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