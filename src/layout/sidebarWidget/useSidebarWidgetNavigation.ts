import { useCallback, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationGuard } from "../../components/utils/navigationGuard";
import { useSidebar } from "../../context/SidebarContext";

interface Params {
  id: string;
  path?: string;
  hasSubmenu: boolean;
  onCustomToggle?: (id: string) => void;
}

export function useSidebarWidgetNavigation({
  id,
  path,
  hasSubmenu,
  onCustomToggle,
}: Params) {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebar = useSidebar();
  const toggle = useCallback(
    () => (onCustomToggle ? onCustomToggle(id) : sidebar.toggleSubmenu(id)),
    [id, onCustomToggle, sidebar],
  );
  const navigateToPath = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (!path) return;
      if (!sidebar.isExpanded) {
        sidebar.expandSidebar();
        return;
      }
      if (location.pathname === path) return;
      if (
        navigationGuard.hasUnsavedChanges() &&
        !navigationGuard.confirmNavigation()
      )
        return;
      navigationGuard.clearUnsavedChanges();
      sidebar.setActiveItem(id);
      navigate(path);
    },
    [id, location.pathname, navigate, path, sidebar],
  );
  const clickMenu = useCallback(() => {
    if (!sidebar.isExpanded) {
      sidebar.expandSidebar();
      if (hasSubmenu) window.setTimeout(toggle, 200);
      return;
    }
    if (hasSubmenu) toggle();
    else if (path) sidebar.setActiveItem(id);
  }, [hasSubmenu, id, path, sidebar, toggle]);
  return { ...sidebar, pathname: location.pathname, navigateToPath, clickMenu };
}
