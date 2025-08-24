#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
نظام إدارة الحضور والأمن الذكي - ملف التشغيل الرئيسي
Smart Attendance & Security System - Main Launcher

هذا الملف يقوم بتهيئة وتشغيل النظام الكامل:
- تهيئة قاعدة البيانات SQLite3
- تشغيل Python Backend API مع التشفير المتقدم
- فحص التبعيات المطلوبة
- عرض معلومات النظام والتشغيل

الاستخدام:
python run_system.py

أو مباشرة:
python run_system.py --auto-install
"""

import os
import sys
import subprocess
import time
import sqlite3
from pathlib import Path
import datetime
import json
import random  # إضافة استيراد هنا

# إضافة مجلد backend إلى Python path
backend_path = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_path))

# متطلبات النظام
REQUIRED_PACKAGES = [
    'flask',
    'flask-cors', 
    'cryptography',
    'argon2-cffi'
]

DATABASE_PATH = Path(__file__).parent / 'database' / 'smart_attendance.db'

def print_banner():
    """عرض شعار النظام"""
    banner = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║    🛡️  نظام إدارة الحضور والأمن الذكي - الإصدار المتقدم 2.0                ║
║    🔐 Smart Attendance & Security System - Advanced Edition 2.0              ║
║                                                                              ║
║    🧠 مدعوم بالذكاء الاصطناعي | AI-Powered                                  ║
║    🛡️  التشفير العسكري | Military-Grade Encryption                         ║
║    ⚡ أداء عالي | High Performance                                          ║
║    🔒 أمان متقدم | Advanced Security                                        ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_python_version():
    """التحقق من إصدار Python"""
    print("🔍 فحص إصدار Python...")
    if sys.version_info < (3, 8):
        print("❌ خطأ: يتطلب النظام Python 3.8 أو أحدث")
        print(f"   الإصدار الحالي: {sys.version}")
        return False
    
    print(f"✅ إصدار Python مناسب: {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def install_package(package):
    """تثبيت حزمة Python"""
    try:
        print(f"📦 تثبيت {package}...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', package], 
                            stdout=subprocess.DEVNULL, 
                            stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        print(f"❌ فشل في تثبيت {package}")
        return False

def check_dependencies(auto_install=False):
    """فحص وتثبيت التبعيات المطلوبة"""
    print("\n🔍 فحص التبعيات المطلوبة...")
    
    missing_packages = []
    
    for package in REQUIRED_PACKAGES:
        try:
            if package == 'flask-cors':
                import flask_cors
            elif package == 'argon2-cffi':
                import argon2
            else:
                __import__(package)
            print(f"✅ {package}: متوفر")
        except ImportError:
            print(f"❌ {package}: غير متوفر")
            missing_packages.append(package)
    
    if missing_packages:
        if auto_install:
            print(f"\n📦 تثبيت الحزم المفقودة: {', '.join(missing_packages)}")
            success = True
            for package in missing_packages:
                if not install_package(package):
                    success = False
            
            if not success:
                print("❌ فشل في تثبيت بعض الحزم")
                return False
            
            print("✅ تم تثبيت جميع الحزم بنجاح")
        else:
            print(f"\n❌ الحزم المفقودة: {', '.join(missing_packages)}")
            print("💡 لتثبيت الحزم المفقودة تلقائياً:")
            print("   python run_system.py --auto-install")
            print("\n💡 أو يمكنك تثبيتها يدوياً:")
            for package in missing_packages:
                print(f"   pip install {package}")
            return False
    
    print("✅ جميع التبعيات متوفرة")
    return True

def create_directories():
    """إنشاء المجلدات المطلوبة"""
    print("\n📁 إنشاء المجلدات...")
    
    directories = [
        'database',
        'backend',
        'logs',
        'backups'
    ]
    
    for directory in directories:
        dir_path = Path(__file__).parent / directory
        dir_path.mkdir(exist_ok=True)
        print(f"✅ {directory}: جاهز")

def initialize_database():
    """تهيئة قاعدة البيانات"""
    print(f"\n🗄️  تهيئة قاعدة البيانات: {DATABASE_PATH}")
    
    if DATABASE_PATH.exists():
        print("✅ قاعدة البيانات موجودة مسبقاً")
        return True
    
    try:
        # إنشاء قاعدة البيانات
        DATABASE_PATH.parent.mkdir(exist_ok=True)
        
        conn = sqlite3.connect(DATABASE_PATH)
        
        # إنشاء الجداول
        print("📋 إنشاء جداول قاعدة البيانات...")
        
        # جدول الموظفين
        conn.execute('''
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                department TEXT,
                position TEXT,
                phone TEXT,
                email TEXT,
                face_encoding TEXT,
                fingerprint_hash TEXT,
                is_active BOOLEAN DEFAULT 1,
                employee_token TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # جدول الحضور
        conn.execute('''
            CREATE TABLE IF NOT EXISTS attendance_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT NOT NULL,
                entry_type TEXT CHECK(entry_type IN ('check_in', 'check_out')) NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                recognition_method TEXT CHECK(recognition_method IN ('face', 'fingerprint', 'card', 'manual')) NOT NULL,
                confidence_score REAL DEFAULT 0.0,
                location TEXT DEFAULT 'المدخل الرئيسي',
                device_id TEXT,
                is_anomaly BOOLEAN DEFAULT 0,
                notes TEXT,
                session_token TEXT,
                FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
            )
        ''')
        
        # جدول الزوار
        conn.execute('''
            CREATE TABLE IF NOT EXISTS visitors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visitor_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                company TEXT,
                phone TEXT,
                email TEXT,
                purpose TEXT,
                host_employee_id TEXT,
                status TEXT CHECK(status IN ('pending', 'approved', 'checked_in', 'checked_out', 'rejected')) DEFAULT 'pending',
                check_in_time DATETIME,
                check_out_time DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (host_employee_id) REFERENCES employees (employee_id)
            )
        ''')
        
        # جدول الأحداث الأمنية
        conn.execute('''
            CREATE TABLE IF NOT EXISTS security_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
                location TEXT,
                description TEXT,
                related_person_id TEXT,
                resolved BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                resolved_at DATETIME
            )
        ''')
        
        # جدول سجل الأنشطة
        conn.execute('''
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                action TEXT NOT NULL,
                target_type TEXT,
                target_id TEXT,
                details TEXT,
                ip_address TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # جدول الخريطة الحرارية
        conn.execute('''
            CREATE TABLE IF NOT EXISTS heatmap_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location TEXT NOT NULL,
                hour INTEGER CHECK(hour >= 0 AND hour <= 23),
                day_of_week INTEGER CHECK(day_of_week >= 0 AND day_of_week <= 6),
                person_count INTEGER DEFAULT 0,
                movement_intensity REAL DEFAULT 0.0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # جدول البيانات الحيوية (إضافي)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS biometric_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT NOT NULL,
                biometric_type TEXT CHECK(biometric_type IN ('face', 'fingerprint')) NOT NULL,
                encrypted_data TEXT NOT NULL,
                encryption_version TEXT DEFAULT '2.0.0',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(employee_id, biometric_type),
                FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
            )
        ''')
        
        # جدول إعدادات النظام
        conn.execute('''
            CREATE TABLE IF NOT EXISTS system_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT UNIQUE NOT NULL,
                setting_value TEXT,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # إدراج بيانات تجريبية
        print("🎲 إدراج بيانات تجريبية...")
        
        # موظفين تجريبيين
        sample_employees = [
            ('EMP001', 'أحمد محمد علي', 'تقنية المعلومات', 'مطور برمجيات', '966501234567', 'ahmed@company.com'),
            ('EMP002', 'فاطمة أحمد', 'الموارد البشرية', 'مدير الموارد البشرية', '966502345678', 'fatima@company.com'),
            ('EMP003', 'محمد عبدالله', 'المالية', 'محاسب', '966503456789', 'mohammed@company.com'),
            ('EMP004', 'نورا سالم', 'التسويق', 'مسؤولة تسويق', '966504567890', 'nora@company.com'),
            ('EMP005', 'خالد يوسف', 'الأمان', 'مسؤول أمن', '966505678901', 'khaled@company.com')
        ]
        
        for emp in sample_employees:
            conn.execute('''
                INSERT OR IGNORE INTO employees 
                (employee_id, name, department, position, phone, email)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', emp)
        
        # بيانات حضور تجريبية
        base_date = datetime.datetime.now() - datetime.timedelta(days=7)
        for day in range(7):
            for emp_id in ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005']:
                if day < 5:  # أيام العمل فقط
                    # دخول
                    check_in_time = base_date + datetime.timedelta(days=day, hours=8, minutes=int(30*random.random()))
                    conn.execute('''
                        INSERT INTO attendance_logs 
                        (employee_id, entry_type, timestamp, recognition_method, confidence_score)
                        VALUES (?, 'check_in', ?, 'face', ?)
                    ''', (emp_id, check_in_time.isoformat(), 0.95 + 0.04*random.random()))
                    
                    # خروج
                    check_out_time = check_in_time + datetime.timedelta(hours=8, minutes=int(60*random.random()))
                    conn.execute('''
                        INSERT INTO attendance_logs 
                        (employee_id, entry_type, timestamp, recognition_method, confidence_score)
                        VALUES (?, 'check_out', ?, 'face', ?)
                    ''', (emp_id, check_out_time.isoformat(), 0.95 + 0.04*random.random()))
        
        # بيانات خريطة حرارية تجريبية
        for location in ['المدخل الرئيسي', 'المدخل الخلفي', 'الكافتيريا', 'قاعة الاجتماعات']:
            for hour in range(6, 23):  # 6 صباحاً إلى 10 مساءً
                for day_of_week in range(7):
                    person_count = max(0, int(20 * random.random() * (1 if day_of_week < 5 else 0.3)))
                    movement_intensity = random.random()
                    
                    conn.execute('''
                        INSERT INTO heatmap_data 
                        (location, hour, day_of_week, person_count, movement_intensity)
                        VALUES (?, ?, ?, ?, ?)
                    ''', (location, hour, day_of_week, person_count, movement_intensity))
        
        # إعدادات النظام الافتراضية
        default_settings = [
            ('system_name', 'نظام إدارة الحضور الذكي', 'اسم النظام'),
            ('system_version', '2.0.0 Advanced', 'إصدار النظام'),
            ('encryption_enabled', 'true', 'تفعيل التشفير'),
            ('ai_enabled', 'true', 'تفعيل الذكاء الاصطناعي'),
            ('work_start_time', '08:00', 'وقت بداية العمل'),
            ('work_end_time', '17:00', 'وقت انتهاء العمل'),
            ('anomaly_detection', 'true', 'كشف الحالات الشاذة'),
            ('backup_enabled', 'true', 'تفعيل النسخ الاحتياطي')
        ]
        
        for setting in default_settings:
            conn.execute('''
                INSERT OR IGNORE INTO system_settings 
                (setting_key, setting_value, description)
                VALUES (?, ?, ?)
            ''', setting)
        
        conn.commit()
        conn.close()
        
        print("✅ تم إنشاء قاعدة البيانات بنجاح")
        print(f"📁 موقع قاعدة البيانات: {DATABASE_PATH}")
        return True
        
    except Exception as e:
        print(f"❌ خطأ في إنشاء قاعدة البيا��ات: {e}")
        return False

def test_encryption_engine():
    """اختبار محرك التشفير"""
    print("\n🔐 اختبار محرك التشفير المتقدم...")
    
    try:
        from encryption_engine import AdvancedEncryptionEngine, test_encryption_engine
        
        # اختبار شامل
        if test_encryption_engine():
            print("✅ محرك التشفير يعمل بشكل مثالي")
            return True
        else:
            print("❌ فشل في اختبار محرك التشفير")
            return False
            
    except ImportError as e:
        print(f"❌ لا يمكن استيراد محرك التشفير: {e}")
        return False
    except Exception as e:
        print(f"❌ خطأ في اختبار التشفير: {e}")
        return False

def display_system_info():
    """عرض معلومات النظام"""
    print("\n" + "="*80)
    print("🖥️  معلومات النظام")
    print("="*80)
    
    print(f"🐍 Python: {sys.version}")
    print(f"💻 النظام: {os.name}")
    print(f"📁 مجلد العمل: {Path.cwd()}")
    print(f"🗄️  قاعدة البيانات: {DATABASE_PATH}")
    
    # معلومات التشفير
    try:
        from encryption_engine import AdvancedEncryptionEngine
        engine = AdvancedEncryptionEngine()
        info = engine.get_encryption_info()
        
        print("\n🔐 معلومات التشفير:")
        print(f"   الخوارزميات: {', '.join(info['algorithms']['symmetric'])}")
        print(f"   الأمان: Military Grade")
        print(f"   الامتثال: {', '.join(info['compliance'])}")
        
    except:
        print("\n⚠️  محرك التشفير غير متاح")

def start_backend_server():
    """تشغيل خادم Backend"""
    print("\n🚀 بدء تشغيل خادم Python Backend...")
    print("🌐 العنوان: http://localhost:5000")
    print("📋 لعرض API: http://localhost:5000/api/system/status")
    print("🔧 لإيقاف الخادم: اضغط Ctrl+C")
    print("="*80)
    
    try:
        # تشغيل تطبيق Flask
        os.chdir(backend_path.parent)
        from backend.app import app
        app.run(host='0.0.0.0', port=5000, debug=False)
        
    except KeyboardInterrupt:
        print("\n🛑 تم إيقاف النظام بواسطة المستخدم")
    except Exception as e:
        print(f"\n❌ خطأ في تشغيل الخادم: {e}")

def main():
    """الوظيفة الرئيسية"""
    
    # معالجة الحجج
    auto_install = '--auto-install' in sys.argv
    init_only = '--init-only' in sys.argv
    
    print_banner()
    
    # فحص النظام
    if not check_python_version():
        sys.exit(1)
    
    if not check_dependencies(auto_install):
        sys.exit(1)
    
    # إنشاء المجلدات
    create_directories()
    
    # تهيئة قاعدة البيانات
    if not initialize_database():
        print("❌ فشل في تهيئة قاعدة البيانات")
        sys.exit(1)
    
    # إذا كان init_only، أنهي هنا
    if init_only:
        print("\n✅ تهيئة قاعدة البيانات اكتملت بنجاح!")
        print(f"📁 موقع قاعدة البيانات: {DATABASE_PATH}")
        sys.exit(0)
    
    # اختبار التشفير
    if not test_encryption_engine():
        print("⚠️  تحذير: محرك التشفير لا يعمل بشكل صحيح")
        response = input("هل تريد المتابعة؟ (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # عرض معلومات النظام
    display_system_info()
    
    print("\n✅ النظام جاهز للتشغيل!")
    print("\n📋 التعليمات:")
    print("1. تم تشغيل Python Backend API على المنفذ 5000")
    print("2. قم بتشغيل Frontend React على المنفذ 3000")
    print("3. افتح المتصفح على: http://localhost:3000")
    print("\n💡 نصائح:")
    print("- تأكد من تشغيل Frontend بأمر: npm run dev")
    print("- يمكن الوصول لـ API مباشرة على: http://localhost:5000")
    
    # سؤال المستخدم
    response = input("\n❓ هل تريد بدء تشغيل الخادم الآن؟ (y/n): ")
    if response.lower() == 'y':
        start_backend_server()
    else:
        print("\n📝 لتشغيل الخادم لاحقاً:")
        print("   python backend/app.py")
        print("\n🎯 النظام جاهز للاستخدام!")

if __name__ == '__main__':
    main()