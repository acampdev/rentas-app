import { Assignment as AssignmentIcon } from "@mui/icons-material";
import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";

export const ConsultaAsignacionHeader = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.03)})`,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "primary.main", color: "common.white", display: "flex", boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}` }}>
          <AssignmentIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>Consulta de Asignaciones</Typography>
          <Typography variant="body2" color="text.secondary">PU - Contribuyente y Predios Asignados</Typography>
        </Box>
      </Stack>
    </Box>
  );
};

