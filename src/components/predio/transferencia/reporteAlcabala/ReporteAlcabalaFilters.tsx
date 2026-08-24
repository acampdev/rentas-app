import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Home as HomeIcon,
  Print as PrintIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dispatch, SetStateAction } from "react";
import type { FiltroReporteAlcabala } from "./reporteAlcabala.types";

interface Props {
  filters: FiltroReporteAlcabala;
  setFilters: Dispatch<SetStateAction<FiltroReporteAlcabala>>;
  onOpenPredio: () => void;
  onReset: () => void;
  onSearch: () => void;
  onPrint: () => void;
}

export function ReporteAlcabalaFilters({
  filters,
  setFilters,
  onOpenPredio,
  onReset,
  onSearch,
  onPrint,
}: Props) {
  const theme = useTheme();
  const gradient = (color: "primary" | "info" | "success") =>
    `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            background: gradient("primary"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Filtros del Reporte
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Seleccione los criterios para generar el reporte de alcabala
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={onOpenPredio}
            fullWidth
            sx={{ height: 40, background: gradient("primary") }}
          >
            Buscar Predio
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 1 }}>
          <TextField
            label="Codigo Predio"
            value={filters.codigoPredio}
            fullWidth
            size="small"
            disabled
            slotProps={{
              input: {
                readOnly: true,
                sx: {
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  fontWeight: 600,
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
          <DatePicker
            label="De"
            value={filters.fechaDesde}
            onChange={(fechaDesde) =>
              setFilters((previous) => ({ ...previous, fechaDesde }))
            }
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                InputProps: {
                  startAdornment: (
                    <CalendarIcon
                      sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }}
                    />
                  ),
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
          <DatePicker
            label="Hasta"
            value={filters.fechaHasta}
            onChange={(fechaHasta) =>
              setFilters((previous) => ({ ...previous, fechaHasta }))
            }
            format="dd/MM/yyyy"
            minDate={filters.fechaDesde ?? undefined}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                InputProps: {
                  startAdornment: (
                    <CalendarIcon
                      sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }}
                    />
                  ),
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4.5 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onReset}
              sx={{ height: 40, minWidth: 100 }}
            >
              Nuevo
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={onSearch}
              sx={{ height: 40, minWidth: 100, background: gradient("info") }}
            >
              Buscar
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={onPrint}
              sx={{
                height: 40,
                minWidth: 110,
                background: gradient("success"),
              }}
            >
              Imprimir
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
