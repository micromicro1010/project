#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
نظام إدارة الحضور والأمن الذكي - إعداد قاعدة البيانات
Smart Attendance & Security System - Database Setup
"""

import sqlite3
import hashlib
import datetime
import json
import os
from pathlib import Path

# إنشاء مجلد قاعدة البيانات إذا لم يكن موجوداً
os.makedirs('database', exist_ok=True)

DB_PATH = 'database/smart_attendance.db'

def create_database():
    """إنشاء قاعدة البيانات والجداول الأساسية"""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # جدول الموظفين
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        position TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        face_encoding TEXT,  -- تشفير الوجه
        fingerprint_hash TEXT,  -- هاش البصمة
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # جدول سجلات الحضور
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS attendance_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        entry_type TEXT NOT NULL,  -- 'check_in' or 'check_out'
        recognition_method TEXT NOT NULL,  -- 'face', 'fingerprint', 'card'
        confidence_score REAL,  -- دقة التعرف
        location TEXT,  -- موقع الدخول
        device_id TEXT,
        is_anomaly BOOLEAN DEFAULT 0,  -- كشف الحالات الشاذة
        notes TEXT,
        FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
    )
    ''')
    
    # جدول الزوار
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        company TEXT,
        phone TEXT,
        email TEXT,
        purpose TEXT NOT NULL,
        host_employee_id TEXT,
        entry_time TIMESTAMP,
        exit_time TIMESTAMP,
        status TEXT DEFAULT 'pending',  -- 'pending', 'approved', 'inside', 'exited'
        photo_path TEXT,
        documents TEXT,  -- JSON للمستندات
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (host_employee_id) REFERENCES employees (employee_id)
    )
    ''')
    
    # جدول الأحداث الأمنية
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS security_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,  -- 'unauthorized_access', 'anomaly_detected', 'system_alert'
        severity TEXT NOT NULL,  -- 'low', 'medium', 'high', 'critical'
        location TEXT,
        description TEXT NOT NULL,
        related_person_id TEXT,
        resolved BOOLEAN DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        resolved_by TEXT,
        metadata TEXT  -- JSON للبيانات الإضافية
    )
    ''')
    
    # جدول تحليل الأنماط
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS pattern_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT NOT NULL,
        pattern_type TEXT NOT NULL,  -- 'daily', 'weekly', 'monthly'
        analysis_date DATE NOT NULL,
        avg_check_in_time TIME,
        avg_check_out_time TIME,
        total_hours REAL,
        attendance_rate REAL,
        anomaly_score REAL,
        insights TEXT,  -- JSON للتحليلات المفصلة
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
    )
    ''')
    
    # جدول إعدادات النظام
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # جدول الخرائط الحرارية
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS heatmap_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        person_count INTEGER DEFAULT 0,
        movement_intensity REAL DEFAULT 0,
        hour INTEGER,
        day_of_week INTEGER,
        metadata TEXT  -- JSON لبيانات إضافية
    )
    ''')
    
    # جدول تسجيل الأنشطة
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        action TEXT NOT NULL,
        target_type TEXT,  -- 'employee', 'visitor', 'system'
        target_id TEXT,
        details TEXT,  -- JSON للتفاصيل
        ip_address TEXT,
        user_agent TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    
    # إدراج الإعدادات الافتراضية
    insert_default_settings(cursor)
    
    # إدراج بيانات تجريبية
    insert_sample_data(cursor)
    
    conn.commit()
    conn.close()
    
    print("✅ تم إنشاء قاعدة البيانات بنجاح!")

def insert_default_settings(cursor):
    """إدراج الإعدادات الافتراضية"""
    
    default_settings = [
        ('ai_face_threshold', '0.85', 'حد الثقة للتعرف على الوجه'),
        ('ai_fingerprint_threshold', '0.90', 'حد الثقة للتعرف على البصمة'),
        ('working_hours_start', '08:00', 'بداية الدوام الرسمي'),
        ('working_hours_end', '17:00', 'نهاية الدوام الرسمي'),
        ('anomaly_detection_enabled', 'true', 'تفعيل كشف الحالات الشاذة'),
        ('auto_backup_enabled', 'true', 'تفعيل النسخ الاحتياطي التلقائي'),
        ('max_visitors_per_day', '100', 'الحد الأقصى للزوار يومياً'),
        ('system_language', 'ar', 'لغة النظام'),
        ('timezone', 'Asia/Riyadh', 'المنطقة الزمنية'),
        ('ai_model_version', '2.0.0', 'إصدار نموذج الذكاء الاصطناعي')
    ]
    
    for setting in default_settings:
        cursor.execute('''
        INSERT OR IGNORE INTO system_settings (setting_key, setting_value, description)
        VALUES (?, ?, ?)
        ''', setting)

def insert_sample_data(cursor):
    """إدراج بيانات تجريبية"""
    
    # موظفين تجريبيين
    sample_employees = [
        ('EMP001', 'أحمد محمد علي', 'تقنية المعلومات', 'مطور برمجيات', '966501234567', 'ahmed@company.com'),
        ('EMP002', 'فاطمة أحمد', 'الموارد البشرية', 'مدير الموارد البشرية', '966502345678', 'fatima@company.com'),
        ('EMP003', 'محمد سعد', 'المالية', 'محاسب مالي', '966503456789', 'mohamed@company.com'),
        ('EMP004', 'نورا عبدالله', 'التسويق', 'مسؤول تسويق', '966504567890', 'nora@company.com'),
        ('EMP005', 'عبدالرحمن خالد', 'الأمن', 'رئيس الأمن', '966505678901', 'abdulrahman@company.com')
    ]
    
    for emp in sample_employees:
        cursor.execute('''
        INSERT OR IGNORE INTO employees (employee_id, name, department, position, phone, email)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', emp)
    
    # سجلات حضور تجريبية (آخر 7 أيام)
    today = datetime.date.today()
    for i in range(7):
        date = today - datetime.timedelta(days=i)
        for emp_id in ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005']:
            # دخول
            check_in_time = datetime.datetime.combine(date, datetime.time(8, 0)) + datetime.timedelta(
                minutes=np.random.randint(-30, 60))
            cursor.execute('''
            INSERT OR IGNORE INTO attendance_logs (employee_id, timestamp, entry_type, recognition_method, confidence_score, location)
            VALUES (?, ?, 'check_in', 'face', ?, 'المدخل الرئيسي')
            ''', (emp_id, check_in_time, 0.85 + np.random.random() * 0.14))
            
            # خروج
            check_out_time = datetime.datetime.combine(date, datetime.time(17, 0)) + datetime.timedelta(
                minutes=np.random.randint(-60, 120))
            cursor.execute('''
            INSERT OR IGNORE INTO attendance_logs (employee_id, timestamp, entry_type, recognition_method, confidence_score, location)
            VALUES (?, ?, 'check_out', 'face', ?, 'المدخل الرئيسي')
            ''', (emp_id, check_out_time, 0.85 + np.random.random() * 0.14))
    
    # بيانات خريطة حرارية تجريبية
    locations = ['المدخل الرئيسي', 'المدخل الخلفي', 'القاعة الرئيسية', 'مكتبة', 'مقهى']
    for i in range(24 * 7):  # أسبوع كامل
        hour = i % 24
        day = i // 24
        for location in locations:
            count = max(0, int(np.random.normal(15, 5))) if 6 <= hour <= 22 else max(0, int(np.random.normal(2, 1)))
            intensity = min(1.0, count / 30.0)
            
            cursor.execute('''
            INSERT INTO heatmap_data (location, person_count, movement_intensity, hour, day_of_week)
            VALUES (?, ?, ?, ?, ?)
            ''', (location, count, intensity, hour, day))

# استيراد numpy للبيانات العشوائية
try:
    import numpy as np
except ImportError:
    class MockNumpy:
        def random(self):
            import random
            return random.random()
        
        def randint(self, low, high):
            import random
            return random.randint(low, high)
        
        def normal(self, mean, std):
            import random
            return random.gauss(mean, std)
    
    np = MockNumpy()

if __name__ == "__main__":
    create_database()
    print("🎉 تم إعداد قاعدة البيانات بنجاح!")
    print(f"📍 موقع قاعدة البيانات: {os.path.abspath(DB_PATH)}")