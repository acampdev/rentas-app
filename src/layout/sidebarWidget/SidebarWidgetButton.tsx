import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  alpha,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import type { MouseEventHandler, ReactNode } from "react";
import { useSidebarWidgetStyles } from "./useSidebarWidgetStyles";

interface Props {
  icon: ReactNode;
  label: string;
  expanded: boolean;
  active: boolean;
  level: number;
  hasSubmenu: boolean;
  submenuOpen: boolean;
  onClick: MouseEventHandler;
}

export function SidebarWidgetButton({
  icon,
  label,
  expanded,
  active,
  level,
  hasSubmenu,
  submenuOpen,
  onClick,
}: Props) {
  const { theme, buttonStyles, iconStyles, textStyles } =
    useSidebarWidgetStyles(expanded, active, level);
  return (
    <Tooltip
      title={!expanded && level === 0 ? label : ""}
      placement="right"
      arrow
      componentsProps={{ tooltip: { sx: { bgcolor: "rgba(0,0,0,.9)" } } }}
    >
      <ListItemButton onClick={onClick} sx={buttonStyles}>
        {icon && <ListItemIcon sx={iconStyles}>{icon}</ListItemIcon>}
        {expanded && (
          <>
            <ListItemText primary={label} sx={textStyles} />
            {hasSubmenu && (
              <Box
                sx={{
                  ml: "auto",
                  color: active ? "#60a5fa" : alpha("#fff", 0.5),
                  transform: submenuOpen ? "rotate(180deg)" : "none",
                  bgcolor: alpha("#60a5fa", 0.1),
                  borderRadius: "50%",
                  p: "2px",
                  display: "flex",
                  transition: theme.transitions.create("transform"),
                }}
              >
                {submenuOpen ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </Box>
            )}
          </>
        )}
      </ListItemButton>
    </Tooltip>
  );
}
