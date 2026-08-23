import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { ContribuyenteFormValues } from "../../hooks/useContribuyenteForm";
import type { ContribuyenteDireccion } from "../../types/formTypes";

interface Props {
  form: UseFormReturn<ContribuyenteFormValues>;
  direccion: ContribuyenteDireccion | null;
  nFinca?: string;
  otroNumero?: string;
  disabled: boolean;
  juridica: boolean;
  onOpen: () => void;
  getText: (direccion: ContribuyenteDireccion | null, nFinca?: string, otroNumero?: string) => string;
}

export const PersonaDireccionFields = ({ form, direccion, nFinca, otroNumero, disabled, juridica, onOpen, getText }: Props) => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "150px 110px 130px minmax(280px, 1fr)" }, gap: 1.5, alignItems: "start" }}>
    <Button size="small" variant="outlined" onClick={(event) => { event.currentTarget.blur(); onOpen(); }} disabled={disabled} startIcon={<LocationOnIcon fontSize="small" />} sx={{ height: 40 }}>
      {direccion ? "Cambiar" : juridica ? "Seleccionar dirección" : "Seleccionar"}
    </Button>
    <Controller name="nFinca" control={form.control} render={({ field }) => <TextField {...field} size="small" label="N° Finca" disabled={disabled || !direccion} fullWidth />} />
    <Controller name="otroNumero" control={form.control} render={({ field }) => <TextField {...field} size="small" label="Otro N°" disabled={disabled || !direccion} fullWidth />} />
    {direccion && <Alert severity="info" sx={{ height: 40, py: 0, alignItems: "center", overflow: "hidden" }}><Typography variant="caption" noWrap>📍 {getText(direccion, nFinca || "", otroNumero || "")}</Typography></Alert>}
  </Box>
);
