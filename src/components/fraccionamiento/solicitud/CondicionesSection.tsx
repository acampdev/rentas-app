import { CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import type { OptionFormat } from '../../../hooks/useConstantesOptions';
import type { SolicitudFieldChange, SolicitudFraccionamientoValues } from './solicitudFraccionamiento.types';
import { SolicitudSection } from './SolicitudSection';

interface CondicionesSectionProps {
  values: SolicitudFraccionamientoValues;
  options: OptionFormat[];
  loadingOptions: boolean;
  onChange: SolicitudFieldChange;
}

export const CondicionesSection = ({ values, options, loadingOptions, onChange }: CondicionesSectionProps) => (
  <SolicitudSection title="Condiciones del Fraccionamiento" icon={<CalculateIcon />}>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          label="Tipo de Resolución"
          value={values.tipoResolucion}
          onChange={(event) => onChange('tipoResolucion', event.target.value)}
          disabled={loadingOptions}
          slotProps={{ input: { endAdornment: loadingOptions ? <CircularProgress size={20} /> : undefined } }}
        >
          {options.map((option) => <MenuItem key={option.value} value={option.value}>{option.label} ({option.value})</MenuItem>)}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth disabled label="Deuda Insoluta" type="number" value={values.deudaInsoluta} helperText="Monto total calculado de años anteriores" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Cuota Inicial" type="number" value={values.cuotaInicial} onChange={(event) => onChange('cuotaInicial', event.target.value)} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Nº Cuota" type="number" value={values.numeroCuotas} onChange={(event) => onChange('numeroCuotas', event.target.value)} slotProps={{ htmlInput: { min: 1, max: 60 } }} helperText="Rango admitido: 1 a 60 cuotas" />
      </Grid>
    </Grid>
  </SolicitudSection>
);
