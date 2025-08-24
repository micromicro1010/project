echo [3/4] بدء تشغيل قاعدة البيانات والذكاء الاصطناعي...
start "خادم الذكاء الاصطناعي" /min cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"
timeout /t 5 /nobreak >nul

echo [4/4] بدء تشغيل الواجهة الأمامية...
start "واجهة النظام" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul

