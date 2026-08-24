import { Add, Clear, Edit, Save } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { Controller, type UseFormReturn } from "react-hook-form";
import type {
  CuadranteData,
  UnidadUrbanaData,
} from "../../services/SectorService";
import type { SectorFormProps, SectorFormValues } from "./sectorForm.schema";

interface Props extends Pick<
  SectorFormProps,
  "sectorSeleccionado" | "onEditar" | "modoOffline" | "loading" | "isEditMode"
> {
  form: UseFormReturn<SectorFormValues>;
  cuadrantes: CuadranteData[];
  unidades: UnidadUrbanaData[];
  loadingCuadrantes: boolean;
  loadingUnidades: boolean;
  onSubmit: (data: SectorFormValues) => Promise<void>;
  onNuevo: () => void;
}
const actionSx = {
  minWidth: 80,
  height: 40,
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 600,
} as const;

export const SectorFormView = ({
  form,
  cuadrantes,
  unidades,
  loadingCuadrantes,
  loadingUnidades,
  onSubmit,
  onNuevo,
  sectorSeleccionado,
  onEditar,
  modoOffline = false,
  loading = false,
  isEditMode = false,
}: Props) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = form;
  const disabled = Boolean(loading || (sectorSeleccionado && !isEditMode));
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        pb: 1,
        borderRadius: 2,
        background: "linear-gradient(to bottom, #ffffff, #fafafa)",
        border: "1px solid",
        borderColor: "divider",
        width: { xs: "100%", md: "80%", lg: "100%" },
        mx: "auto",
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexWrap: "wrap",
            gap: { xs: 1.5, sm: 2 },
            mb: 1.5,
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          <Box sx={{ flex: "1 1 200px", minWidth: { xs: "100%", sm: 200 } }}>
            <Controller
              name="codUnidadUrbana"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={unidades}
                  getOptionLabel={(option) =>
                    option.descripcionUnidadUrbana ||
                    `Unidad ${option.codUnidadUrbana}`
                  }
                  value={
                    unidades.find(
                      (item) => item.codUnidadUrbana === field.value,
                    ) || null
                  }
                  onChange={(_, value) =>
                    field.onChange(value?.codUnidadUrbana || undefined)
                  }
                  loading={loadingUnidades}
                  disabled={disabled || loadingUnidades}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unidad Urbana"
                      error={Boolean(errors.codUnidadUrbana)}
                      helperText={errors.codUnidadUrbana?.message}
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        sx: { height: 40 },
                        endAdornment: (
                          <>
                            {loadingUnidades && (
                              <CircularProgress color="inherit" size={20} />
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: "1 1 250px", minWidth: { xs: "100%", sm: 250 } }}>
            <TextField
              {...register("nombre")}
              label="Nombre del Sector *"
              placeholder="Ingrese el nombre del sector"
              fullWidth
              size="small"
              error={Boolean(errors.nombre)}
              helperText={errors.nombre?.message}
              disabled={disabled}
              inputProps={{ maxLength: 100 }}
              InputProps={{
                endAdornment:
                  watch("nombre") && !disabled ? (
                    <Tooltip title="Limpiar">
                      <IconButton
                        size="small"
                        onClick={() => setValue("nombre", "")}
                        edge="end"
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : undefined,
                sx: { height: 40 },
              }}
            />
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: { xs: "100%", sm: 200 } }}>
            <Controller
              name="cuadrante"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={cuadrantes}
                  getOptionLabel={(option) =>
                    option.abreviatura || `Cuadrante ${option.codCuadrante}`
                  }
                  value={
                    cuadrantes.find(
                      (item) => item.codCuadrante === field.value,
                    ) || null
                  }
                  onChange={(_, value) =>
                    field.onChange(value?.codCuadrante || undefined)
                  }
                  loading={loadingCuadrantes}
                  disabled={disabled || loadingCuadrantes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cuadrante"
                      error={Boolean(errors.cuadrante)}
                      helperText={errors.cuadrante?.message}
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        sx: { height: 40 },
                        endAdornment: (
                          <>
                            {loadingCuadrantes && (
                              <CircularProgress color="inherit" size={20} />
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "flex-end",
            mb: 1.5,
          }}
        >
          <Button
            type="button"
            variant="outlined"
            startIcon={<Add />}
            onClick={onNuevo}
            disabled={loading}
            sx={actionSx}
          >
            Nuevo
          </Button>
          {onEditar && (
            <Button
              type="button"
              variant="outlined"
              startIcon={<Edit />}
              onClick={onEditar}
              disabled={loading || (isDirty && isValid)}
              sx={actionSx}
            >
              Editar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save />
              )
            }
            disabled={loading || !isDirty || !isValid}
            sx={{ ...actionSx, minWidth: 100 }}
          >
            {loading
              ? isEditMode && sectorSeleccionado
                ? "Actualizando..."
                : "Guardando..."
              : isEditMode && sectorSeleccionado
                ? "Actualizar"
                : "Guardar"}
          </Button>
        </Box>
        {modoOffline && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            Modo sin conexión. Los cambios se sincronizarán cuando se
            restablezca la conexión.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};
