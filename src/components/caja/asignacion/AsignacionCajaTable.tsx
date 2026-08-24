import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import type { AsignacionCajaController } from './useAsignacionCajaController';

export const AsignacionCajaTable = ({ controller }: { controller: AsignacionCajaController }) => {
  const theme = useTheme();
  const headerStyle = {
    bgcolor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
    py: 1.5,
    px: 1,
    whiteSpace: 'nowrap' as const,
  };

  return (
    <>
      {controller.error && <Alert severity="error" variant="outlined" onClose={controller.clearError} sx={{ mb: 2 }}>{controller.error}</Alert>}
      <Alert severity="info" sx={{ mb: 2, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>
        Se encontraron {controller.assignments.length} asignaciones de caja registradas.
      </Alert>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          maxHeight: 450,
          overflow: 'auto',
          borderRadius: 2,
          '&::-webkit-scrollbar': { width: 8, height: 8 },
          '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.primary.main, 0.3), borderRadius: 2 },
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Cajero</TableCell>
              <TableCell sx={headerStyle}>Caja</TableCell>
              <TableCell sx={headerStyle}>Turno</TableCell>
              <TableCell sx={headerStyle}>Fecha</TableCell>
              <TableCell sx={headerStyle}>Estado</TableCell>
              <TableCell align="center" sx={headerStyle}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {controller.loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
            ) : controller.assignments.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No hay asignaciones registradas para los filtros especificados</Typography></TableCell></TableRow>
            ) : controller.assignments.map((assignment) => (
              <TableRow key={assignment.codAsignacionCaja} hover sx={{ '&:nth-of-type(even)': { bgcolor: alpha(theme.palette.grey[50], 0.3) } }}>
                <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}><PersonIcon color="action" fontSize="small" />{assignment.nombreUsuario || '---'}</Box></TableCell>
                <TableCell sx={dataCellSx}>{assignment.numCaja || '---'}</TableCell>
                <TableCell sx={dataCellSx}>{assignment.turno || '---'}</TableCell>
                <TableCell sx={{ ...dataCellSx, fontFamily: 'monospace' }}>{assignment.fechaStr || '---'}</TableCell>
                <TableCell><Chip label={assignment.estado} color={assignment.estado === 'ACTIVO' ? 'success' : 'default'} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" title="Editar" onClick={() => controller.editAssignment(assignment)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton color="error" size="small" title="Eliminar" disabled={controller.loading} onClick={() => controller.deleteAssignment(assignment.codAsignacionCaja)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const dataCellSx = { fontSize: '0.8rem', fontWeight: 500 };
