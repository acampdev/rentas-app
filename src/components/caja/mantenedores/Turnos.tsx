// src/components/caja/mantenedores/Turnos.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useTurnos } from '../../../hooks/useTurnos';
import { TurnoData } from '../../../services/turnoService';

const Turnos: React.FC = () => {
  const theme = useTheme();
  const { 
    turnos, 
    loading, 
    crearTurno, 
    actualizarTurno, 
    eliminarTurno, 
    cargarTurnos 
  } = useTurnos();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTurno, setEditingTurno] = useState<TurnoData | null>(null);
  const [formData, setFormData] = useState({
    nombreTurno: '',
    horario: ''
  });

  const handleOpenDialog = (turno?: TurnoData) => {
    if (turno) {
      setEditingTurno(turno);
      setFormData({
        nombreTurno: turno.nombreTurno,
        horario: turno.horario
      });
    } else {
      setEditingTurno(null);
      setFormData({
        nombreTurno: '',
        horario: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTurno(null);
  };

  const handleSave = async () => {
    if (!formData.nombreTurno || !formData.horario) return;

    if (editingTurno) {
      await actualizarTurno({
        codTurno: editingTurno.codTurno,
        ...formData
      });
    } else {
      await crearTurno(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este turno?')) {
      await eliminarTurno(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
            <ScheduleIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>Gestión de Turnos</Typography>
            <Typography variant="caption" color="text.secondary">Configure los horarios de atención de las cajas</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => cargarTurnos()}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Turno
          </Button>
        </Stack>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>NOMBRE DEL TURNO</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>HORARIO</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && turnos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : turnos.length > 0 ? (
              turnos.map((turno) => (
                <TableRow key={turno.codTurno} hover>
                  <TableCell>{turno.codTurno}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{turno.nombreTurno}</TableCell>
                  <TableCell>{turno.horario}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(turno)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => handleDelete(turno.codTurno)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No hay turnos registrados</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Nueva/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingTurno ? 'Editar Turno' : 'Nuevo Turno'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del Turno"
              fullWidth
              size="small"
              value={formData.nombreTurno}
              onChange={(e) => setFormData({ ...formData, nombreTurno: e.target.value })}
              placeholder="Ej: Turno Mañana"
              required
            />
            <TextField
              label="Horario"
              fullWidth
              size="small"
              value={formData.horario}
              onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
              placeholder="Ej: 08:00 AM - 13:00 PM"
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!formData.nombreTurno || !formData.horario}
          >
            {editingTurno ? 'Actualizar' : 'Crear Turno'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Turnos;
