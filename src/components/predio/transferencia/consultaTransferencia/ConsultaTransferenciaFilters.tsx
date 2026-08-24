import { Search as SearchIcon } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import type { TransferenciaFilters } from "./consultaTransferencia.types";

interface Props {
  filters: TransferenciaFilters;
  searching: boolean;
  onChange: <Key extends keyof TransferenciaFilters>(
    field: Key,
    value: TransferenciaFilters[Key],
  ) => void;
  onSearch: () => void;
}

const onlyNumbers = (value: string) => value.replace(/\D/g, "");

export function ConsultaTransferenciaFilters({
  filters,
  searching,
  onChange,
  onSearch,
}: Props) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="subtitle2"
        color="primary"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Filtros de Busqueda
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Código Transferencia"
            value={filters.codigoTransferencia}
            onChange={(event) =>
              onChange("codigoTransferencia", onlyNumbers(event.target.value))
            }
            size="small"
            fullWidth
            slotProps={{
              htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Código Predio"
            value={filters.codigoPredio}
            onChange={(event) =>
              onChange("codigoPredio", onlyNumbers(event.target.value))
            }
            size="small"
            fullWidth
            slotProps={{
              htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3, md: 1 }}>
          <TextField
            label="Año"
            type="number"
            value={filters.anio}
            onChange={(event) => onChange("anio", event.target.value)}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Cod. Contribuyente Venta"
            value={filters.codContribuyenteVenta}
            onChange={(event) =>
              onChange("codContribuyenteVenta", onlyNumbers(event.target.value))
            }
            size="small"
            fullWidth
            slotProps={{
              htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            label="Cod. Contribuyente Compra"
            value={filters.codContribuyenteCompra}
            onChange={(event) =>
              onChange(
                "codContribuyenteCompra",
                onlyNumbers(event.target.value),
              )
            }
            size="small"
            fullWidth
            slotProps={{
              htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Button
            variant="contained"
            startIcon={
              searching ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            onClick={onSearch}
            fullWidth
            disabled={searching}
            sx={{ height: 40, whiteSpace: "nowrap" }}
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
