import { alpha, Box, IconButton, styled, Typography } from "@mui/material";

export const SidebarContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  inset: "0 auto 0 0",
  backgroundColor: "#4a5568",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
  zIndex: theme.zIndex.drawer,
  boxShadow: theme.shadows[8],
  borderRight: `1px solid ${alpha("#000", 0.12)}`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, #3d4451 0%, #4a5568 100%)",
  borderBottom: `2px solid ${alpha("#60a5fa", 0.2)}`,
  position: "relative",
  minHeight: 64,
  boxShadow: `0 2px 4px ${alpha("#000", 0.1)}`,
}));

export const MenuSection = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 700,
  color: alpha("#60a5fa", 0.8),
  textTransform: "uppercase",
  padding: theme.spacing(2, 2, 1),
  letterSpacing: "1px",
  display: "flex",
  alignItems: "center",
  "&::after": {
    content: '""',
    flex: 1,
    height: 1,
    backgroundColor: alpha("#60a5fa", 0.2),
    marginLeft: theme.spacing(1),
  },
}));

export const ScrollableContent = styled(Box)({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  backgroundColor: "#4a5568",
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-track": { background: "rgba(0, 0, 0, 0.2)" },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.3)",
    "&:hover": { background: "rgba(255, 255, 255, 0.4)" },
  },
});

export const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: "50%",
  transform: "translateY(-50%)",
  color: alpha("#60a5fa", 0.9),
  padding: theme.spacing(0.5),
  backgroundColor: alpha("#000", 0.1),
  border: `1px solid ${alpha("#60a5fa", 0.2)}`,
  "&:hover": {
    backgroundColor: alpha("#60a5fa", 0.1),
    color: "#60a5fa",
    transform: "translateY(-50%) scale(1.1)",
  },
}));
