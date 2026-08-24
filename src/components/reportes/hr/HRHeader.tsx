import { Assignment } from "@mui/icons-material";
import { Box, Typography, alpha, useTheme } from "@mui/material";

export const HRHeader = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%,
    ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <Assignment fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Hoja de Resumen (HR)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta e Impresión de Hoja de Resumen por Contribuyente
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
