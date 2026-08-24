export interface SidebarSubMenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: React.ReactNode;
  subMenuItems?: SidebarSubMenuItem[];
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  subMenuItems?: SidebarSubMenuItem[];
}

export interface AppSidebarProps {
  toggleSidebar?: () => void;
}
