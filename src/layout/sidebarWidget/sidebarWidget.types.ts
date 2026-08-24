import type { ReactNode } from "react";

export interface SubMenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: ReactNode;
  subMenuItems?: SubMenuItem[];
}
export interface SidebarWidgetProps {
  id: string;
  icon: ReactNode;
  label: string;
  path?: string;
  isActive?: boolean;
  subMenuItems?: SubMenuItem[];
  level?: number;
  onCustomToggle?: (menuId: string) => void;
}
