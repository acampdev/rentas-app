import { FiberManualRecord } from "@mui/icons-material";
import { alpha, Box, Collapse, List, ListItem, useTheme } from "@mui/material";
import { memo } from "react";
import { SidebarWidgetButton } from "./sidebarWidget/SidebarWidgetButton";
import type {
  SidebarWidgetProps,
  SubMenuItem,
} from "./sidebarWidget/sidebarWidget.types";
import {
  hasActiveChild,
  isRouteActive,
} from "./sidebarWidget/sidebarWidget.utils";
import { useSidebarWidgetNavigation } from "./sidebarWidget/useSidebarWidgetNavigation";

const SidebarWidget = memo(function SidebarWidget({
  id,
  icon,
  label,
  path,
  isActive = false,
  subMenuItems = [],
  level = 0,
  onCustomToggle,
}: SidebarWidgetProps) {
  const theme = useTheme();
  const hasSubmenu = subMenuItems.length > 0;
  const navigation = useSidebarWidgetNavigation({
    id,
    path,
    hasSubmenu,
    onCustomToggle,
  });
  const activeChild = hasActiveChild(navigation.pathname, subMenuItems);
  const menuActive =
    isActive || activeChild || isRouteActive(navigation.pathname, path);
  const submenuOpen =
    navigation.openSubmenus.includes(id) || (hasSubmenu && activeChild);
  const renderChildren = (items: SubMenuItem[]) =>
    items.map((item) => (
      <SidebarWidget
        key={item.id}
        id={item.id}
        icon={item.icon || <FiberManualRecord sx={{ fontSize: 6 }} />}
        label={item.label}
        path={item.path}
        isActive={isRouteActive(navigation.pathname, item.path)}
        subMenuItems={item.subMenuItems || []}
        level={level + 1}
        onCustomToggle={onCustomToggle}
      />
    ));

  return (
    <Box sx={{ position: "relative" }}>
      <ListItem disablePadding sx={{ display: "block" }}>
        <SidebarWidgetButton
          icon={icon}
          label={label}
          expanded={navigation.isExpanded}
          active={menuActive}
          level={level}
          hasSubmenu={hasSubmenu}
          submenuOpen={submenuOpen}
          onClick={
            path && !hasSubmenu
              ? navigation.navigateToPath
              : navigation.clickMenu
          }
        />
      </ListItem>
      {hasSubmenu && (
        <Collapse
          in={submenuOpen && (navigation.isExpanded || level > 0)}
          timeout="auto"
          unmountOnExit
        >
          <List
            component="div"
            disablePadding
            sx={{
              position: "relative",
              "&::before":
                level === 0
                  ? {
                      content: '""',
                      position: "absolute",
                      left: theme.spacing(2.5),
                      insetBlock: 0,
                      width: 1,
                      bgcolor: alpha("#fff", 0.1),
                    }
                  : {},
            }}
          >
            {renderChildren(subMenuItems)}
          </List>
        </Collapse>
      )}
      {!navigation.isExpanded && hasSubmenu && activeChild && (
        <Box
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#60a5fa",
            boxShadow: `0 0 0 2px ${alpha("#60a5fa", 0.3)}`,
          }}
        />
      )}
    </Box>
  );
});

export type {
  SidebarWidgetProps,
  SubMenuItem,
} from "./sidebarWidget/sidebarWidget.types";
export default SidebarWidget;
