import { Add, Save } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { DireccionFormData } from "./direccionForm.schema";

type Option = Record<string, any>;
interface Props {
  form: UseFormReturn<DireccionFormData, unknown, DireccionFormData>;
  sectores: Option[];
  barrios: Option[];
  calles: Option[];
  ladoOptions: Option[];
  rutaOptions: Option[];
  zonaOptions: Option[];
  areasVerdesOptions: Option[];
  loadingRutas: boolean;
  loadingZonas: boolean;
  loadingAreasVerdes: boolean;
  loading: boolean;
  isEditMode: boolean;
  onSubmit: (data: DireccionFormData) => Promise<void>;
  onNuevo: () => void;
}
const numberInputSx = {
  width: 120,
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

export const DireccionFormFields = ({
  form,
  sectores,
  barrios,
  calles,
  ladoOptions,
  rutaOptions,
  zonaOptions,
  areasVerdesOptions,
  loadingRutas,
  loadingZonas,
  loadingAreasVerdes,
  loading,
  isEditMode,
  onSubmit,
  onNuevo,
}: Props) => {
  const [focused, setFocused] = useState<"inicial" | "final" | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = form;
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "#fff" }}>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>Faltan datos obligatorios</AlertTitle>Por favor, verifique
          los campos marcados en rojo.
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <MasterAutocomplete
            name="codigoSector"
            label="Sector"
            control={control}
            options={sectores}
            optionLabel="nombre"
            optionId="id"
            flex="1 1 300px"
          />
          <MasterAutocomplete
            name="codigoBarrio"
            label="Barrio"
            control={control}
            options={barrios}
            optionLabel="nombre"
            optionId="id"
            flex="1 1 200px"
          />
          <MasterAutocomplete
            name="codigoCalle"
            label="Calle"
            control={control}
            options={calles}
            optionLabel="nombreVia"
            fallbackLabel="nombre"
            optionId="codVia"
            fallbackId="codigo"
            flex="1 1 300px"
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <MasterAutocomplete
            name="lado"
            label="Lado"
            control={control}
            options={ladoOptions}
            optionLabel="label"
            optionId="value"
            flex="1 1 150px"
            stringValue
            defaultValue="8103"
          />
          <TextField
            {...register("cuadra")}
            label="Cuadra"
            type="number"
            size="small"
            sx={{ ...numberInputSx, width: 100 }}
          />
          <TextField
            {...register("manzana")}
            label="Manzana"
            size="small"
            sx={{ width: 100 }}
          />
          {(["loteInicial", "loteFinal"] as const).map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={name === "loteInicial" ? "Lote Inicial" : "Lote Final"}
                  type="number"
                  size="small"
                  value={
                    focused ===
                      (name === "loteInicial" ? "inicial" : "final") &&
                    field.value === 0
                      ? ""
                      : field.value
                  }
                  onFocus={() =>
                    setFocused(name === "loteInicial" ? "inicial" : "final")
                  }
                  onBlur={() => {
                    setFocused(null);
                    field.onBlur();
                  }}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? 0
                        : Number(event.target.value),
                    )
                  }
                  sx={numberInputSx}
                />
              )}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <MasterAutocomplete
            name="ruta"
            label="Ruta"
            control={control}
            options={rutaOptions}
            optionLabel="label"
            optionId="value"
            flex="1 1 200px"
            loading={loadingRutas}
          />
          <MasterAutocomplete
            name="zona"
            label="Zona"
            control={control}
            options={zonaOptions}
            optionLabel="label"
            optionId="value"
            flex="1 1 200px"
            loading={loadingZonas}
          />
          <MasterAutocomplete
            name="ubicacionAreaVerde"
            label="Ubicación Área Verde"
            control={control}
            options={areasVerdesOptions}
            optionLabel="label"
            optionId="value"
            flex="1 1 250px"
            loading={loadingAreasVerdes}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            pt: 2,
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            disabled={loading || isSubmitting}
            startIcon={
              loading || isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save />
              )
            }
            sx={{
              bgcolor: "#10b981",
              color: "white",
              fontWeight: 700,
              minWidth: 130,
            }}
          >
            {isEditMode ? "Actualizar" : "Guardar"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              reset();
              onNuevo();
            }}
            startIcon={<Add />}
          >
            Nuevo
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

interface MasterProps {
  name: keyof DireccionFormData;
  label: string;
  control: UseFormReturn<DireccionFormData>["control"];
  options: Option[];
  optionLabel: string;
  fallbackLabel?: string;
  optionId: string;
  fallbackId?: string;
  flex: string;
  loading?: boolean;
  stringValue?: boolean;
  defaultValue?: string;
}
const MasterAutocomplete = ({
  name,
  label,
  control,
  options,
  optionLabel,
  fallbackLabel,
  optionId,
  fallbackId,
  flex,
  loading,
  stringValue,
  defaultValue,
}: MasterProps) => (
  <Box sx={{ flex }}>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          options={options}
          loading={loading}
          getOptionLabel={(option) =>
            option[optionLabel] ||
            (fallbackLabel ? option[fallbackLabel] : "") ||
            ""
          }
          value={
            options.find(
              (option) =>
                String(
                  option[optionId] ?? (fallbackId ? option[fallbackId] : ""),
                ) === String(field.value),
            ) || null
          }
          isOptionEqualToValue={(option, value) =>
            String(
              option[optionId] ?? (fallbackId ? option[fallbackId] : ""),
            ) ===
            String(value?.[optionId] ?? (fallbackId ? value?.[fallbackId] : ""))
          }
          onChange={(_, value) => {
            const selected =
              value?.[optionId] ?? (fallbackId ? value?.[fallbackId] : null);
            field.onChange(
              stringValue
                ? String(selected || defaultValue || "")
                : selected
                  ? Number(selected)
                  : null,
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label={label} size="small" />
          )}
        />
      )}
    />
  </Box>
);
