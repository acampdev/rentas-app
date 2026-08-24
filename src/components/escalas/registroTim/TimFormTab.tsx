import { Button, Stack, TextField, Typography } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import type { TimFormValues, TimOption } from "./registroTim.types";
import { TimTributoField } from "./TimTributoField";

interface Props {
  form: TimFormValues;
  setForm: Dispatch<SetStateAction<TimFormValues>>;
  options: TimOption[];
  loadingTributes: boolean;
  saving: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function TimFormTab({
  form,
  setForm,
  options,
  loadingTributes,
  saving,
  onReset,
  onSave,
}: Props) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" fontWeight={600}>
        Registrar Nueva Escala TIM
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          label="Año"
          type="number"
          value={form.anio}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              anio:
                Number.parseInt(event.target.value) || new Date().getFullYear(),
            }))
          }
          sx={{ width: 100 }}
          size="small"
          slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
        />
        <TextField
          label="Tasa"
          type="number"
          value={form.tasa}
          onChange={(event) =>
            setForm((previous) => ({ ...previous, tasa: event.target.value }))
          }
          sx={{ width: 100 }}
          size="small"
          placeholder="0.00"
          slotProps={{ htmlInput: { step: 0.0001, min: 0 } }}
        />
        <TextField
          label="Periodo (Mes)"
          type="number"
          value={form.periodo}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              periodo: Number.parseInt(event.target.value) || 1,
            }))
          }
          sx={{ width: 140 }}
          size="small"
          slotProps={{ htmlInput: { min: 1, max: 12 } }}
        />
        <TimTributoField
          value={form.tributo}
          options={options}
          loading={loadingTributes}
          onChange={(tributo) =>
            setForm((previous) => ({ ...previous, tributo }))
          }
        />
        <TextField
          label="Cód. Resolución"
          type="number"
          value={form.resolucionInteres}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              resolucionInteres: Number.parseInt(event.target.value) || 2,
            }))
          }
          sx={{ width: 150 }}
          size="small"
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          color="inherit"
          onClick={onReset}
          sx={{ minWidth: 120, height: 40 }}
        >
          Nuevo
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving}
          sx={{
            minWidth: 120,
            height: 40,
            backgroundColor: "#3b82f6 !important",
            color: "white !important",
            fontWeight: "bold",
          }}
        >
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </Stack>
    </Stack>
  );
}
