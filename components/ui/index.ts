// Barrel file re-exporting UI components used by App.tsx
export { Card, CardContent, CardHeader, CardTitle } from './card';
export { Badge } from './badge';
export { Button } from './button';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Alert, AlertDescription } from './alert';
export { Progress } from './progress';
export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
export { Avatar, AvatarFallback, AvatarImage } from './avatar';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { Separator } from './separator';
// Sidebar pieces are exported from their own file (keep direct imports possible)

// Note: add more exports here as App.tsx grows to use more UI primitives.
