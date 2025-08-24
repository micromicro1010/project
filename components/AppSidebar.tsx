import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Map,
  FileText,
  Bell,
  Shield,
  Settings,
  Brain,
  Activity,
  Zap,
  Eye,
  BarChart3,
  TrendingUp,
  Database,
  Cpu,
  Clock,
} from "lucide-react";
import { Badge } from "./ui/badge";

type ViewType =
  | "dashboard"
  | "attendance"
  | "visitors"
  | "security"
  | "heatmap"
  | "reports"
  | "alerts"
  | "settings"
  | "ai-biometric"
  | "ai-analytics"
  | "employees";

interface AppSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const coreMenuItems = [
  {
    title: "لوحة التحكم",
    icon: LayoutDashboard,
    id: "dashboard" as ViewType,
    badge: null,
  },
  {
    title: "سجل الحضور",
    icon: UserCheck,
    id: "attendance" as ViewType,
    badge: { text: "189", color: "bg-green-100 text-green-800" },
  },
  {
    title: "إدارة الزوار",
    icon: Users,
    id: "visitors" as ViewType,
    badge: { text: "47", color: "bg-blue-100 text-blue-800" },
  },
  {
    title: "الخريطة الحرارية",
    icon: Map,
    id: "heatmap" as ViewType,
    badge: null,
  },
  {
    title: "التقارير",
    icon: FileText,
    id: "reports" as ViewType,
    badge: null,
  },
];

const aiMenuItems = [
  {
    title: "التعرف الحيوي الذكي",
    icon: Brain,
    id: "ai-biometric" as ViewType,
    badge: { text: "99.2%", color: "bg-purple-100 text-purple-800" },
  },
  {
    title: "التحليلات الذكية",
    icon: BarChart3,
    id: "ai-analytics" as ViewType,
    badge: { text: "AI", color: "bg-gradient-to-r from-purple-500 to-blue-500 text-white" },
  },
];

const systemMenuItems = [
  {
    title: "الأمن والحماية",
    icon: Shield,
    id: "security" as ViewType,
    badge: { text: "3", color: "bg-yellow-100 text-yellow-800" },
  },
  {
    title: "التنبيهات",
    icon: Bell,
    id: "alerts" as ViewType,
    badge: { text: "12", color: "bg-red-100 text-red-800" },
  },
  {
    title: "الإعدادات",
    icon: Settings,
    id: "settings" as ViewType,
    badge: null,
  },
];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-right">
            <h2 className="font-semibold text-sidebar-foreground">
              نظام الحضور الذكي
            </h2>
            <p className="text-xs text-sidebar-foreground/70">
              الإصدار 2.0 المتقدم
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* القائمة الأساسية */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-right">
            الوظائف الأساسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className="w-full justify-end"
                  >
                    <div className="flex items-center gap-3 w-full justify-end">
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge className={item.badge.color}>
                            {item.badge.text}
                          </Badge>
                        )}
                        <span>{item.title}</span>
                      </div>
                      <item.icon className="h-4 w-4" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* قائمة الذكاء الاصطناعي */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-right flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-600" />
            الذكاء الاصطناعي
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className="w-full justify-end hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  >
                    <div className="flex items-center gap-3 w-full justify-end">
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge className={item.badge.color}>
                            {item.badge.text}
                          </Badge>
                        )}
                        <span>{item.title}</span>
                      </div>
                      <item.icon className="h-4 w-4 text-purple-600" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* قائمة النظام */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-right">
            النظام والأمان
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className="w-full justify-end"
                  >
                    <div className="flex items-center gap-3 w-full justify-end">
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge className={item.badge.color}>
                            {item.badge.text}
                          </Badge>
                        )}
                        <span>{item.title}</span>
                      </div>
                      <item.icon className="h-4 w-4" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* الموظفين والأمن */}
        <SidebarGroup>
          <SidebarGroupLabel>إدارة الموظفين والأمان</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => onViewChange("employees")}
                isActive={currentView === "employees"}
                className="flex items-center gap-2 justify-end"
              >
                <Users className="h-4 w-4" />
                إدارة الموظفين
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => onViewChange("attendance")}
                isActive={currentView === "attendance"}
                className="flex items-center gap-2 justify-end"
              >
                <Clock className="h-4 w-4" />
                سجل الحضور
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-sidebar-foreground/70">
              النظام متصل
            </span>
          </div>
          
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Activity className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">99.2%</span>
              </div>
              <div className="text-sidebar-foreground/60">الأداء</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Database className="h-3 w-3 text-blue-600" />
                <span className="text-blue-600 font-medium">1.2k</span>
              </div>
              <div className="text-sidebar-foreground/60">المعاملات</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Eye className="h-3 w-3 text-purple-600" />
                <span className="text-purple-600 font-medium">47</span>
              </div>
              <div className="text-sidebar-foreground/60">المراقب</div>
            </div>
          </div>
          
          <div className="mt-3 px-2">
            <Badge className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
              ⚡ مدعوم بالذكاء الاصطناعي
            </Badge>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}