import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import { LogoContainer, ToggleButton } from "./Sidebar.styles";

interface SidebarHeaderProps {
  expanded: boolean;
  onToggle: () => void;
}

export const SidebarHeader = ({ expanded, onToggle }: SidebarHeaderProps) => {
  const theme = useTheme();
  return (
    <LogoContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 8px ${alpha("#60a5fa", 0.3)}`,
          }}
        >
          <Box
            component="img"
            src="/escudoMDE.png"
            alt="Escudo MDE"
            sx={{ width: 24, height: 24, objectFit: "contain" }}
          />
        </Box>
        {expanded && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#fff",
              letterSpacing: 0.5,
              fontSize: "1.1rem",
              transition: theme.transitions.create("opacity"),
            }}
          >
            SIS. Rentas
          </Typography>
        )}
      </Box>
      <ToggleButton
        onClick={onToggle}
        size="small"
        aria-label={expanded ? "Colapsar menú" : "Expandir menú"}
      >
        {expanded ? <ChevronLeft /> : <ChevronRight />}
      </ToggleButton>
    </LogoContainer>
  );
};
