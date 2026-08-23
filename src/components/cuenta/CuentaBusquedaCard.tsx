import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SearchIcon from "@mui/icons-material/Search";
import type { ContribuyenteSeleccionado } from "./cuentaList.types";

interface CuentaBusquedaCardProps {
  contribuyente: ContribuyenteSeleccionado | null;
  codigoContribuyente: string;
  anio: string;
  codigoPredio: string;
  loading: boolean;
  error: string | null;
  onAbrirSelector: () => void;
  onAnioChange: (value: string) => void;
  onCodigoPredioChange: (value: string) => void;
  onBuscar: () => void;
}

const numericFieldSx = {
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

export const CuentaBusquedaCard = ({
  contribuyente,
  codigoContribuyente,
  anio,
  codigoPredio,
  loading,
  error,
  onAbrirSelector,
  onAnioChange,
  onCodigoPredioChange,
  onBuscar,
}: CuentaBusquedaCardProps) => {
  const theme = useTheme();
  const nombre =
    contribuyente?.contribuyente ?? contribuyente?.nombreCompleto ?? "Sin nombre";

  return (
    <Card sx={{ mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
          <PersonSearchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Búsqueda de Cuenta Corriente
        </Typography>
        <Divider sx={{ my: 2.5 }} />
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<PersonSearchIcon />}
              onClick={onAbrirSelector}
              sx={{ width: { xs: "100%", sm: 250 }, height: 40, textTransform: "none" }}
            >
              Seleccionar Contribuyente
            </Button>
            <Box sx={{ flex: "1 1 300px", minHeight: 40, display: "flex", alignItems: "center" }}>
              {contribuyente ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                  <Chip label={`Código: ${codigoContribuyente}`} color="success" size="small" />
                  <Typography fontWeight={700} color="success.dark" noWrap>{nombre}</Typography>
                </Box>
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Seleccione un contribuyente para iniciar la consulta
                </Typography>
              )}
            </Box>
            <TextField
              size="small"
              label="Año"
              type="number"
              value={anio}
              onChange={(event) => onAnioChange(event.target.value)}
              inputProps={{ min: 1900, max: 9999 }}
              sx={{ width: { xs: "100%", sm: 100 }, ...numericFieldSx }}
            />
            <TextField
              size="small"
              label="Código de predio"
              type="number"
              value={codigoPredio}
              onChange={(event) => onCodigoPredioChange(event.target.value)}
              inputProps={{ min: 1 }}
              sx={{ width: { xs: "100%", sm: 160 }, ...numericFieldSx }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
              onClick={onBuscar}
              disabled={!codigoContribuyente || loading}
              sx={{ width: { xs: "100%", sm: 160 }, height: 40, textTransform: "none" }}
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

