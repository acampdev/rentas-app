import {
  DeleteOutline as ClearIcon,
  Forest as ParkIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  alpha,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type { ParquesJardinesFormState } from "./parquesJardines.types";

interface Props {
  form: ParquesJardinesFormState;
  setForm: Dispatch<SetStateAction<ParquesJardinesFormState>>;
  routes: OptionFormat[];
  locations: OptionFormat[];
  loadingRoutes: boolean;
  loadingLocations: boolean;
  loading: boolean;
  onClear: () => void;
  onSave: () => void;
}

export function ParquesJardinesForm({
  form,
  setForm,
  routes,
  locations,
  loadingRoutes,
  loadingLocations,
  loading,
  onClear,
  onSave,
}: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, mb: 5, bgcolor: alpha("#f5f5f5", 0.5), borderRadius: 2 }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        gutterBottom
        display="flex"
        alignItems="center"
        gap={1}
      >
        <ParkIcon color="primary" fontSize="small" /> Registro de Tasas -
        Parques y Jardines
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          alignItems: "flex-start",
        }}
      >
        <TextField
          label="Año"
          type="number"
          size="small"
          value={form.anio}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              anio: Number.parseInt(event.target.value),
            }))
          }
          sx={{ width: 100 }}
        />
        <TextField
          label="Tasa Anual"
          type="number"
          size="small"
          value={form.tasaAnual}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              tasaAnual: event.target.value,
            }))
          }
          sx={{ width: 140 }}
          slotProps={{
            input: {
              startAdornment: (
                <Typography
                  sx={{ mr: 1, fontWeight: 700, fontSize: "0.85rem" }}
                >
                  S/
                </Typography>
              ),
            },
          }}
        />
        <Autocomplete
          size="small"
          options={routes}
          loading={loadingRoutes}
          value={form.ruta}
          onChange={(_, ruta) => setForm((previous) => ({ ...previous, ruta }))}
          renderInput={(params) => <TextField {...params} label="Ruta" />}
          sx={{ width: { xs: "100%", sm: 100 } }}
        />
        <Autocomplete
          size="small"
          options={locations}
          loading={loadingLocations}
          value={form.ubicacion}
          onChange={(_, ubicacion) =>
            setForm((previous) => ({ ...previous, ubicacion }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Ubicación de Área Verde" />
          )}
          sx={{ width: { xs: "100%", sm: 200 } }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClear}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "divider",
            color: "text.secondary",
            height: 38,
          }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={onSave}
          disabled={loading || !form.ruta || !form.ubicacion || !form.tasaAnual}
          sx={{
            bgcolor: "#10b981",
            color: "white",
            fontWeight: 700,
            minWidth: 160,
            height: 38,
            textTransform: "none",
          }}
        >
          {form.editing ? "Actualizar Tasa" : "Guardar Tasa"}
        </Button>
      </Box>
    </Paper>
  );
}
