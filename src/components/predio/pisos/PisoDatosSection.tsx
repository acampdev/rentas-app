import { Autocomplete, Box, Card, CardContent, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type { PisoFormData } from "./registrosPisos.types";

interface Props {
  form: PisoFormData;
  errors: Record<string, string>;
  estados: OptionFormat[];
  materiales: OptionFormat[];
  loadingEstados: boolean;
  loadingMateriales: boolean;
  onChange: <K extends keyof PisoFormData>(field: K, value: PisoFormData[K]) => void;
}

const numberSx = { "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" }, "& input[type=number]": { MozAppearance: "textfield" } };

export const PisoDatosSection = ({ form, errors, estados, materiales, loadingEstados, loadingMateriales, onChange }: Props) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Datos del piso</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "120px 120px 190px 130px minmax(190px, 1fr)" }, gap: 2 }}>
        <TextField size="small" type="number" label="Año" value={form.anio || ""} onChange={(event) => onChange("anio", Number(event.target.value) || undefined)} sx={numberSx} />
        <TextField size="small" type="number" label="N° piso" value={form.descripcion} onChange={(event) => onChange("descripcion", event.target.value)} error={Boolean(errors.descripcion)} helperText={errors.descripcion} required sx={numberSx} />
        <DatePicker label="Fecha construcción" value={form.fechaConstruccion} onChange={(value) => onChange("fechaConstruccion", value)} slotProps={{ textField: { size: "small", required: true, error: Boolean(errors.fechaConstruccion), helperText: errors.fechaConstruccion } }} />
        <TextField size="small" label="Antigüedad" value={form.antiguedad} slotProps={{ input: { readOnly: true } }} />
        <Autocomplete options={estados} loading={loadingEstados} value={estados.find((item) => String(item.value) === form.estadoConservacion) || null} getOptionLabel={(item) => item.label} isOptionEqualToValue={(a, b) => String(a.value) === String(b.value)} onChange={(_, value) => onChange("estadoConservacion", String(value?.value || ""))} renderInput={(params) => <TextField {...params} size="small" label="Estado de conservación" required error={Boolean(errors.estadoConservacion)} helperText={errors.estadoConservacion} />} />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "180px 240px 180px" }, gap: 2, mt: 2 }}>
        <TextField size="small" type="number" label="Área construida (m²)" value={form.areaConstruida} onChange={(event) => onChange("areaConstruida", event.target.value)} error={Boolean(errors.areaConstruida)} helperText={errors.areaConstruida} required sx={numberSx} />
        <Autocomplete options={materiales} loading={loadingMateriales} value={materiales.find((item) => String(item.value) === form.materialPredominante) || null} getOptionLabel={(item) => item.label} isOptionEqualToValue={(a, b) => String(a.value) === String(b.value)} onChange={(_, value) => onChange("materialPredominante", String(value?.value || ""))} renderInput={(params) => <TextField {...params} size="small" label="Material predominante" required error={Boolean(errors.materialPredominante)} helperText={errors.materialPredominante} />} />
        <TextField size="small" type="number" label="Áreas comunes" value={form.areasComunes || ""} onChange={(event) => onChange("areasComunes", event.target.value)} sx={numberSx} />
      </Box>
    </CardContent>
  </Card>
);
