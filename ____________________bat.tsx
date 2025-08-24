@echo off
chcp 65001 >nul
title نظام الحضور والأمن الذكي - التثبيت الكامل
color 0B

echo.
echo ████████╗██╗  ██╗██████╗ ███████╗███████╗    █████╗ ██╗
echo ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔════╝   ██╔══██╗██║
echo    ██║   ███████║██████╔╝█████╗  █████╗     ███████║██║
echo    ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══╝     ██╔══██║██║
echo    ██║   ██║  ██║██║  ██║███████╗███████╗██╗██║  ██║██║
echo    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝
echo.
echo ================================================
echo      نظام إدارة الحضور والأمن الذكي v2.0
echo      تثبيت شامل مع قاعدة البيانات والذكاء الاصطناعي
echo ================================================
echo.

:: التحقق من Python
echo [1/6] فحص Python...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python غير مثبت!
    echo 📥 يرجى تثبيت Python من: https://python.org
    echo    تأكد من إضافة Python إلى PATH
    pause
    exit /b 1
)
echo ✅ Python مثبت بنجاح

:: التحقق من Node.js
echo.
echo [2/6] فحص Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js غير مثبت!
    echo 📥 يرجى تثبيت Node.js من: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js مثبت بنجاح

:: تثبيت مكتبات Python
echo.
echo [3/6] تثبيت مكتبات Python للذكاء الاصطناعي...
cd backend
if not exist requirements.txt (
    echo ❌ ملف requirements.txt غير موجود!
    pause
    exit /b 1
)

echo 🔧 تثبيت المكتبات الأساسية...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ بعض المكتبات فشلت في التثبيت، جاري المحاولة بطريقة بديلة...
    python -m pip install flask flask-cors opencv-python numpy scikit-learn pandas pillow
)

cd..
echo ✅ تم تثبيت مكتبات Python

:: إنشاء قاعدة البيانات
echo.
echo [4/6] إنشاء قاعدة البيانات المحلية...
if not exist database mkdir database
python database/init_database.py
if %ERRORLEVEL% NEQ 0 (
    echo ❌ فشل في إنشاء قاعدة البيانات!
    pause
    exit /b 1
)
echo ✅ تم إنشاء قاعدة البيانات بنجاح

:: تثبيت مكتبات Node.js
echo.
echo [5/6] تثبيت مكتبات الواجهة الأمامية...
if exist node_modules (
    echo 🧹 حذف المكتبات القديمة...
    rmdir /s /q node_modules
)

if exist package-lock.json del package-lock.json

echo 📦 تثبيت المكتبات...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ فشل في تثبيت مكتبات Node.js!
    echo 🔄 جاري المحاولة مرة أخرى...
    npm install --force
)
echo ✅ تم تثبيت مكتبات الواجهة الأمامية

:: إنشاء ملفات التشغيل
echo.
echo [6/6] إنشاء ملفات التشغيل السريع...

:: ملف تشغيل النظام الكامل
echo @echo off > تشغيل_النظام_الكامل.bat
echo chcp 65001 ^>nul >> تشغيل_النظام_الكامل.bat
echo title نظام الحضور والأمن الذكي - تشغيل >> تشغيل_النظام_الكامل.bat
echo color 0B >> تشغيل_النظام_الكامل.bat
echo. >> تشغيل_النظام_الكامل.bat
echo echo ================================================ >> تشغيل_النظام_الكامل.bat
echo echo      🚀 تشغيل نظام الحضور والأمن الذكي >> تشغيل_النظام_الكامل.bat
echo echo ================================================ >> تشغيل_النظام_الكامل.bat
echo echo. >> تشغيل_النظام_الكامل.bat
echo echo [1/3] بدء تشغيل قاعدة البيانات والذكاء الاصطناعي... >> تشغيل_النظام_الكامل.bat
echo start "خادم الذكاء الاصطناعي" /min cmd /c "cd backend && python app.py" >> تشغيل_النظام_الكامل.bat
echo timeout /t 3 /nobreak ^>nul >> تشغيل_النظام_الكامل.bat
echo echo ✅ تم تشغيل خادم الذكاء الاصطناعي >> تشغيل_النظام_الكامل.bat
echo echo. >> تشغيل_النظام_الكامل.bat
echo echo [2/3] بدء تشغيل الواجهة الأمامية... >> تشغيل_النظام_الكامل.bat
echo start "واجهة النظام" cmd /c "npm run dev" >> تشغيل_النظام_الكامل.bat
echo timeout /t 5 /nobreak ^>nul >> تشغيل_النظام_الكامل.bat
echo echo ✅ تم تشغيل واجهة النظام >> تشغيل_النظام_الكامل.bat
echo echo. >> تشغيل_النظام_الكامل.bat
echo echo [3/3] فتح النظام في المتصفح... >> تشغيل_النظام_الكامل.bat
echo timeout /t 3 /nobreak ^>nul >> تشغيل_النظام_الكامل.bat
echo start http://localhost:3000 >> تشغيل_النظام_الكامل.bat
echo echo. >> تشغيل_النظام_الكامل.bat
echo echo ================================================ >> تشغيل_النظام_الكامل.bat
echo echo ✅ النظام يعمل الآن! >> تشغيل_النظام_الكامل.bat
echo echo 🌐 الواجهة الأمامية: http://localhost:3000 >> تشغيل_النظام_الكامل.bat
echo echo 🤖 خادم الذكاء الاصطناعي: http://localhost:5000 >> تشغيل_النظام_الكامل.bat
echo echo 📊 قاعدة البيانات: SQLite محلية >> تشغيل_النظام_الكامل.bat
echo echo. >> تشغيل_النظام_الكامل.bat
echo echo 💡 لإيقاف النظام: أغلق هذه النافذة >> تشغيل_النظام_الكامل.bat
echo echo ================================================ >> تشغيل_النظام_الكامل.bat
echo pause >> تشغيل_النظام_الكامل.bat

:: ملف تشغيل سريع
echo @echo off > تشغيل_سريع.bat
echo start "نظام الحضور الذكي" cmd /c "تشغيل_النظام_الكامل.bat" >> تشغيل_سريع.bat

echo ✅ تم إنشاء ملفات التشغيل

echo.
echo ================================================
echo ✅ تم تثبيت النظام بنجاح!
echo ================================================
echo.
echo 🎉 النظام جاهز للاستخدام!
echo.
echo 📂 الملفات المهمة:
echo    • تشغيل_النظام_الكامل.bat  : تشغيل النظام كاملاً
echo    • تشغيل_سريع.bat           : تشغيل سريع
echo    • database/smart_attendance.db : قاعدة البيانات
echo    • backend/app.py             : خادم الذكاء الاصطناعي
echo.
echo 🚀 لبدء التشغيل: انقر على "تشغيل_النظام_الكامل.bat"
echo.
echo ⚡ الميزات المتاحة:
echo    ✓ قاعدة بيانات SQLite محلية
echo    ✓ ذكاء اصطناعي للتعرف الحيوي
echo    ✓ تحليل الأنماط والسلوكيات
echo    ✓ كشف الحالات الشاذة
echo    ✓ واجهة عربية متقدمة
echo    ✓ يعمل بدون إنترنت
echo.
pause