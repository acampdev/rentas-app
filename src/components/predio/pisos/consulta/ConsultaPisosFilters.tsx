import { Add, Clear, Search } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  TextField,
  useTheme,
} from "@mui/material";
import type { FiltrosPisosUI } from "./consultaPisos.types";

interface Props {
  filters: FiltrosPisosUI;
  loading: boolean;
  onChange: (filters: FiltrosPisosUI) => void;
  onSearch: () => void;
  onCreate: () => void;
  onClear: () => void;
}

export function ConsultaPisosFilters({
  filters,
  loading,
  onChange,
  onSearch,
  onCreate,
  onClear,
}: Props) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "flex-start",
        bgcolor: alpha(theme.palette.grey[50], 0.5),
        p: 2,
        borderRadius: 2,
      }}
    >
      <TextField
        label="Año"
        type="number"
        size="small"
        sx={{ width: 100 }}
        value={filters.anio || ""}
        onChange={(event) =>
          onChange({ ...filters, anio: Number(event.target.value) || 0 })
        }
      />
      <TextField
        label="Código Predio"
        size="small"
        sx={{ width: 150 }}
        value={filters.codPredio}
        onChange={(event) =>
          onChange({ ...filters, codPredio: event.target.value })
        }
      />
      <Button
        variant="contained"
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : <Search />
        }
        onClick={onSearch}
        disabled={loading}
        sx={{
          bgcolor: "#3b82f6 !important",
          color: "white !important",
          height: 40,
        }}
      >
        Buscar
      </Button>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreate}
        sx={{
          bgcolor: "#10b981 !important",
          color: "white !important",
          height: 40,
        }}
      >
        Nuevo
      </Button>
      <Button
        variant="outlined"
        color="error"
        startIcon={<Clear />}
        onClick={onClear}
        sx={{ height: 40 }}
      >
        Limpiar Tabla
      </Button>
    </Box>
  );
}
