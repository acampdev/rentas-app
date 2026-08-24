import type { SubMenuItem } from "./sidebarWidget.types";

export const isRouteActive = (pathname: string, path?: string) =>
  Boolean(path && (pathname === path || pathname.startsWith(`${path}/`)));
export const hasActiveChild = (
  pathname: string,
  items: SubMenuItem[],
): boolean =>
  items.some(
    (item) =>
      isRouteActive(pathname, item.path) ||
      hasActiveChild(pathname, item.subMenuItems || []),
  );
