import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  Scan,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Activity,
  Loader2,
  Camera,
  Smartphone,
  Globe,
  Settings
} from 'lucide-react';
import { useAuth, type LoginCredentials } from '../lib/AuthContext';
import { useLanguage, LANGUAGE_OPTIONS } from '../lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { login, loading } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    method: 'password',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    ai_engine: 'online',
    security: 'online',
    biometric: 'online'
  });

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus({
        ai_engine: Math.random() > 0.1 ? 'online' : 'maintenance',
        security: 'online',
        biometric: Math.random() > 0.05 ? 'online' : 'calibrating'
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Demo credentials info
  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'مدير عام' },
    { username: 'manager', password: 'manager123', role: 'مدير قسم' },
    { username: 'employee', password: 'emp123', role: 'موظف' },
    { username: 'biometric', password: 'bio123', role: 'دخول حيوي' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password) {
      setError(t('auth.login_error') + ': جميع الحقول مطلوبة');
      return;
    }

    try {
      const success = await login(credentials);
      if (success) {
        toast.success(t('auth.login_success'));
        onLoginSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || t('auth.login_error'));
      toast.error(err.message || t('auth.login_error'));
    }
  };

  const handleBiometricLogin = async (method: 'face' | 'fingerprint') => {
    setIsScanning(true);
    setBiometricProgress(0);
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setBiometricProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    try {
      // Simulate biometric scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use biometric credentials
      const biometricCredentials: LoginCredentials = {
        username: 'biometric',
        password: 'bio123',
        method: method,
        rememberMe: credentials.rememberMe
      };

      const success = await login(biometricCredentials);
      if (success) {
        toast.success(`تم تسجيل الدخول بـ${method === 'face' ? 'التعرف على الوجه' : 'البصمة'} بنجاح`);
        onLoginSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || 'فشل في التعرف الحيوي');
      toast.error(err.message || 'فشل في التعرف الحيوي');
    } finally {
      setIsScanning(false);
      setBiometricProgress(0);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">متصل</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">صيانة</Badge>;
      case 'calibrating':
        return <Badge className="bg-blue-100 text-blue-800">معايرة</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel - System Info & Branding */}
        <div className="lg:col-span-1 space-y-6">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-right"
          >
            <div className="flex items-center justify-center lg:justify-end gap-3 mb-6">
              <Shield className="h-12 w-12 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  نظام الحضور الذكي
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  النسخة المتقدمة 2.0
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-center lg:justify-end gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span>مدعوم بالذكاء الاصطناعي</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>تشفير عسكري متقدم</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span>أداء فائق السرعة</span>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center justify-end gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  حالة النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  {getStatusBadge(systemStatus.ai_engine)}
                  <span className="text-sm">محرك الذكاء الاصطناعي</span>
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(systemStatus.security)}
                  <span className="text-sm">نظام الأمان</span>
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(systemStatus.biometric)}
                  <span className="text-sm">التعرف الحيوي</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-right text-sm">بيانات تجريبية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  {demoCredentials.map((cred, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-right">
                      <Badge variant="outline" className="text-xs">
                        {cred.role}
                      </Badge>
                      <div>
                        <div>{cred.username}</div>
                        <div className="text-gray-500">{cred.password}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Center Panel - Login Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span>{option.flag}</span>
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-right">
                    <CardTitle className="text-2xl flex items-center justify-end gap-2">
                      <User className="h-6 w-6 text-blue-600" />
                      {t('auth.login')}
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                      {t('auth.welcome')} - اختر طريقة تسجيل الدخول المفضلة
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="password" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="password" className="gap-2">
                      <Lock className="h-4 w-4" />
                      كلمة المرور
                    </TabsTrigger>
                    <TabsTrigger value="biometric" className="gap-2">
                      <Fingerprint className="h-4 w-4" />
                      حيوي ذكي
                    </TabsTrigger>
                  </TabsList>

                  {/* Password Login */}
                  <TabsContent value="password" className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-right block">
                          {t('auth.username')}
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          value={credentials.username}
                          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                          className="text-right"
                          placeholder="أدخل اسم المستخدم"
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-right block">
                          {t('auth.password')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.password}
                            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                            className="text-right pr-10"
                            placeholder="أدخل كلمة المرور"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="link"
                          className="text-blue-600 p-0 h-auto"
                        >
                          {t('auth.forgot_password')}
                        </Button>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id="remember"
                            checked={credentials.rememberMe}
                            onCheckedChange={(checked) => 
                              setCredentials(prev => ({ ...prev, rememberMe: !!checked }))
                            }
                          />
                          <Label htmlFor="remember" className="text-sm">
                            {t('auth.remember')}
                          </Label>
                        </div>
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button 
                        type="submit" 
                        className="w-full gap-2" 
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            جاري تسجيل الدخول...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            {t('auth.login')}
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Biometric Login */}
                  <TabsContent value="biometric" className="space-y-6">
                    <div className="text-center py-6">
                      <div className="space-y-6">
                        {/* Scanning Animation */}
                        <AnimatePresence>
                          {isScanning && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="space-y-4"
                            >
                              <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-blue-200 flex items-center justify-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 rounded-full border-t-4 border-blue-600"
                                />
                                <Scan className="h-12 w-12 text-blue-600" />
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">جاري المسح...</p>
                                <Progress value={biometricProgress} className="w-full max-w-xs mx-auto" />
                                <p className="text-xs text-gray-500">{biometricProgress}%</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Biometric Options */}
                        {!isScanning && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleBiometricLogin('face')}
                                variant="outline"
                                size="lg"
                                className="w-full h-32 flex flex-col gap-3"
                                disabled={loading || systemStatus.biometric !== 'online'}
                              >
                                <Camera className="h-8 w-8 text-green-600" />
                                <div className="text-center">
                                  <div className="font-semibold">التعرف على الوجه</div>
                                  <div className="text-xs text-gray-500">دقة 99.2%</div>
                                </div>
                              </Button>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleBiometricLogin('fingerprint')}
                                variant="outline"
                                size="lg"
                                className="w-full h-32 flex flex-col gap-3"
                                disabled={loading || systemStatus.biometric !== 'online'}
                              >
                                <Fingerprint className="h-8 w-8 text-blue-600" />
                                <div className="text-center">
                                  <div className="font-semibold">البصمة</div>
                                  <div className="text-xs text-gray-500">دقة 99.7%</div>
                                </div>
                              </Button>
                            </motion.div>
                          </div>
                        )}

                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          <Checkbox
                            id="biometric-remember"
                            checked={credentials.rememberMe}
                            onCheckedChange={(checked) => 
                              setCredentials(prev => ({ ...prev, rememberMe: !!checked }))
                            }
                          />
                          <Label htmlFor="biometric-remember" className="text-sm">
                            {t('auth.remember')}
                          </Label>
                        </div>

                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}