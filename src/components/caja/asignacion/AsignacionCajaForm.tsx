import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { AsignacionCajaController } from './useAsignacionCajaController';

export const AsignacionCajaForm = ({ controller }: { controller: AsignacionCajaController }) => {
  const theme = useTheme();
  return (
    <>
      {controller.error && <Alert severity="error" variant="outlined" onClose={controller.clearError} sx={{ mb: 2 }}>{controller.error}</Alert>}
      <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.grey[100], 0.3), borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
          {controller.editing ? 'Modificar Datos de Asignación' : 'Detalles de la Nueva Asignación'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, alignItems: 'center', width: '100%', overflowX: 'auto', pb: 1 }}>
          <DatePicker
            label="Fecha Asignación"
            value={controller.form.fecha}
            onChange={(value) => controller.setFormField('fecha', value)}
            disabled={Boolean(controller.editing)}
            sx={{ flex: '0 0 160px' }}
            slotProps={{ textField: { size: 'small', fullWidth: true, sx: fieldSx(Boolean(controller.editing)) } }}
          />
          <Autocomplete
            size="small"
            options={controller.cashiers}
            loading={controller.loadingCashiers}
            value={controller.selectedCashier}
            onChange={(_event, value) => controller.setFormField('codCajero', value ? value.codUsuario : '')}
            getOptionLabel={(option) => `${option.nombrePersona} (${option.username?.trim()})`}
            isOptionEqualToValue={(option, value) => Number(option.codUsuario) === Number(value.codUsuario)}
            sx={{ flex: '0 0 220px', width: 220, '& .MuiOutlinedInput-root': fieldInputSx }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cajero"
                placeholder="Seleccionar cajero..."
                slotProps={{ input: { ...params.InputProps, endAdornment: <>{controller.loadingCashiers && <CircularProgress size={20} />}{params.InputProps.endAdornment}</> } }}
              />
            )}
          />
          <Autocomplete
            size="small"
            options={controller.boxes}
            loading={controller.loadingBoxes}
            value={controller.selectedBox}
            onChange={(_event, value) => controller.setFormField('codCaja', value ? value.codCaja : '')}
            getOptionLabel={controller.getBoxLabel}
            isOptionEqualToValue={(option, value) => Number(option.codCaja) === Number(value.codCaja)}
            sx={{ flex: '0 0 180px', width: 180, '& .MuiOutlinedInput-root': fieldInputSx }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Caja"
                placeholder="Seleccionar caja..."
                slotProps={{ input: { ...params.InputProps, endAdornment: <>{controller.loadingBoxes && <CircularProgress size={20} />}{params.InputProps.endAdornment}</> } }}
              />
            )}
          />
          <FormControl size="small" sx={{ flex: '0 0 180px' }}>
            <InputLabel>Turno</InputLabel>
            <Select
              value={controller.form.codTurno}
              onChange={(event) => controller.setFormField('codTurno', Number(event.target.value))}
              label="Turno"
              sx={fieldInputSx}
            >
              {controller.loadingShifts ? (
                <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Cargando turnos...</MenuItem>
              ) : controller.shifts.length === 0 ? (
                <MenuItem disabled>No hay turnos registrados</MenuItem>
              ) : controller.shifts.map((shift) => (
                <MenuItem key={shift.codTurno} value={shift.codTurno}>{shift.nombreTurno} ({shift.horario})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button variant="outlined" onClick={controller.resetForm} disabled={controller.loading} startIcon={<AddIcon />} sx={secondaryButtonSx}>Nuevo</Button>
          <Button variant="contained" onClick={controller.saveAssignment} disabled={controller.loading} startIcon={controller.loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} sx={primaryButtonSx}>
            {controller.editing ? 'Actualizar Asignación' : 'Guardar Asignación'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

const fieldInputSx = { borderRadius: 2, height: 40, bgcolor: 'white' };
const fieldSx = (disabled: boolean) => ({ '& .MuiOutlinedInput-root': { ...fieldInputSx, bgcolor: disabled ? 'grey.100' : 'white' } });
const secondaryButtonSx = { height: 40, borderRadius: 2, textTransform: 'none', fontWeight: 600, bgcolor: 'white !important' };
const primaryButtonSx = { height: 40, borderRadius: 2, textTransform: 'none', fontWeight: 600, bgcolor: '#10b981 !important', color: 'white !important', '&:hover': { bgcolor: '#059669 !important' } };
