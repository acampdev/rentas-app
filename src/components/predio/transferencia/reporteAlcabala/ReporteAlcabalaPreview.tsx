import {
  FindInPage as FindInPageIcon,
  Print as PrintIcon,
  SearchOff as SearchOffIcon,
} from "@mui/icons-material";
import { alpha, Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import type { ReporteAlcabalaItem } from "./reporteAlcabala.types";

interface Props {
  hasSearched: boolean;
  results: ReporteAlcabalaItem[];
}

function EmptyState({ searched }: { searched: boolean }) {
  const theme = useTheme();
  const color = searched ? theme.palette.warning.main : theme.palette.info.main;
  const Icon = searched ? SearchOffIcon : FindInPageIcon;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: alpha(color, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ fontSize: 32, color }} />
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
          {searched ? "No se encontraron resultados" : "Listo para buscar"}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
          {searched
            ? "Intente con otros criterios de busqueda o presione Nuevo para limpiar"
            : "Seleccione un predio y rango de fechas, luego presione Buscar"}
        </Typography>
      </Box>
    </Box>
  );
}

export function ReporteAlcabalaPreview({ hasSearched, results }: Props) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: theme.palette.success.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PrintIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Vista Previa del Reporte
            </Typography>
            <Typography variant="caption" color="text.secondary">
              El reporte se mostrara aqui despues de buscar
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        {!hasSearched || results.length === 0 ? (
          <EmptyState searched={hasSearched} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Se encontraron {results.length} registro(s)
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
