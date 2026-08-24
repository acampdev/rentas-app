import { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getUserRoles } from "../../config/accessControl";
import { useAuthContext } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { MAIN_MENU_ITEMS, SYSTEM_MENU_ITEMS } from "./sidebar.menu";
import {
  filterSidebarItemsByRoles,
  findActiveParentIds,
  hasActiveItem,
} from "./sidebar.navigation";
import type { SidebarMenuItem } from "./sidebar.types";

export const useAppSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuthContext();
  const {
    isExpanded,
    activeItem,
    openSubmenus,
    toggleSidebar,
    setOpenSubmenus,
  } = useSidebar();
  const roles = useMemo(() => getUserRoles(user), [user]);
  const mainItems = useMemo(
    () => filterSidebarItemsByRoles(MAIN_MENU_ITEMS, roles),
    [roles],
  );
  const systemItems = useMemo(
    () => filterSidebarItemsByRoles(SYSTEM_MENU_ITEMS, roles),
    [roles],
  );

  useEffect(() => {
    const parents = [
      ...findActiveParentIds(mainItems, pathname),
      ...findActiveParentIds(systemItems, pathname),
    ];
    setOpenSubmenus([...new Set(parents)]);
  }, [mainItems, pathname, setOpenSubmenus, systemItems]);

  const isActive = useCallback(
    (item: SidebarMenuItem): boolean =>
      activeItem === item.id || hasActiveItem(item, pathname),
    [activeItem, pathname],
  );

  const toggleSubmenu = useCallback(
    (id: string): void => {
      setOpenSubmenus((current) =>
        current.includes(id)
          ? current.filter((value) => value !== id)
          : [...current, id],
      );
    },
    [setOpenSubmenus],
  );

  return {
    isExpanded,
    drawerWidth: isExpanded ? 260 : 72,
    mainItems,
    systemItems,
    openSubmenus,
    toggleSidebar,
    toggleSubmenu,
    isActive,
  };
};
