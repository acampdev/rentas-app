import { alpha, useTheme } from "@mui/material";

export function useSidebarWidgetStyles(
  expanded: boolean,
  active: boolean,
  level: number,
) {
  const theme = useTheme();
  const buttonStyles = {
    minHeight: 44,
    justifyContent: expanded ? "initial" : "center",
    px: expanded ? level * 1.5 + 1 : 1,
    py: 1,
    borderRadius: theme.shape.borderRadius,
    mx: 0.5,
    my: 0.25,
    position: "relative",
    color: active ? "#fff" : alpha("#fff", 0.7),
    bgcolor: active ? alpha("#60a5fa", 0.15) : "transparent",
    border: `1px solid ${active ? alpha("#60a5fa", 0.2) : "transparent"}`,
    "&:hover": {
      bgcolor: active ? alpha("#60a5fa", 0.25) : alpha("#fff", 0.08),
      color: "#fff",
      borderColor: alpha("#60a5fa", 0.3),
      transform: "translateX(2px)",
    },
    "&::before":
      active && level === 0
        ? {
            content: '""',
            position: "absolute",
            left: 0,
            top: "15%",
            width: 3,
            height: "70%",
            bgcolor: "#60a5fa",
            borderRadius: "0 3px 3px 0",
          }
        : {},
    transition: theme.transitions.create(["all"], {
      duration: theme.transitions.duration.shorter,
    }),
  };
  const iconStyles = {
    minWidth: 0,
    mr: expanded ? 1.5 : "auto",
    justifyContent: "center",
    color: active ? "#60a5fa" : "inherit",
    "& svg": {
      fontSize: level === 0 ? 20 : 16,
      filter: active ? `drop-shadow(0 0 3px ${alpha("#60a5fa", 0.5)})` : "none",
    },
  };
  const textStyles = {
    opacity: expanded ? 1 : 0,
    fontSize: level === 0 ? "0.875rem" : "0.813rem",
    fontWeight: active ? 600 : 400,
    color: "inherit",
    "& .MuiListItemText-primary": {
      fontSize: "inherit",
      fontWeight: "inherit",
    },
  };
  return { theme, buttonStyles, iconStyles, textStyles };
}
