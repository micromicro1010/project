import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import {
  Camera,
  User,
  Shield,
  CheckCircle,
  AlertTriangle,
  Activity,
  Brain,
  Fingerprint,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface BiometricData {
  faceMatch: number;
  livenessScore: number;
  qualityScore: number;
  antispoofing: boolean;
  confidence: number;
}

interface RecognitionResult {
  success: boolean;
  userId?: string;
  userName?: string;
  matchConfidence: number;
  biometricData: BiometricData;
  timestamp: Date;
  processingTime: number;
}

export function AIBiometric() {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<RecognitionResult | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [aiStatus, setAiStatus] = useState<'ready' | 'initializing' | 'error'>('ready');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [detectionMode, setDetectionMode] = useState<'face' | 'fingerprint' | 'hybrid'>('face');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // محاكاة تشغيل الكاميرا
  const startCamera = useCallback(async () => {
    try {
      setAiStatus('initializing');
      
      // محاكاة تهيئة الكاميرا
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setAiStatus('ready');
      setIsActive(true);
      toast.success('تم تفعيل نظام التعرف الحيوي بنجاح');
      
    } catch (error) {
      console.error('خطأ في تشغيل الكاميرا:', error);
      setAiStatus('error');
      toast.error('فشل في تشغيل الكاميرا. تحقق من الأذونات.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsActive(false);
    setCurrentResult(null);
    toast.info('تم إيقاف نظام التعرف الحيوي');
  }, [cameraStream]);

  // محاكاة عملية التعرف بالذكاء الاصطناعي
  const performRecognition = useCallback(async () => {
    if (!isActive || isProcessing) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // محاكاة مراحل المعالجة
      const stages = [
        'جاري كشف الوجه...',
        'تحليل الخصائص الحيوية...',
        'فحص الحيوية والوجود...',
        'مطابقة البيانات...',
        'التحقق من الأمان...'
      ];
      
      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setProcessingProgress((i + 1) * 20);
        toast.loading(stages[i], { id: 'processing' });
      }
      
      // محاكاة نتائج الذكاء الاصطناعي
      const mockResults: RecognitionResult[] = [
        {
          success: true,
          userId: 'EMP001',
          userName: 'أحمد محمد علي',
          matchConfidence: 98.7,
          biometricData: {
            faceMatch: 98.7,
            livenessScore: 96.2,
            qualityScore: 94.8,
            antispoofing: true,
            confidence: 98.7
          },
          timestamp: new Date(),
          processingTime: 2.1
        },
        {
          success: true,
          userId: 'EMP002',
          userName: 'فاطمة سالم احمد',
          matchConfidence: 97.3,
          biometricData: {
            faceMatch: 97.3,
            livenessScore: 95.8,
            qualityScore: 96.1,
            antispoofing: true,
            confidence: 97.3
          },
          timestamp: new Date(),
          processingTime: 1.8
        },
        {
          success: false,
          matchConfidence: 23.4,
          biometricData: {
            faceMatch: 23.4,
            livenessScore: 89.1,
            qualityScore: 78.5,
            antispoofing: true,
            confidence: 23.4
          },
          timestamp: new Date(),
          processingTime: 2.3
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setCurrentResult(randomResult);
      
      toast.dismiss('processing');
      
      if (randomResult.success) {
        toast.success(`تم التعرف بنجاح على ${randomResult.userName}`, {
          description: `دقة التطابق: ${randomResult.matchConfidence}%`
        });
      } else {
        toast.error('لم يتم التعرف على الشخص', {
          description: 'تأكد من وضوح الصورة والإضاءة المناسبة'
        });
      }
      
    } catch (error) {
      console.error('خطأ في عملية التعرف:', error);
      toast.dismiss('processing');
      toast.error('حدث خطأ في عملية التعرف');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [isActive, isProcessing]);

  // تنظيف الموارد عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const getStatusColor = () => {
    switch (aiStatus) {
      case 'ready': return 'text-green-600';
      case 'initializing': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (aiStatus) {
      case 'ready': return <CheckCircle className="h-5 w-5" />;
      case 'initializing': return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'error': return <AlertTriangle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* العنوان الرئيسي */}
      <div className="text-right">
        <h1 className="text-2xl font-semibold flex items-center justify-end gap-2 mb-2">
          <Brain className="h-8 w-8 text-blue-600" />
          نظام التعرف الحيوي بالذكاء الاصطناعي
        </h1>
        <p className="text-muted-foreground">
          تقنية متقدمة للتحقق من الهوية بدقة 99.1% في أقل من 3 ثوانٍ
        </p>
      </div>

      {/* شريط الحالة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={isActive ? stopCamera : startCamera}
                disabled={aiStatus === 'initializing'}
                className="gap-2"
              >
                {isActive ? (
                  <>
                    <Lock className="h-4 w-4" />
                    إيقاف النظام
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" />
                    تفعيل النظام
                  </>
                )}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant={detectionMode === 'face' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDetectionMode('face')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  الوجه
                </Button>
                <Button
                  variant={detectionMode === 'fingerprint' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDetectionMode('fingerprint')}
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  البصمة
                </Button>
                <Button
                  variant={detectionMode === 'hybrid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDetectionMode('hybrid')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  هجين
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-medium">حالة النظام</p>
                <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="text-sm">
                    {aiStatus === 'ready' ? 'جاهز' : 
                     aiStatus === 'initializing' ? 'جاري التهيئة' : 'خطأ'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* منطقة الكاميرا والتعرف */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Camera className="h-5 w-5" />
              كاميرا التعرف الحيوي
            </CardTitle>
            <CardDescription className="text-right">
              ضع وجهك أمام الكاميرا للتعرف التلقائي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video overflow-hidden">
              {isActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                  />
                  
                  {/* إطار التعرف */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-64 h-64 border-4 border-blue-500 rounded-full animate-pulse opacity-50"></div>
                      <div className="absolute inset-0 w-64 h-64 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
                    </div>
                  </div>
                  
                  {/* معلومات المعالجة */}
                  {isProcessing && (
                    <div className="absolute top-4 left-4 right-4">
                      <div className="bg-black/70 text-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="text-sm">جاري المعالجة...</span>
                        </div>
                        <Progress value={processingProgress} className="h-2" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <Camera className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-center">
                    {aiStatus === 'error' 
                      ? 'فشل في تشغيل الكاميرا' 
                      : 'انقر على "تفعيل النظام" لبدء التعرف'
                    }
                  </p>
                </div>
              )}
            </div>
            
            {isActive && (
              <div className="flex gap-2">
                <Button 
                  onClick={performRecognition} 
                  disabled={isProcessing || aiStatus !== 'ready'}
                  className="flex-1 gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      تحليل وتعرف
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* نتائج التعرف */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Activity className="h-5 w-5" />
              نتائج التحليل
            </CardTitle>
            <CardDescription className="text-right">
              تفاصيل عملية التعرف والتحليل الحيوي
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentResult ? (
              <div className="space-y-4">
                {/* النتيجة الرئيسية */}
                <Alert className={currentResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <div className="flex items-center gap-2">
                    {currentResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <AlertDescription className="text-right flex-1">
                      {currentResult.success ? (
                        <div>
                          <p className="font-medium text-green-800">تم التعرف بنجاح</p>
                          <p className="text-green-700">{currentResult.userName}</p>
                          <p className="text-sm text-green-600">ID: {currentResult.userId}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-red-800">فشل في التعرف</p>
                          <p className="text-red-700">لم يتم العثور على تطابق في قاعدة البيانات</p>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>

                {/* مقاييس الأداء */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {currentResult.biometricData.faceMatch.toFixed(1)}%
                    </p>
                    <p className="text-sm text-blue-700">دقة التطابق</p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {currentResult.biometricData.livenessScore.toFixed(1)}%
                    </p>
                    <p className="text-sm text-green-700">كشف الحيوية</p>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {currentResult.biometricData.qualityScore.toFixed(1)}%
                    </p>
                    <p className="text-sm text-purple-700">جودة الصورة</p>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {currentResult.processingTime.toFixed(1)}s
                    </p>
                    <p className="text-sm text-orange-700">زمن المعالجة</p>
                  </div>
                </div>

                {/* معلومات إضافية */}
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-between items-center">
                    <Badge variant={currentResult.biometricData.antispoofing ? 'default' : 'destructive'}>
                      {currentResult.biometricData.antispoofing ? 'آمن' : 'غير آمن'}
                    </Badge>
                    <span>مكافحة التزوير:</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-mono">
                      {currentResult.timestamp.toLocaleTimeString('ar-SA')}
                    </span>
                    <span>وقت التعرف:</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      {detectionMode === 'face' ? 'تعرف على الوجه' : 
                       detectionMode === 'fingerprint' ? 'تعرف بالبصمة' : 'تعرف هجين'}
                    </Badge>
                    <span>نوع التعرف:</span>
                  </div>
                </div>

                {/* شريط الثقة */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {currentResult.biometricData.confidence.toFixed(1)}%
                    </span>
                    <span className="text-sm text-right">مستوى الثقة الإجمالي</span>
                  </div>
                  <Progress 
                    value={currentResult.biometricData.confidence} 
                    className="h-3"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد نتائج تحليل بعد</p>
                <p className="text-sm">قم بتفعيل النظام وبدء عملية التعرف</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات النظام */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">إحصائيات الأداء</CardTitle>
          <CardDescription className="text-right">
            مقاييس الأداء والدقة للنظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">99.1%</p>
              <p className="text-sm text-muted-foreground">معدل الدقة</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">2.3s</p>
              <p className="text-sm text-muted-foreground">متوسط وقت المعالجة</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">0.01%</p>
              <p className="text-sm text-muted-foreground">معدل الخطأ</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">1,247</p>
              <p className="text-sm text-muted-foreground">عمليات اليوم</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}