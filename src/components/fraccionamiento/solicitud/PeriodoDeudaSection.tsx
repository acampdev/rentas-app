import { Grid, TextField } from '@mui/material';
import type { SolicitudFieldChange, SolicitudFraccionamientoValues } from './solicitudFraccionamiento.types';
import { SolicitudSection } from './SolicitudSection';

export const PeriodoDeudaSection = ({ values, onChange }: { values: SolicitudFraccionamientoValues; onChange: SolicitudFieldChange }) => (
  <SolicitudSection title="Periodo de la Deuda">
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Año Deuda Inicio" type="number" value={values.anioDeudaInicio} onChange={(event) => onChange('anioDeudaInicio', event.target.value)} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Periodo Inicio (Mes)" type="number" value={values.periodoInicio} onChange={(event) => onChange('periodoInicio', event.target.value)} slotProps={{ htmlInput: { min: 1, max: 12 } }} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Año Deuda Fin" type="number" value={values.anioDeudaFin} onChange={(event) => onChange('anioDeudaFin', event.target.value)} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Periodo Fin (Mes)" type="number" value={values.periodoFin} onChange={(event) => onChange('periodoFin', event.target.value)} slotProps={{ htmlInput: { min: 1, max: 12 } }} /></Grid>
    </Grid>
  </SolicitudSection>
);
