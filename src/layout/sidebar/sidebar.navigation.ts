import { canAccessPath } from "../../config/accessControl";
import type { SidebarMenuItem, SidebarSubMenuItem } from "./sidebar.types";

export const isRouteActive = (
  currentPath: string,
  itemPath?: string,
): boolean =>
  Boolean(
    itemPath &&
    (currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)),
  );

export const hasActiveItem = (
  item: SidebarMenuItem | SidebarSubMenuItem,
  currentPath: string,
): boolean =>
  isRouteActive(currentPath, item.path) ||
  Boolean(
    item.subMenuItems?.some((child) => hasActiveItem(child, currentPath)),
  );

const filterSubMenus = (
  items: readonly SidebarSubMenuItem[],
  roles: readonly string[],
): SidebarSubMenuItem[] =>
  items.flatMap((item) => {
    const children = item.subMenuItems
      ? filterSubMenus(item.subMenuItems, roles)
      : [];
    const canAccess = item.path ? canAccessPath(item.path, roles) : false;
    if (!canAccess && children.length === 0) return [];
    return [
      {
        ...item,
        path: canAccess ? item.path : undefined,
        subMenuItems: children.length ? children : undefined,
      },
    ];
  });

export const filterSidebarItemsByRoles = (
  items: readonly SidebarMenuItem[],
  roles: readonly string[],
): SidebarMenuItem[] =>
  items.flatMap((item) => {
    const children = item.subMenuItems
      ? filterSubMenus(item.subMenuItems, roles)
      : [];
    const canAccess = item.path ? canAccessPath(item.path, roles) : false;
    if (!canAccess && children.length === 0) return [];
    return [
      {
        ...item,
        path: canAccess ? item.path : undefined,
        subMenuItems: children.length ? children : undefined,
      },
    ];
  });

export const findActiveParentIds = (
  items: readonly (SidebarMenuItem | SidebarSubMenuItem)[],
  currentPath: string,
  parents: readonly string[] = [],
): string[] => {
  for (const item of items) {
    const currentParents = [...parents, item.id];
    if (isRouteActive(currentPath, item.path)) return [...parents];
    if (item.subMenuItems) {
      const found = findActiveParentIds(
        item.subMenuItems,
        currentPath,
        currentParents,
      );
      if (found.length) return found;
    }
  }
  return [];
};
