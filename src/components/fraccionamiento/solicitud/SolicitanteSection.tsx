import { Grid, MenuItem, TextField } from '@mui/material';
import type { OptionFormat } from '../../../hooks/useConstantesOptions';
import type { SolicitudFieldChange, SolicitudFraccionamientoValues } from './solicitudFraccionamiento.types';
import { SolicitudSection } from './SolicitudSection';

interface SolicitanteSectionProps {
  values: SolicitudFraccionamientoValues;
  documentOptions: OptionFormat[];
  onChange: SolicitudFieldChange;
}

export const SolicitanteSection = ({ values, documentOptions, onChange }: SolicitanteSectionProps) => (
  <SolicitudSection title="Datos del Solicitante">
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Solicitante" value={values.solicitante} onChange={(event) => onChange('solicitante', event.target.value)} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Tipo Documento" value={values.tipoDocumento} onChange={(event) => onChange('tipoDocumento', event.target.value)}>
          {documentOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label} ({option.value})</MenuItem>)}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Número Documento"
          value={values.numDocumento}
          onChange={(event) => { if (/^\d{0,8}$/.test(event.target.value)) onChange('numDocumento', event.target.value); }}
          slotProps={{ htmlInput: { maxLength: 8, inputMode: 'numeric', pattern: '[0-9]*' } }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Cargo" value={values.cargo} onChange={(event) => onChange('cargo', event.target.value)} /></Grid>
    </Grid>
  </SolicitudSection>
);
