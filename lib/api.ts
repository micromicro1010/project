/**
 * مكتبة الاتصال مع API المحلي
 * Local API Connection Library
 */

const API_BASE_URL = 'http://localhost:5000/api';

// بيانات وهمية للاستخدام عند فشل الاتصال
const MOCK_DATA = {
  dashboard: {
    present_today: 23,
    total_employees: 45,
    visitors_today: 8,
    security_alerts: 2,
    attendance_rate: 87.3,
    recent_activities: [
      {
        id: 1,
        employee_id: 'EMP001',
        employee_name: 'أحمد محمد علي',
        timestamp: new Date().toISOString(),
        entry_type: 'check_in' as const,
        recognition_method: 'face' as const,
        confidence_score: 0.97,
        location: 'المدخل الرئيسي',
      },
      {
        id: 2,
        employee_id: 'EMP002',
        employee_name: 'فاطمة أحمد',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        entry_type: 'check_out' as const,
        recognition_method: 'fingerprint' as const,
        confidence_score: 0.95,
        location: 'المدخل الرئيسي',
      }
    ]
  },
  employees: [
    {
      id: 1,
      employee_id: 'EMP001',
      name: 'أحمد محمد علي',
      department: 'تقنية المعلومات',
      position: 'مطور برمجيات',
      phone: '966501234567',
      email: 'ahmed@company.com',
      is_active: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    {
      id: 2,
      employee_id: 'EMP002',
      name: 'فاطمة أحمد',
      department: 'الموارد البشرية',
      position: 'مدير الموارد البشرية',
      phone: '966502345678',
      email: 'fatima@company.com',
      is_active: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    }
  ],
  systemStatus: {
    database_status: 'غير متصل - وضع محاكاة',
    ai_engine_status: 'غير متصل - وضع محاكاة',
    total_employees: 45,
    total_attendance_records: 1250,
    total_visitors: 89,
    pending_security_events: 2,
    system_uptime: '99.9%',
    last_backup: new Date().toISOString(),
    version: '2.0.0'
  }
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Types
export interface Employee {
  employee_id: string;
  name: string;
  department: string;
  position: string;
  phone?: string;
  email?: string;
  face_encoding?: string;
  fingerprint_hash?: string;
  is_active: boolean;
  employee_token?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: string;
  entry_type: 'check_in' | 'check_out';
  timestamp: string;
  recognition_method: 'face' | 'fingerprint' | 'card' | 'manual';
  confidence_score: number;
  location: string;
  device_id: string;
  is_anomaly: boolean;
  employee_name?: string;
  department?: string;
  notes?: string;
  session_token?: string;
}

export interface Visitor {
  id: number;
  visitor_id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  purpose: string;
  host_employee_id: string;
  status: 'pending' | 'approved' | 'checked_in' | 'checked_out' | 'rejected';
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  host_name?: string;
}

interface DashboardStats {
  present_today: number;
  total_employees: number;
  visitors_today: number;
  security_alerts: number;
  attendance_rate: number;
  recent_activities: any[];
}

interface PatternAnalysis {
  employee_id: string;
  analysis_period: string;
  total_days_present: number;
  avg_check_in_hour?: number;
  avg_check_out_hour?: number;
  avg_daily_hours: number;
  punctuality_score: number;
  regularity_score: number;
  overall_rating: string;
  recommendations: string[];
}

class ApiClient {
  private isBackendAvailable = false;
  private lastConnectionCheck = 0;
  private CONNECTION_CHECK_INTERVAL = 30000; // 30 seconds

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Check if we need to test backend availability
      const now = Date.now();
      if (now - this.lastConnectionCheck > this.CONNECTION_CHECK_INTERVAL) {
        await this.checkBackendAvailability();
      }

      if (!this.isBackendAvailable) {
        return this.getMockResponse<T>(endpoint);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`API Error for ${endpoint}:`, error);
      
      // If it's a network error, mark backend as unavailable
      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.isBackendAvailable = false;
        return this.getMockResponse<T>(endpoint);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الاتصال مع الخادم',
      };
    }
  }

  private async checkBackendAvailability(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE_URL}/system/status`, {
        signal: controller.signal,
        method: 'GET',
      });

      clearTimeout(timeoutId);
      this.isBackendAvailable = response.ok;
      this.lastConnectionCheck = Date.now();
    } catch {
      this.isBackendAvailable = false;
      this.lastConnectionCheck = Date.now();
    }
  }

  private getMockResponse<T>(endpoint: string): ApiResponse<T> {
    // Return appropriate mock data based on endpoint
    if (endpoint === '/stats/dashboard') {
      return {
        success: true,
        data: MOCK_DATA.dashboard as T,
      };
    }

    if (endpoint === '/employees') {
      return {
        success: true,
        data: MOCK_DATA.employees as T,
        count: MOCK_DATA.employees.length,
      } as ApiResponse<T>;
    }

    if (endpoint === '/system/status') {
      return {
        success: true,
        data: MOCK_DATA.systemStatus as T,
      };
    }

    if (endpoint.startsWith('/attendance')) {
      return {
        success: true,
        data: [] as T,
        count: 0,
      } as ApiResponse<T>;
    }

    if (endpoint.startsWith('/visitors')) {
      return {
        success: true,
        data: [] as T,
        count: 0,
      } as ApiResponse<T>;
    }

    // Default mock response
    return {
      success: false,
      error: 'Backend غير متصل - يتم استخدام البيانات التجريبية',
    };
  }

  // ==================== موظفين ====================

  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.request<Employee[]>('/employees');
  }

  async addEmployee(employee: Partial<Employee>): Promise<ApiResponse<{ message: string }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{ message: string }>('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<ApiResponse<{ message: string }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{ message: string }>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: string): Promise<ApiResponse<{ message: string }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{ message: string }>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== حضور ====================

  async getAttendance(params: {
    employee_id?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  } = {}): Promise<ApiResponse<AttendanceRecord[]>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, value.toString());
      }
    });

    return this.request<AttendanceRecord[]>(`/attendance?${query.toString()}`);
  }

  async recordAttendance(attendance: {
    employee_id: string;
    entry_type: 'check_in' | 'check_out';
    recognition_method: 'face' | 'fingerprint' | 'card';
    confidence_score?: number;
    location?: string;
    device_id?: string;
    notes?: string;
  }): Promise<ApiResponse<{ message: string; anomaly_detected: boolean; employee_name: string }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{ message: string; anomaly_detected: boolean; employee_name: string }>('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendance),
    });
  }

  // ==================== زوار ====================

  async getVisitors(params: {
    status?: string;
    date_from?: string;
    limit?: number;
  } = {}): Promise<ApiResponse<Visitor[]>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, value.toString());
      }
    });

    return this.request<Visitor[]>(`/visitors?${query.toString()}`);
  }

  async addVisitor(visitor: {
    name: string;
    company?: string;
    phone?: string;
    email?: string;
    purpose: string;
    host_employee_id: string;
  }): Promise<ApiResponse<{ message: string; visitor_id: string }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{ message: string; visitor_id: string }>('/visitors', {
      method: 'POST',
      body: JSON.stringify(visitor),
    });
  }

  async updateVisitorStatus(id: string, status: string): Promise<ApiResponse<{ message: string }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{ message: string }>(`/visitors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== إحصائيات ====================

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('/stats/dashboard');
  }

  async getHeatmapData(days: number = 7): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/stats/heatmap?days=${days}`);
  }

  // ==================== ذكاء اصطناعي ====================

  async analyzePatterns(params: {
    employee_id: string;
    days?: number;
  }): Promise<ApiResponse<PatternAnalysis>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<PatternAnalysis>('/ai/analyze-patterns', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async recognizeFace(imageData: string): Promise<ApiResponse<{
    employee_id?: string;
    name?: string;
    confidence: number;
    message: string;
  }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{
      employee_id?: string;
      name?: string;
      confidence: number;
      message: string;
    }>('/ai/recognize-face', {
      method: 'POST',
      body: JSON.stringify({ image_data: imageData }),
    });
  }

  async analyzeSecurityThreats(): Promise<ApiResponse<{
    threats: any[];
    risk_level: string;
    recommendations: string[];
  }>> {
    if (!this.isBackendAvailable) {
      return {
        success: false,
        error: 'غير متاح في وضع المحاكاة - يرجى تشغيل Python Backend'
      };
    }

    return this.request<{
      threats: any[];
      risk_level: string;
      recommendations: string[];
    }>('/ai/analyze-security');
  }

  // ==================== نظام ====================

  async getSystemStatus(): Promise<ApiResponse<{
    database_status: string;
    ai_engine_status: string;
    total_employees: number;
    total_attendance_records: number;
    total_visitors: number;
    pending_security_events: number;
    system_uptime: string;
    last_backup: string;
    version: string;
  }>> {
    return this.request<{
      database_status: string;
      ai_engine_status: string;
      total_employees: number;
      total_attendance_records: number;
      total_visitors: number;
      pending_security_events: number;
      system_uptime: string;
      last_backup: string;
      version: string;
    }>('/system/status');
  }

  async getSystemSettings(): Promise<ApiResponse<{
    setting_key: string;
    setting_value: string;
    description: string;
  }[]>> {
    return this.request<{
      setting_key: string;
      setting_value: string;
      description: string;
    }[]>('/system/settings');
  }

  // ==================== مساعدة ====================

  async checkConnection(): Promise<boolean> {
    try {
      await this.checkBackendAvailability();
      return this.isBackendAvailable;
    } catch {
      return false;
    }
  }

  // ==================== حالة النظام ====================

  getBackendStatus(): {
    available: boolean;
    mode: 'connected' | 'simulation';
    message: string;
  } {
    return {
      available: this.isBackendAvailable,
      mode: this.isBackendAvailable ? 'connected' : 'simulation',
      message: this.isBackendAvailable 
        ? 'متصل بـ Python Backend' 
        : 'وضع المحاكاة - Python Backend غير متصل'
    };
  }
}

// إنشاء مثيل واحد من العميل
export const apiClient = new ApiClient();

// دوال مساعدة
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA');
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// التحقق من حالة الاتصال
export const checkApiConnection = async (): Promise<boolean> => {
  return await apiClient.checkConnection();
};

// الحصول على حالة Backend
export const getBackendStatus = () => {
  return apiClient.getBackendStatus();
};

// تصدير الأنواع
export type {
  ApiResponse,
  Employee,
  AttendanceRecord,
  Visitor,
  DashboardStats,
  PatternAnalysis,
};