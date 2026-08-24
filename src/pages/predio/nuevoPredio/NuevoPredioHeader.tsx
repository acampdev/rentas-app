import {
  Domain as DomainIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { Box, Breadcrumbs, Chip, Link, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NuevoPredioHeader({ editMode }: { editMode: boolean }) {
  const theme = useTheme();
  const items = [
    { label: "Módulo", path: "/", icon: <HomeIcon sx={{ fontSize: 20 }} /> },
    {
      label: "Predio",
      path: "/predio/consulta",
      icon: <DomainIcon sx={{ fontSize: 20 }} />,
    },
    { label: editMode ? "Edición de predio" : "Registro de predio" },
  ];
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {items.map((item, index) =>
          index === items.length - 1 ? (
            <Chip
              key={item.label}
              label={item.label}
              icon={item.icon}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          ) : (
            <Link
              key={item.label}
              component={RouterLink}
              to={item.path ?? "/"}
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.primary",
              }}
            >
              {item.icon && (
                <Box component="span" sx={{ mr: 0.5, display: "flex" }}>
                  {item.icon}
                </Box>
              )}
              {item.label}
            </Link>
          ),
        )}
      </Breadcrumbs>
    </Box>
  );
}
