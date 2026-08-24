// src/layout/AppSidebar.tsx
import { memo } from "react";
import { ScrollableContent, SidebarContainer } from "./sidebar/Sidebar.styles";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuGroup } from "./sidebar/SidebarMenuGroup";
import type { AppSidebarProps } from "./sidebar/sidebar.types";
import { useAppSidebar } from "./sidebar/useAppSidebar";

const AppSidebar = memo(
  ({ toggleSidebar: toggleSidebarOverride }: AppSidebarProps) => {
    const sidebar = useAppSidebar();

    return (
      <SidebarContainer
        className="sidebar-container"
        sx={{
          width: sidebar.drawerWidth,
          borderRadius: 0,
          "&, & *": { borderRadius: 0 },
          "& .MuiPaper-root, & .MuiBox-root": { borderRadius: 0 },
        }}
      >
        <SidebarHeader
          expanded={sidebar.isExpanded}
          onToggle={toggleSidebarOverride ?? sidebar.toggleSidebar}
        />
        <ScrollableContent>
          <SidebarMenuGroup
            title="MENU"
            items={sidebar.mainItems}
            expanded={sidebar.isExpanded}
            isActive={sidebar.isActive}
            onToggle={sidebar.toggleSubmenu}
          />
          <SidebarMenuGroup
            title="SISTEMA"
            items={sidebar.systemItems}
            expanded={sidebar.isExpanded}
            isActive={sidebar.isActive}
            onToggle={sidebar.toggleSubmenu}
          />
        </ScrollableContent>
      </SidebarContainer>
    );
  },
);

AppSidebar.displayName = "AppSidebar";
export default AppSidebar;
