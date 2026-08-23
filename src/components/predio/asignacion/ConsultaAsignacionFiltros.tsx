import {
  AddCircleOutline as AddIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box, Button, CircularProgress, TextField, Typography, alpha, useTheme,
} from "@mui/material";
import type { ConsultaAsignacionFiltros as Filtros } from "./consultaAsignacion.types";

interface ConsultaAsignacionFiltrosProps {
  filtros: Filtros;
  loading: boolean;
  onChange: (field: keyof Filtros, value: string) => void;
  onSeleccionarContribuyente: () => void;
  onBuscar: () => void;
  onNuevo: () => void;
}

export const ConsultaAsignacionFiltros = ({
  filtros, loading, onChange, onSeleccionarContribuyente, onBuscar, onNuevo,
}: ConsultaAsignacionFiltrosProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <SearchIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>Buscar contribuyente y predio</Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), border: "1px solid", borderColor: "divider" }}>
        <TextField
          size="small"
          label="Año"
          type="number"
          value={filtros.anio}
          onChange={(event) => onChange("anio", event.target.value)}
          inputProps={{ min: 1900, max: new Date().getFullYear() + 10 }}
          sx={{ width: { xs: "100%", sm: 95 }, "& input[type=number]": { MozAppearance: "textfield" }, "& input[type=number]::-webkit-inner-spin-button": { WebkitAppearance: "none" } }}
        />
        <Button variant="outlined" startIcon={<PersonIcon />} onClick={onSeleccionarContribuyente} sx={{ height: 40, width: { xs: "100%", sm: 215 }, textTransform: "none" }}>
          Seleccionar contribuyente
        </Button>
        <TextField size="small" label="Código" value={filtros.codigoContribuyente} slotProps={{ input: { readOnly: true } }} sx={{ width: { xs: "100%", sm: 105 } }} />
        <TextField size="small" label="Nombre del contribuyente" value={filtros.nombreContribuyente} slotProps={{ input: { readOnly: true } }} sx={{ flex: "1 1 260px" }} />
        <Box sx={{ display: "flex", gap: 1.25, width: { xs: "100%", sm: 220 } }}>
          <Button fullWidth variant="contained" onClick={onBuscar} disabled={loading || (!filtros.anio && !filtros.codigoContribuyente)} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />} sx={{ height: 40 }}>
            Buscar
          </Button>
          <Button fullWidth variant="contained" color="success" onClick={onNuevo} startIcon={<AddIcon />} sx={{ height: 40 }}>
            Nuevo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

