import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Card, CardContent, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import type { Predio } from "../../../models/Predio";

interface Props {
  predio: Predio | null;
  error?: string;
  readOnly?: boolean;
  onOpenSelector: () => void;
}

export const PisoPredioSection = ({ predio, error, readOnly, onOpenSelector }: Props) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Seleccionar predio</Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
        <Box>
          <Button variant="outlined" startIcon={<SearchIcon />} onClick={onOpenSelector} disabled={readOnly} sx={{ height: 40 }}>
            {readOnly ? "Predio seleccionado" : "Seleccionar predio"}
          </Button>
          {error && <FormHelperText error>{error}</FormHelperText>}
        </Box>
        <TextField size="small" label="Código de predio" value={predio?.codPredio || predio?.codigoPredio || ""} slotProps={{ input: { readOnly: true, startAdornment: <HomeIcon fontSize="small" sx={{ mr: 1 }} /> } }} sx={{ width: 180 }} />
        <TextField size="small" label="Año" value={predio?.anio || ""} slotProps={{ input: { readOnly: true } }} sx={{ width: 100 }} />
        <TextField size="small" label="Área terreno" value={predio ? `${predio.areaTerreno || 0} m²` : ""} slotProps={{ input: { readOnly: true } }} sx={{ width: 150 }} />
        <TextField size="small" label="Conductor" value={predio?.conductor || ""} slotProps={{ input: { readOnly: true } }} sx={{ minWidth: 180 }} />
      </Stack>
      {predio && (
        <TextField fullWidth size="small" label="Dirección" value={predio.direccion || predio.direccionCompleta || ""} slotProps={{ input: { readOnly: true } }} sx={{ mt: 2 }} />
      )}
    </CardContent>
  </Card>
);
