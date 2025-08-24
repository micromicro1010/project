export type ViewType =
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

export type BackendStatus = {
  available: boolean;
  mode: "simulation" | "connected";
  message: string;
};
