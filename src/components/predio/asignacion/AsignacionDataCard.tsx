import { Assignment } from "@mui/icons-material";
import {
  alpha,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { AsignacionFormData } from "./asignacionPredio.types";

interface Option {
  value: string | number;
  label: string;
}
interface Props {
  form: AsignacionFormData;
  modes: Option[];
  loading: boolean;
  edit: boolean;
  unassign: boolean;
  onUpdate: <K extends keyof AsignacionFormData>(
    field: K,
    value: AsignacionFormData[K],
  ) => void;
  onSubmit: () => void;
  onClear: () => void;
}
export const AsignacionDataCard = ({
  form,
  modes,
  loading,
  edit,
  unassign,
  onUpdate,
  onSubmit,
  onClear,
}: Props) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Assignment color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Datos de la asignación
        </Typography>
      </Stack>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Autocomplete
          sx={{ width: 280 }}
          disabled={unassign}
          options={modes}
          getOptionLabel={(option) => option.label || ""}
          value={
            modes.find(
              (option) => String(option.value) === form.modoDeclaracion,
            ) || null
          }
          onChange={(_, option) =>
            onUpdate("modoDeclaracion", String(option?.value || ""))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Modo Declaración"
              size="small"
              required
            />
          )}
        />
        <DatePicker
          label="Fecha declaración"
          disabled={unassign}
          value={form.fechaDeclaracion}
          onChange={(value) => onUpdate("fechaDeclaracion", value)}
          slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
        />
        <DatePicker
          label="Fecha venta"
          disabled={unassign}
          value={form.fechaVenta}
          onChange={(value) => onUpdate("fechaVenta", value)}
          slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
        />
        <TextField
          label="Porcentaje condómino"
          type="number"
          size="small"
          disabled={unassign}
          value={form.porcentajeCondomino}
          onChange={(event) =>
            onUpdate("porcentajeCondomino", event.target.value)
          }
          slotProps={{
            htmlInput: { min: 0, max: 100, step: 0.01 },
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
          }}
          sx={{
            width: 190,
            "& input[type=number]": { MozAppearance: "textfield" },
            "& input[type=number]::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
            },
          }}
        />
      </Box>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Assignment />
            )
          }
          sx={{
            bgcolor: `${unassign ? "#ef4444" : "#10b981"} !important`,
            color: "white !important",
            fontWeight: "bold",
            height: 40,
            "&.Mui-disabled": {
              bgcolor: `${alpha(unassign ? "#ef4444" : "#10b981", 0.5)} !important`,
            },
          }}
        >
          {unassign ? "Desasignar" : edit ? "Actualizar" : "Registrar"}
        </Button>
        {!unassign && (
          <Button
            variant="outlined"
            onClick={onClear}
            sx={{ fontWeight: "bold", height: 40 }}
          >
            Limpiar
          </Button>
        )}
      </Box>
    </CardContent>
  </Card>
);
