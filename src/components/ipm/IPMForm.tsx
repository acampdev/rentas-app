import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { RestartAlt as RestartAltIcon, Save as SaveIcon } from '@mui/icons-material';
import { useTiposMesesOptions } from '../../hooks/useConstantesOptions';
import type { IPMData, IPMWriteDTO } from '../../services/ipmService';

interface IPMFormProps {
  registro?: IPMData | null;
  loading?: boolean;
  onGuardar: (datos: IPMWriteDTO) => Promise<unknown>;
  onCancelar?: () => void;
}

interface FormState {
  anio: string;
  mes: string;
  indice: string;
  variacionMensual: string;
  variacionAcumulada: string;
}

const currentYear = new Date().getFullYear();
const emptyForm = (): FormState => ({
  anio: String(currentYear), mes: '', indice: '', variacionMensual: '', variacionAcumulada: ''
});

const withoutNumberSpinners = {
  '& input[type=number]': {
    MozAppearance: 'textfield'
  },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  }
};

const IPMForm = ({ registro, loading = false, onGuardar, onCancelar }: IPMFormProps) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const { options: meses, loading: loadingMeses, error: errorMeses } = useTiposMesesOptions();
  const isEditing = Boolean(registro);

  useEffect(() => {
    setForm(registro ? {
      anio: String(registro.anio),
      mes: registro.codMes,
      indice: String(registro.indice),
      variacionMensual: String(registro.variacionMensual),
      variacionAcumulada: String(registro.variacionAcumulada)
    } : emptyForm());
    setError(null);
  }, [registro]);

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const anio = Number(form.anio);
    const indice = Number(form.indice);
    const variacionMensual = Number(form.variacionMensual);
    const variacionAcumulada = Number(form.variacionAcumulada);

    if (!Number.isInteger(anio) || anio < 1900 || anio > currentYear + 10) return setError('Ingrese un año válido');
    if (!form.mes) return setError('Seleccione un mes');
    if (!Number.isFinite(indice) || indice <= 0) return setError('El índice debe ser mayor a cero');
    if (!Number.isFinite(variacionMensual) || !Number.isFinite(variacionAcumulada)) {
      return setError('Las variaciones deben contener valores numéricos válidos');
    }

    await onGuardar({ anio, mes: form.mes, indice, variacionMensual, variacionAcumulada, usuario: null });
    if (!isEditing) setForm(emptyForm());
  };

  const handleLimpiar = () => {
    setForm(emptyForm());
    setError(null);
    onCancelar?.();
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h6" fontWeight={700} mb={2}>{isEditing ? 'Editar IPM' : 'Nuevo IPM'}</Typography>
      {(error || errorMeses) && <Alert severity="error" sx={{ mb: 2 }}>{error || errorMeses}</Alert>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%' }}>
        <TextField label="Año" type="number" size="small" value={form.anio} onChange={handleChange('anio')} disabled={isEditing || loading} sx={{ width: { xs: '100%', sm: 100 }, flexShrink: 0 }} required />
        <TextField select label="Mes" size="small" value={form.mes} onChange={handleChange('mes')} disabled={isEditing || loading || loadingMeses} sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }} required>
          {meses.map((mes) => <MenuItem key={String(mes.value)} value={String(mes.value)}>{mes.label}</MenuItem>)}
        </TextField>
        <TextField label="Índice" type="number" size="small" value={form.indice} onChange={handleChange('indice')} inputProps={{ step: '0.000001' }} sx={{ ...withoutNumberSpinners, flex: { xs: '1 1 100%', sm: '1 1 180px' }, minWidth: { xs: '100%', sm: 180 } }} required />
        <TextField label="Variación mensual (%)" type="number" size="small" value={form.variacionMensual} onChange={handleChange('variacionMensual')} inputProps={{ step: '0.01' }} sx={{ ...withoutNumberSpinners, flex: { xs: '1 1 100%', sm: '1 1 180px' }, minWidth: { xs: '100%', sm: 180 } }} required />
        <TextField label="Variación acumulada (%)" type="number" size="small" value={form.variacionAcumulada} onChange={handleChange('variacionAcumulada')} inputProps={{ step: '0.01' }} sx={{ ...withoutNumberSpinners, flex: { xs: '1 1 100%', sm: '1 1 180px' }, minWidth: { xs: '100%', sm: 180 } }} required />
      </Box>
      <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="flex-end" spacing={1.5} mt={3}>
        <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleLimpiar} disabled={loading} sx={{ width: { xs: '100%', sm: 'auto' } }}>Limpiar</Button>
        <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} disabled={loading || loadingMeses} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </Stack>
    </Paper>
  );
};

export default IPMForm;
