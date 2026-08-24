import { alpha, Box, List, Typography } from "@mui/material";
import SidebarWidget from "../SidebarWidget";
import { MenuSection } from "./Sidebar.styles";
import type { SidebarMenuItem } from "./sidebar.types";

interface SidebarMenuGroupProps {
  title: string;
  items: SidebarMenuItem[];
  expanded: boolean;
  isActive: (item: SidebarMenuItem) => boolean;
  onToggle: (id: string) => void;
}

export const SidebarMenuGroup = ({
  title,
  items,
  expanded,
  isActive,
  onToggle,
}: SidebarMenuGroupProps) => {
  if (!items.length) return null;
  return (
    <>
      {expanded ? (
        <MenuSection>{title}</MenuSection>
      ) : (
        <Box sx={{ textAlign: "center", py: 1 }}>
          <Typography variant="caption" sx={{ color: alpha("#fff", 0.5) }}>
            •••
          </Typography>
        </Box>
      )}
      <List component="nav" sx={{ px: 1 }}>
        {items.map((item) => (
          <SidebarWidget
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={expanded ? item.label : ""}
            path={item.path}
            isActive={isActive(item)}
            subMenuItems={item.subMenuItems ?? []}
            onCustomToggle={onToggle}
          />
        ))}
      </List>
    </>
  );
};
