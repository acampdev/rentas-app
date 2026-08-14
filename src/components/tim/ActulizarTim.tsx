// src/components/tim/ActualizarTim.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useTim, useTimComboOptions } from '../../hooks/useTim';
import { TimData } from '../../services/timService';

interface ActualizarTimProps {
  open: boolean;
  onClose: () => void;
  timData: TimData | null;
  onSuccess: () => void;
}

export const ActualizarTim: React.FC<ActualizarTimProps> = ({
  open,
  onClose,
  timData,
  onSuccess
}) => {
  const { actualizarTim, isUpdating } = useTim();
  const { options: tributoOptions, loading: loadingTributos } = useTimComboOptions();

  // Form states
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [periodo, setPeriodo] = useState<number>(1);
  const [tasa, setTasa] = useState<number>(0);
  const [codTributo, setCodTributo] = useState<number | string>('');
  const [codResolucionInteres, setCodResolucionInteres] = useState<number>(2);

  // Load selected TIM data into form
  useEffect(() => {
    if (timData) {
      setAnio(timData.anio);
      setPeriodo(timData.periodo);
      setTasa(timData.tasa);
      setCodTributo(timData.codTributo);
      setCodResolucionInteres(timData.codResolucionInteres);
    }
  }, [timData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timData) return;

    try {
      await actualizarTim({
        codTIM: timData.codTIM,
        anio,
        periodo,
        tasa,
        codTributo: Number(codTributo),
        codResolucionInteres
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600, borderBottom: '1px solid #e2e8f0', pb: 2 }}>
          Actualizar TIM (ID: {timData?.codTIM})
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Año */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Año"
                type="number"
                value={anio}
                onChange={(e) => setAnio(parseInt(e.target.value) || new Date().getFullYear())}
                required
                inputProps={{ min: 2000, max: 2100 }}
              />
            </Grid>

            {/* Tasa */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Tasa"
                type="number"
                value={tasa}
                onChange={(e) => setTasa(parseFloat(e.target.value) || 0)}
                required
                inputProps={{ step: 0.0001, min: 0 }}
              />
            </Grid>

            {/* Periodo / Mes */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Periodo (Mes)"
                type="number"
                value={periodo}
                onChange={(e) => setPeriodo(parseInt(e.target.value) || 1)}
                required
                inputProps={{ min: 1, max: 12 }}
              />
            </Grid>

            {/* Tributo */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Tributo"
                value={codTributo}
                onChange={(e) => setCodTributo(parseInt(e.target.value) || '')}
                required
                disabled={loadingTributos}
                InputProps={{
                  endAdornment: loadingTributos && <CircularProgress size={20} />
                }}
              >
                {tributoOptions.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label} ({t.value})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Resolución de Interés */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Cód. Resolución de Interés"
                type="number"
                value={codResolucionInteres}
                onChange={(e) => setCodResolucionInteres(parseInt(e.target.value) || 2)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e2e8f0', px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isUpdating}
            sx={{
              backgroundColor: '#3b82f6 !important',
              color: 'white !important',
              '&:hover': {
                backgroundColor: '#2563eb !important'
              }
            }}
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ActualizarTim;