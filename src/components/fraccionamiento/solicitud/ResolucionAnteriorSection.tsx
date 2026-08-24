import { Grid, TextField } from '@mui/material';
import type { SolicitudFraccionamientoValues } from './solicitudFraccionamiento.types';
import { SolicitudSection } from './SolicitudSection';

export const ResolucionAnteriorSection = ({ values }: { values: SolicitudFraccionamientoValues }) => (
  <SolicitudSection title="Resolución Anterior (Bloqueado)" muted>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth disabled label="Año Resolución Anterior" value={values.anioResoAnterior || 'null'} helperText="Campo inactivo para este trámite" /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth disabled label="Código Resolución Anterior" value={values.codResoAnterior || 'null'} helperText="Campo inactivo para este trámite" /></Grid>
    </Grid>
  </SolicitudSection>
);
