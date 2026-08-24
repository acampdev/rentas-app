import { Home as HomeIcon } from "@mui/icons-material";
import { alpha, Box, Typography, useTheme } from "@mui/material";

export function PUHeader() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: theme.palette.primary.main,
            color: "white",
            display: "flex",
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <HomeIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Predio Urbano (PU)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta e Impresión de Ficha PU por Contribuyente
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
