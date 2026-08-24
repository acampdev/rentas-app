import AssignmentIcon from "@mui/icons-material/Assignment";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";

interface SelectorArancelHeaderProps {
  title?: string;
  useGeneralApi: boolean;
}

export const SelectorArancelHeader = ({
  title,
  useGeneralApi,
}: SelectorArancelHeaderProps) => {
  const theme = useTheme();
  const defaultTitle = useGeneralApi
    ? "Lista de Aranceles - API General"
    : "Lista de Aranceles";

  return (
    <Box
      sx={{
        p: 3,
        pb: 2,
        background: alpha(theme.palette.primary.main, 0.02),
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            minWidth: 36,
            height: 36,
          }}
        >
          <AssignmentIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={600} color="primary.main">
            {title ?? defaultTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {useGeneralApi
              ? "Búsqueda avanzada por sector, barrio, calle y dirección completa"
              : "Los aranceles se cargan por año y muestran los costos por dirección"}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
