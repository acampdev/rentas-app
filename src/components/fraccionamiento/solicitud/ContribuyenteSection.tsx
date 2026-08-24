import { Button, Grid, TextField } from '@mui/material';
import { Person as PersonIcon, Search as SearchIcon } from '@mui/icons-material';
import type { ContribuyenteSeleccionado } from './solicitudFraccionamiento.types';
import { SolicitudSection } from './SolicitudSection';

interface ContribuyenteSectionProps {
  contribuyente: ContribuyenteSeleccionado;
  onOpenSelector: () => void;
}

export const ContribuyenteSection = ({ contribuyente, onOpenSelector }: ContribuyenteSectionProps) => (
  <SolicitudSection title="Contribuyente" icon={<PersonIcon />}>
    <Grid container spacing={3} alignItems="center">
      <Grid size={{ xs: 12, sm: 8 }}>
        <TextField
          fullWidth
          label="Nombre del Contribuyente"
          value={contribuyente.nombre}
          slotProps={{ input: { readOnly: true } }}
          placeholder="Seleccione un contribuyente..."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onOpenSelector}
          sx={{ height: 56, bgcolor: '#3b82f6 !important', color: 'white !important', fontWeight: 'bold', '&:hover': { bgcolor: '#2563eb !important' } }}
        >
          Buscar
        </Button>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Código Contribuyente"
          value={contribuyente.codigo}
          slotProps={{ input: { readOnly: true } }}
          placeholder="Código obtenido automáticamente"
          helperText="Este campo se autocompleta al seleccionar el contribuyente."
        />
      </Grid>
    </Grid>
  </SolicitudSection>
);
