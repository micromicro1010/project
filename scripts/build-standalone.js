const fs = require('fs');
const path = require('path');

// قراءة محتوى الملفات
function readFile(filePath) {
  try {
    return fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
  } catch (error) {
    console.error(`خطأ في قراءة الملف ${filePath}:`, error.message);
    return '';
  }
}

// إنشاء HTML مستقل
function buildStandaloneHTML() {
  console.log('🏗️  بناء النسخة المستقلة...');

  // قراءة ملفات CSS
  const globalCSS = readFile('styles/globals.css');
  
  // إنشاء HTML كامل مع React inline
  const standaloneHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام إدارة الحضور والأمن الذكي</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/></svg>">
    
    <!-- تضمين Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- تضمين React و ReactDOM -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- تضمين Babel للتحويل -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- تضمين Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    
    <!-- تضمين Recharts -->
    <script src="https://unpkg.com/recharts@2.10.0/umd/Recharts.js"></script>
    
    <style>
        ${globalCSS}
        
        /* إضافة أنماط إضافية للنسخة المستقلة */
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        }
        
        .loading-logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .loading-text {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .loading-subtitle {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* إخفاء شاشة التحميل */
        .loaded .loading-screen {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-out;
        }
        
        body:not(.loaded) {
            overflow: hidden;
        }
    </style>
</head>
<body>
    <!-- شاشة التحميل -->
    <div class="loading-screen" id="loading-screen">
        <div class="loading-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        </div>
        <div class="loading-text">نظام إدارة الحضور والأمن الذكي</div>
        <div class="loading-subtitle">النسخة المستقلة - جاري التحميل...</div>
        <div class="loading-spinner"></div>
    </div>
    
    <!-- حاوي التطبيق الرئيسي -->
    <div id="root"></div>
    
    <!-- رسالة للمتصفحات التي لا تدعم JavaScript -->
    <noscript>
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1>⚠️ تحذير</h1>
            <p>يتطلب هذا التطبيق تفعيل JavaScript لكي يعمل بشكل صحيح.</p>
            <p>يرجى تفعيل JavaScript في متصفحك وإعادة تحميل الصفحة.</p>
        </div>
    </noscript>

    <script type="text/babel">
        // تعريف المتغيرات العامة
        const { useState, useEffect } = React;
        
        // مكونات البيانات الوهمية
        const mockData = {
            // بيانات لوحة التحكم
            dashboard: {
                totalEmployees: 234,
                presentToday: 189,
                visitorsToday: 47,
                securityAlerts: 3,
                attendanceRate: 80.7,
                avgCheckInTime: '08:23',
                popularAreas: [
                    { name: 'المدخل الرئيسي', count: 156 },
                    { name: 'القاعة الكبرى', count: 89 },
                    { name: 'المقهى', count: 67 },
                    { name: 'موقف السيارات', count: 45 }
                ]
            },
            
            // بيانات الموظفين
            employees: [
                { id: 1, name: 'أحمد محمد علي', department: 'تقنية المعلومات', checkIn: '08:15', status: 'حاضر' },
                { id: 2, name: 'فاطمة سالم', department: 'المحاسبة', checkIn: '08:30', status: 'حاضر' },
                { id: 3, name: 'محمد أحمد', department: 'الموارد البشرية', checkIn: '-', status: 'غائب' },
                { id: 4, name: 'سارة علي', department: 'التسويق', checkIn: '09:00', status: 'متأخر' }
            ],
            
            // بيانات الزوار
            visitors: [
                { id: 1, name: 'عبدالله خالد', company: 'شركة التقنية', purpose: 'اجتماع عمل', time: '10:30', status: 'داخل المبنى' },
                { id: 2, name: 'نورا أحمد', company: 'مؤسسة التطوير', purpose: 'عرض تقديمي', time: '11:00', status: 'في الانتظار' }
            ]
        };

        // مكونات واجهة المستخدم الأساسية
        function Card({ children, className = '' }) {
            return (
                <div className={\`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 \${className}\`}>
                    {children}
                </div>
            );
        }

        function Button({ children, onClick, variant = 'primary', size = 'md', className = '' }) {
            const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
            
            const variants = {
                primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
                secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
                outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
            };
            
            const sizes = {
                sm: 'px-3 py-1.5 text-sm',
                md: 'px-4 py-2 text-sm',
                lg: 'px-6 py-3 text-base'
            };
            
            return (
                <button 
                    className={\`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`}
                    onClick={onClick}
                >
                    {children}
                </button>
            );
        }

        function Badge({ children, variant = 'default', className = '' }) {
            const variants = {
                default: 'bg-gray-100 text-gray-800',
                success: 'bg-green-100 text-green-800',
                warning: 'bg-yellow-100 text-yellow-800',
                error: 'bg-red-100 text-red-800'
            };
            
            return (
                <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${variants[variant]} \${className}\`}>
                    {children}
                </span>
            );
        }

        // مكون لوحة التحكم الرئيسية
        function Dashboard() {
            const data = mockData.dashboard;
            
            return (
                <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
                    <div className="text-right">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">لوحة التحكم الرئيسية</h1>
                        <p className="text-gray-600 dark:text-gray-400">نظرة شاملة على نشاطات النظام اليوم</p>
                    </div>

                    {/* إحصائيات سريعة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الموظفين</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalEmployees}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">حاضر اليوم</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.presentToday}</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الزوار اليوم</p>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.visitorsToday}</p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">التنبيهات الأمنية</p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.securityAlerts}</p>
                                </div>
                                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* نشاط اليوم */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">المناطق الأكثر نشاطاً</h3>
                            <div className="space-y-3">
                                {data.popularAreas.map((area, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <Badge variant="default">{area.count}</Badge>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{area.name}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">معدل الحضور</h3>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{data.attendanceRate}%</div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">معدل الحضور اليوم</p>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: \`\${data.attendanceRate}%\` }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            );
        }

        // مكون سجل الحضور
        function AttendanceSystem() {
            const [selectedEmployee, setSelectedEmployee] = useState(null);
            
            return (
                <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
                    <div className="text-right">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">نظام إدارة الحضور</h1>
                        <p className="text-gray-600 dark:text-gray-400">تتبع وإدارة حضور الموظفين</p>
                    </div>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">قائمة الموظفين</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-right">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">الحالة</th>
                                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">وقت الحضور</th>
                                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">القسم</th>
                                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">اسم الموظف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockData.employees.map((employee) => (
                                        <tr key={employee.id} className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="px-4 py-3">
                                                <Badge variant={employee.status === 'حاضر' ? 'success' : employee.status === 'متأخر' ? 'warning' : 'error'}>
                                                    {employee.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{employee.checkIn}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{employee.department}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{employee.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            );
        }

        // مكون إدارة الزوار
        function VisitorManagement() {
            return (
                <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
                    <div className="text-right">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الزوار</h1>
                        <p className="text-gray-600 dark:text-gray-400">تسجيل ومتابعة الزوار</p>
                    </div>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">الزوار الحاليون</h3>
                        <div className="space-y-4">
                            {mockData.visitors.map((visitor) => (
                                <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Badge variant={visitor.status === 'داخل المبنى' ? 'success' : 'warning'}>
                                        {visitor.status}
                                    </Badge>
                                    <div className="text-right flex-1 mr-4">
                                        <h4 className="font-medium text-gray-900 dark:text-white">{visitor.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{visitor.company}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{visitor.purpose}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">وقت الوصول: {visitor.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            );
        }

        // مكون الإعدادات
        function Settings() {
            const [isDark, setIsDark] = useState(false);
            
            return (
                <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
                    <div className="text-right">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">الإعدادات</h1>
                        <p className="text-gray-600 dark:text-gray-400">تخصيص النظام والتفضيلات</p>
                    </div>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">إعدادات المظهر</h3>
                        <div className="flex items-center justify-between">
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    setIsDark(!isDark);
                                    document.documentElement.classList.toggle('dark');
                                }}
                            >
                                {isDark ? '🌞 الوضع الفاتح' : '🌙 الوضع الداكن'}
                            </Button>
                            <label className="font-medium text-gray-900 dark:text-white">نمط الألوان:</label>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">معلومات النظام</h3>
                        <div className="space-y-2 text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">إصدار النظام: 1.0.0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">تاريخ البناء: {new Date().toLocaleDateString('ar-SA')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">وضع التشغيل: مستقل</p>
                        </div>
                    </Card>
                </div>
            );
        }

        // التطبيق الرئيسي
        function App() {
            const [currentView, setCurrentView] = useState('dashboard');
            const [isMenuOpen, setIsMenuOpen] = useState(false);

            const menuItems = [
                { id: 'dashboard', name: 'لوحة التحكل', icon: '📊' },
                { id: 'attendance', name: 'سجل الحضور', icon: '👥' },
                { id: 'visitors', name: 'إدارة الزوار', icon: '🚪' },
                { id: 'settings', name: 'الإعدادات', icon: '⚙️' }
            ];

            const renderView = () => {
                switch (currentView) {
                    case 'dashboard': return <Dashboard />;
                    case 'attendance': return <AttendanceSystem />;
                    case 'visitors': return <VisitorManagement />;
                    case 'settings': return <Settings />;
                    default: return <Dashboard />;
                }
            };

            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
                    {/* الشريط العلوي */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="md:hidden"
                                    >
                                        ☰
                                    </Button>
                                </div>
                                
                                <div className="text-center">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">نظام إدارة الحضور والأمن الذكي</h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">النسخة المستقلة</p>
                                </div>
                                
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Badge variant="success">متصل</Badge>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date().toLocaleTimeString('ar-SA')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex">
                        {/* الشريط الجانبي */}
                        <nav className={\`\${isMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen\`}>
                            <div className="p-4">
                                <div className="space-y-2">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setCurrentView(item.id)}
                                            className={\`w-full text-right px-4 py-3 rounded-lg transition-colors \${
                                                currentView === item.id
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }\`}
                                        >
                                            <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse">
                                                <span>{item.name}</span>
                                                <span className="text-lg">{item.icon}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </nav>

                        {/* المحتوى الرئيسي */}
                        <main className="flex-1">
                            {renderView()}
                        </main>
                    </div>
                </div>
            );
        }

        // تشغيل التطبيق
        setTimeout(() => {
            document.body.classList.add('loaded');
            ReactDOM.render(<App />, document.getElementById('root'));
        }, 2000);
    </script>
</body>
</html>`;

  // كتابة الملف
  const outputPath = path.resolve(__dirname, '..', 'dist', 'standalone.html');
  
  // إنشاء مجلد dist إذا لم يكن موجوداً
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }
  
  fs.writeFileSync(outputPath, standaloneHTML, 'utf8');
  
  console.log('✅ تم إنشاء النسخة المستقلة بنجاح!');
  console.log(\`📁 الملف متوفر في: \${outputPath}\`);
  console.log('🚀 يمكنك الآن فتح الملف مباشرة في المتصفح');
}

// تشغيل البناء
buildStandaloneHTML();
