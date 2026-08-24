import { LocationOn } from "@mui/icons-material";
import { Alert, Box, Button, TextField, alpha } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { PredioFormData } from "../../../hooks/usePredioForm";
import type { usePredioForm } from "../../../hooks/usePredioForm";
import { PredioAutocomplete } from "./PredioAutocomplete";
import { buildDireccionCompleta } from "./predioForm.utils";

type Options = ReturnType<typeof usePredioForm>["options"];
interface Props {
  form: UseFormReturn<PredioFormData>;
  options: Options;
  isUsoPredioDisabled: boolean;
  loading: boolean;
  onOpenDireccion: () => void;
  direccion: PredioFormData["direccion"];
  numeroFinca?: string;
  otroNumero?: string;
}

export const PredioFields = ({
  form,
  options,
  isUsoPredioDisabled,
  loading,
  onOpenDireccion,
  direccion,
  numeroFinca,
  otroNumero,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: "0 0 120px" }}>
          <Controller
            name="anio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label="Año"
                type="number"
                error={!!errors.anio}
                helperText={errors.anio?.message}
              />
            )}
          />
        </Box>
        <Box sx={{ flex: "0 0 160px" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Controller
              name="fechaAdquisicion"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Fecha adquisición"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.fechaAdquisicion,
                      helperText: errors.fechaAdquisicion?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ flex: "0 0 220px" }}>
          <PredioAutocomplete
            name="estadoPredio"
            label="Estado Predio"
            options={options.estadoPredioData}
            loading={options.loading.estado}
            loadError={options.errors.estado}
            control={control}
            errors={errors}
            required={false}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: "0 0 250px" }}>
          <PredioAutocomplete
            name="tipoPredio"
            label="Tipo Predio"
            options={options.tipoPredioData}
            loading={options.loading.tipo}
            loadError={options.errors.tipo}
            control={control}
            errors={errors}
            required={false}
          />
        </Box>
        <Box sx={{ flex: "0 0 600px" }}>
          <PredioAutocomplete
            name="clasificacionPredio"
            label="Clasificacion Predio"
            options={options.clasificacionPredioFiltrada}
            loading={options.loading.clasificacion}
            loadError={options.errors.clasificacion}
            control={control}
            errors={errors}
            required={false}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: "0 0 250px" }}>
          <PredioAutocomplete
            name="usoPredio"
            label="Uso Predio"
            options={options.usoPredioData}
            loading={options.loading.uso}
            loadError={options.errors.uso}
            control={control}
            errors={errors}
            required={false}
            disabled={isUsoPredioDisabled}
          />
        </Box>
        <Box sx={{ flex: "0 0 280px" }}>
          <PredioAutocomplete
            name="condicionPropiedad"
            label="Condicion Propiedad"
            options={options.condicionData}
            loading={options.loading.condicion}
            loadError={options.errors.condicion}
            control={control}
            errors={errors}
          />
        </Box>
        <Box sx={{ flex: "0 0 150px" }}>
          <PredioAutocomplete
            name="conductor"
            label="Conductor"
            options={options.conductorData}
            loading={options.loading.conductor}
            loadError={options.errors.conductor}
            control={control}
            errors={errors}
          />
        </Box>
        <Box sx={{ flex: "0 0 80px" }}>
          <Controller
            name="areaTerreno"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Área m2"
                type="number"
                fullWidth
                size="small"
                error={!!errors.areaTerreno}
                helperText={errors.areaTerreno?.message}
                onFocus={() => Number(field.value) === 0 && field.onChange("")}
                onBlur={() => {
                  if (String(field.value) === "" || field.value == null)
                    field.onChange(0);
                  field.onBlur();
                }}
                sx={{
                  "& input[type=number]": { MozAppearance: "textfield" },
                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                }}
              />
            )}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={onOpenDireccion}
          disabled={loading}
          startIcon={<LocationOn />}
          size="small"
          sx={{
            height: 40,
            bgcolor: "#3b82f6 !important",
            color: "white !important",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 1.5,
            boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
            "&:hover": {
              bgcolor: "#2563eb !important",
              boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
            },
            "&.Mui-disabled": {
              bgcolor: `${alpha("#3b82f6", 0.5)} !important`,
              color: "rgba(255,255,255,.7)",
            },
          }}
        >
          Seleccionar dirección
        </Button>
        <Box sx={{ flex: "0 0 100px" }}>
          <Controller
            name="numeroFinca"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="N° finca" fullWidth size="small" />
            )}
          />
        </Box>
        <Box sx={{ flex: "0 0 100px" }}>
          <Controller
            name="otroNumero"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Otro N°" fullWidth size="small" />
            )}
          />
        </Box>
        <Box sx={{ flex: "0 0 70px" }}>
          <Controller
            name="arancel"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Arancel"
                fullWidth
                size="small"
                disabled
                InputProps={{ readOnly: true }}
              />
            )}
          />
        </Box>
      </Box>
      {direccion && (
        <Alert severity="info" sx={{ py: 0.5, fontSize: "0.75rem" }}>
          📍 {buildDireccionCompleta(direccion, numeroFinca, otroNumero)}
        </Alert>
      )}
    </Box>
  );
};
