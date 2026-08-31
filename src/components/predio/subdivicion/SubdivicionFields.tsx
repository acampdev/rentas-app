import { Home, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type {
  SubdivicionField,
  SubdivicionFormData,
} from "./subdivicion.types";
import { SubdivicionCatalogSelect } from "./SubdivicionCatalogSelect";
import type { SubdivicionCatalogs } from "./useSubdivicionCatalogs";
import {
  getMatrixAddress,
  normalizePositiveDecimalInput,
} from "./subdivicion.utils";

interface Props {
  form: SubdivicionFormData;
  onChange: (field: SubdivicionField, value: string | number) => void;
  onOpenSelector: () => void;
}

interface NuevoPredioProps extends Omit<Props, "onOpenSelector"> {
  catalogs: SubdivicionCatalogs;
}

const noSpinnerSx = {
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

const NumberField = ({
  field,
  label,
  value,
  onChange,
  disabled = false,
  positiveDecimalOnly = false,
}: {
  field: SubdivicionField;
  label: string;
  value: string;
  onChange: Props["onChange"];
  disabled?: boolean;
  positiveDecimalOnly?: boolean;
}) => (
  <TextField
    fullWidth
    size="small"
    type={positiveDecimalOnly ? "text" : "number"}
    label={label}
    value={value}
    disabled={disabled}
    onChange={(event) => {
      if (!positiveDecimalOnly) {
        onChange(field, event.target.value);
        return;
      }
      const normalized = normalizePositiveDecimalInput(event.target.value);
      if (normalized !== null) onChange(field, normalized);
    }}
    sx={noSpinnerSx}
    slotProps={{
      htmlInput: positiveDecimalOnly
        ? { inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]*" }
        : { min: 0, inputMode: "decimal" },
    }}
  />
);

export const PredioMatrizSection = ({
  form,
  onChange,
  onOpenSelector,
}: Props) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>
        <Home sx={{ mr: 1, verticalAlign: "middle" }} /> Predio matriz
      </Typography>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Search />}
            onClick={onOpenSelector}
            sx={{ height: 40 }}
          >
            Seleccionar predio
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField fullWidth size="small" label="Año" value={form.anio} disabled />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 3 }}>
          <TextField fullWidth size="small" label="Código predio matriz" value={form.codPredioMatriz} disabled />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Dirección matriz"
            value={getMatrixAddress(form.predioMatriz)}
            disabled
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <NumberField field="numeroFincaNuevo" label="N.º finca" value={form.numeroFincaNuevo} onChange={onChange} disabled />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField fullWidth size="small" label="Otro N.º" value={form.otroNumeroNuevo} onChange={(e) => onChange("otroNumeroNuevo", e.target.value)} disabled />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <NumberField field="areaTerrenoNuevaMatriz" label="Área Terreno Nueva Matriz" value={form.areaTerrenoNuevaMatriz} onChange={onChange} disabled />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <NumberField field="valorTerrenoNuevoMatriz" label="Nuevo valor terreno matriz" value={form.valorTerrenoNuevoMatriz} onChange={onChange} disabled />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export const NuevoPredioSection = ({ form, onChange, catalogs }: NuevoPredioProps) => {
  const classificationCode = String(form.codClasificacionNuevo).trim();
  const classificationLabel = catalogs.clasificaciones.options
    .find((option) => String(option.value).trim() === classificationCode)
    ?.label.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase() || "";
  const isCasaHabitacion =
    classificationCode === "0501" ||
    (classificationLabel.includes("CASA") && classificationLabel.includes("HABITACION"));

  const changeClassification = (field: SubdivicionField, value: string) => {
    onChange(field, value);
    const optionLabel = catalogs.clasificaciones.options
      .find((option) => String(option.value).trim() === value.trim())
      ?.label.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase() || "";
    if (value.trim() === "0501" || (optionLabel.includes("CASA") && optionLabel.includes("HABITACION")))
      onChange("codUsoNuevo", "");
  };

  return <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Datos del nuevo predio</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><TextField fullWidth size="small" type="date" label="Fecha adquisición" value={form.fechaAdquisicionNuevo} onChange={(e) => onChange("fechaAdquisicionNuevo", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><SubdivicionCatalogSelect field="codClasificacionNuevo" label="Clasificación predio" value={form.codClasificacionNuevo} catalog={catalogs.clasificaciones} onChange={changeClassification} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><SubdivicionCatalogSelect field="estPredioNuevo" label="Estado del predio" value={form.estPredioNuevo} catalog={catalogs.estados} onChange={onChange} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><SubdivicionCatalogSelect field="codTipoPredioNuevo" label="Tipo predio" value={form.codTipoPredioNuevo} catalog={catalogs.tipos} onChange={onChange} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><SubdivicionCatalogSelect field="codCondicionPropiedadNuevo" label="Condición de propiedad" value={form.codCondicionPropiedadNuevo} catalog={catalogs.condiciones} onChange={onChange} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><SubdivicionCatalogSelect field="codUsoNuevo" label="Uso predio" value={form.codUsoNuevo} catalog={catalogs.usos} onChange={onChange} disabled={isCasaHabitacion} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><SubdivicionCatalogSelect field="codListaConductorNuevo" label="Conductor" value={form.codListaConductorNuevo} catalog={catalogs.conductores} onChange={onChange} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><NumberField field="areaTerrenoNuevo" label="Área Terreno Nuevo" value={form.areaTerrenoNuevo} onChange={onChange} positiveDecimalOnly /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><NumberField field="valorOtrasInstalacionesNuevo" label="Valor otras instalaciones" value={form.valorOtrasInstalacionesNuevo} onChange={onChange} positiveDecimalOnly /></Grid>
      </Grid>
    </CardContent>
  </Card>;
};

export const SubdivicionOperationSection = ({ form, onChange }: Omit<Props, "onOpenSelector">) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" fontWeight={700} mb={2}>Datos de la subdivisión</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 260px))" }, gap: 2 }}>
        <TextField fullWidth size="small" type="date" label="Fecha subdivisión" value={form.fechaSubdivision} onChange={(e) => onChange("fechaSubdivision", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        <NumberField field="periodoEfectivoArbitrios" label="Periodo efectivo arbitrios (1-12)" value={form.periodoEfectivoArbitrios} onChange={onChange} />
      </Box>
    </CardContent>
  </Card>
);
