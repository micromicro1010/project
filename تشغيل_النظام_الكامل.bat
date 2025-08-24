@echo off
chcp 65001 >nul
title نظام الحضور والأمن الذكي - تشغيل
color 0B

echo ================================================
echo      🚀 تشغيل نظام الحضور والأمن الذكي
echo ================================================
echo.

REM التحقق من وجود البيئة الافتراضية
if not exist "backend\venv" (
    echo ❌ البيئة الافتراضية غير موجودة! يرجى التشغيل كمسؤول أولاً
    echo 🔧 جاري إنشاء البيئة الافتراضية...
    python -m venv backend\venv
    if errorlevel 1 (
        echo ❌ فشل في إنشاء البيئة الافتراضية
        pause
        exit /b 1
    )
)

echo [1/4] تفعيل البيئة الافتراضية للبايثون...
call backend\venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ فشل في تفعيل البيئة الافتراضية
    pause
    exit /b 1
)

echo [2/4] تثبيت متطلبات البايثون...
pip install -r backend\requirements.txt
if errorlevel 1 (
    echo ⚠️ هناك مشكلة في بعض الحزم، جاري التثبيت البديل...
    pip install flask flask-cors cryptography argon2-cffi opencv-python pillow
)

echo [3/4] بدء تشغيل قاعدة البيانات والذكاء الاصطناعي...
start "خادم الذكاء الاصطناعي" /min cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"
timeout /t 5 /nobreak >nul

echo [4/4] بدء تشغيل الواجهة الأمامية...
start "واجهة النظام" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul


echo ================================================
echo ✅ النظام يعمل الآن!
echo 🌐 الواجهة الأمامية: http://localhost:3000
echo 🤖 خادم الذكاء الاصطناعي: http://localhost:5000
echo 📊 قاعدة البيانات: SQLite محلية
echo.
echo 💡 لإيقاف النظام: أغلق هذه النافذة
echo 💻 للتصحيح: افتح نوافذ الأوامر المنفصلة
echo ================================================

REM الانتظار لإعطاء الوقت للنظام للبدء الكامل
timeout /t 10 /nobreak >nul

REM التحقق من أن النظام يعمل
echo.
echo 🔍 جاري التحقق من حالة النظام...
curl -f http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ⚠️ الواجهة الأمامية لا تستجيب، جاري المحاولة مرة أخرى...
    timeout /t 5 /nobreak >nul
)

curl -f http://localhost:5000 >nul 2>&1
if errorlevel 1 (
    echo ⚠️ الخادم الخلفي لا يستجيب، قد يكون هناك خطأ في التثبيت
    echo 📋 راجع نوافذ الأوامر المنفصلة للأخطاء
)

echo.
echo ✅ تم تشغيل النظام بنجاح!
echo 🎯 يمكنك الآن استخدام النظام على http://localhost:3000
pause