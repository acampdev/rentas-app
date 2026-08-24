import { Add, Home } from "@mui/icons-material";
import { Box, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";

export const PredioFormHeader = ({ editing }: { editing: boolean }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.main",
          }}
        >
          {editing ? <Home fontSize="medium" /> : <Add fontSize="medium" />}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {editing ? "Editar Predio" : "Registrar Nuevo Predio"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete la información del predio en el sistema
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
