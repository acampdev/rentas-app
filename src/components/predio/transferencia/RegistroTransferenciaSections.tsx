import { Clear, PersonSearch, Save, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type {
  TransferenciaFieldChange,
  TransferenciaFormData,
} from "./registroTransferencia.types";

type Option = { value: string | number; label: string };

export const DatosTransferenciaSection = ({
  form,
  onChange,
}: {
  form: TransferenciaFormData;
  onChange: TransferenciaFieldChange;
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="subtitle2"
      color="primary"
      fontWeight={600}
      sx={{ mb: 2 }}
    >
      Datos de la Transferencia
    </Typography>
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
        <TextField
          label="Año"
          type="number"
          value={form.anio}
          onChange={(e) => onChange("anio", e.target.value)}
          fullWidth
          size="small"
          inputProps={{ min: 1900, max: 9999 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
        <TextField
          label="Código de Predio"
          value={form.codigoPredio}
          onChange={(e) => onChange("codigoPredio", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
    </Grid>
  </Box>
);

export const ContribuyenteTransferenciaSection = ({
  tipo,
  form,
  onOpen,
}: {
  tipo: "vendedor" | "comprador";
  form: TransferenciaFormData;
  onOpen: () => void;
}) => {
  const theme = useTheme();
  const value = form[tipo];
  const vendedor = tipo === "vendedor";
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        color="primary"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Datos del {vendedor ? "Vendedor" : "Comprador"}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Button
            variant="contained"
            color={vendedor ? "primary" : "secondary"}
            startIcon={vendedor ? <PersonSearch /> : <ShoppingCart />}
            onClick={onOpen}
            fullWidth
            sx={{ height: 40 }}
          >
            Seleccionar {vendedor ? "Vendedor" : "Comprador"}
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 1 }}>
          <TextField
            label="Código"
            value={value?.codigo || ""}
            fullWidth
            size="small"
            disabled
            InputProps={{
              readOnly: true,
              sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 9 }}>
          <TextField
            label="Nombre Contribuyente"
            value={value?.contribuyente || ""}
            fullWidth
            size="small"
            disabled
            InputProps={{
              readOnly: true,
              sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const DatosComplementariosSection = ({
  form,
  onChange,
  options,
  loading,
}: {
  form: TransferenciaFormData;
  onChange: TransferenciaFieldChange;
  options: Option[];
  loading: boolean;
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="subtitle2"
      color="primary"
      fontWeight={600}
      sx={{ mb: 2 }}
    >
      Datos Complementarios de Transferencia
    </Typography>
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          label="Porcentaje"
          type="number"
          value={form.porcentajeTransferencia}
          onChange={(e) =>
            onChange(
              "porcentajeTransferencia",
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
          fullWidth
          size="small"
          inputProps={{ min: 0, max: 100, step: 0.01 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePicker
          label="Fecha Minuta"
          value={form.fechaMinuta}
          onChange={(value) => onChange("fechaMinuta", value)}
          slotProps={{ textField: { fullWidth: true, size: "small" } }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          label="Documento"
          placeholder="1234-2026"
          value={form.documento}
          onChange={(e) => onChange("documento", e.target.value)}
          fullWidth
          size="small"
          inputProps={{ pattern: "[0-9]+-[0-9]{4}" }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="modo-transferencia-label">
            Modo Transferencia
          </InputLabel>
          <Select
            labelId="modo-transferencia-label"
            label="Modo Transferencia"
            value={form.modoTransferencia}
            onChange={(e) =>
              onChange("modoTransferencia", String(e.target.value))
            }
            disabled={loading}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          label="Valor de Transferencia"
          type="number"
          value={form.valorTransferencia}
          onChange={(e) =>
            onChange(
              "valorTransferencia",
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
          fullWidth
          size="small"
          inputProps={{ min: 0, step: 0.01 }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl
          sx={{
            minHeight: 40,
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FormLabel id="es-constructor-label" sx={{ whiteSpace: "nowrap" }}>
            Es constructor
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="es-constructor-label"
            value={String(form.esConstructor)}
            onChange={(e) =>
              onChange("esConstructor", e.target.value === "true")
            }
            sx={{ flexWrap: "nowrap" }}
          >
            <FormControlLabel
              value="true"
              control={<Radio size="small" />}
              label="True"
            />
            <FormControlLabel
              value="false"
              control={<Radio size="small" />}
              label="False"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  </Box>
);

export const TransferenciaActions = ({
  editing,
  saving,
  onClear,
  onSave,
}: {
  editing: boolean;
  saving: boolean;
  onClear: () => void;
  onSave: () => void;
}) => (
  <>
    <Divider sx={{ my: 3 }} />
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined" startIcon={<Clear />} onClick={onClear}>
        Limpiar
      </Button>
      <Button
        variant="contained"
        startIcon={
          saving ? <CircularProgress size={16} color="inherit" /> : <Save />
        }
        onClick={onSave}
        disabled={saving}
      >
        {editing ? "Actualizar" : "Guardar"}
      </Button>
    </Stack>
  </>
);
export const SectionDivider = () => <Divider sx={{ my: 3 }} />;
