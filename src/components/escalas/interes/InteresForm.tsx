import { Add, Percent, Save } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import type { ChangeEvent } from "react";
import type { InteresFormState } from "./interes.types";

interface Props {
  form: InteresFormState;
  editing: boolean;
  saving: boolean;
  invalid: boolean;
  onChange: (field: keyof InteresFormState, value: string) => void;
  onReset: () => void;
  onSave: () => void;
}

export function InteresForm({
  form,
  editing,
  saving,
  invalid,
  onChange,
  onReset,
  onSave,
}: Props) {
  const field = (name: keyof InteresFormState) => ({
    value: form[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      onChange(name, event.target.value),
  });
  return (
    <Box sx={{ px: 3 }}>
      <Paper
        variant="outlined"
        sx={{ p: 3, bgcolor: alpha("#f5f5f5", 0.5), borderRadius: 2 }}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            <TextField
              label="Cód. Interés"
              type="number"
              size="small"
              {...field("codInteres")}
              disabled={editing}
              required
            />
            <TextField
              label="Año Fiscal"
              type="number"
              size="small"
              {...field("anio")}
              required
            />
            <TextField
              label="Tasa (%)"
              type="number"
              size="small"
              {...field("tasa")}
              slotProps={{
                input: {
                  endAdornment: <Percent fontSize="small" color="action" />,
                },
              }}
              required
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            <TextField
              label="Código Tipo"
              size="small"
              {...field("codTipo")}
              required
            />
            <TextField
              label="Código Clase"
              size="small"
              {...field("codClase")}
              required
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={onReset}
              disabled={saving}
            >
              Nuevo
            </Button>
            <Button
              variant="contained"
              startIcon={
                saving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Save />
                )
              }
              onClick={onSave}
              disabled={saving || invalid}
              sx={{ bgcolor: "#10b981", minWidth: 150 }}
            >
              {editing ? "Modificar" : "Guardar"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
