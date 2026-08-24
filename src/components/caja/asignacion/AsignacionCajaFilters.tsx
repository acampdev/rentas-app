import { Box, Button, CircularProgress, Paper, TextField, alpha, useTheme } from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { AsignacionCajaController } from './useAsignacionCajaController';

export const AsignacionCajaFilters = ({ controller }: { controller: AsignacionCajaController }) => {
  const theme = useTheme();
  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2, mb: 3, border: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Término de búsqueda"
          value={controller.search.termino}
          onChange={(event) => controller.setSearchField('termino', event.target.value)}
          placeholder="Nombre, caja, turno..."
          disabled={controller.loading}
          sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' }, minWidth: { xs: '100%', sm: 200 }, '& .MuiOutlinedInput-root': inputSx }}
        />
        <DatePicker
          label="Filtrar por Fecha"
          value={controller.search.fecha}
          onChange={(value) => controller.setSearchField('fecha', value)}
          disabled={controller.loading}
          sx={{ flex: { xs: '1 1 100%', sm: '0 0 160px' } }}
          slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': inputSx } } }}
        />
        <TextField
          size="small"
          label="Cód. Usuario"
          value={controller.search.codUsuario}
          onChange={(event) => controller.setSearchField('codUsuario', event.target.value.replace(/\D/g, ''))}
          placeholder="Solo números"
          disabled={controller.loading}
          slotProps={{ htmlInput: { pattern: '[0-9]*', inputMode: 'numeric' } }}
          sx={{ flex: { xs: '1 1 100%', sm: '0 0 130px' }, minWidth: { xs: '100%', sm: 130 }, '& .MuiOutlinedInput-root': inputSx }}
        />
        <Box sx={{ display: 'flex', gap: 1.5, flex: { xs: '1 1 100%', sm: '0 0 220px' }, minWidth: { xs: '100%', sm: 220 } }}>
          <Button fullWidth variant="contained" onClick={controller.searchAssignments} disabled={controller.loading} startIcon={controller.loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />} sx={searchButtonSx}>Buscar</Button>
          <Button fullWidth variant="outlined" onClick={controller.resetSearch} disabled={controller.loading} startIcon={<ClearIcon />} sx={{ height: 40, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Limpiar</Button>
        </Box>
      </Box>
    </Paper>
  );
};

const inputSx = { borderRadius: 2, height: 40, bgcolor: 'white' };
const searchButtonSx = { height: 40, bgcolor: '#3b82f6 !important', color: 'white !important', fontWeight: 600, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#2563eb !important' } };
