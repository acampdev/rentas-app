// src/components/usuarios/ConsultaUsers.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as ActivarIcon,
  Cancel as BajaIcon,
  VpnKey as PasswordIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../../hooks/useUsuarios';
import { USER_ESTADOS } from '../../config/constants';

interface SearchFilters {
  parametroBusqueda: string;
}

interface EditDialogData {
  codUsuario: number;
  username: string;
  nombrePersona: string;
  documento: string;
  codEstado: string;
  codRol: number;
}

const ConsultaUsers: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<EditDialogData | null>(null);

  const {
    usuarios,
    loading,
    buscarUsuarios,
    actualizarUsuario,
    isUpdating,
    cargarUsuarios
  } = useUsuarios();

  // Cargar resultados inmediatamente cuando se monta la pestaña de consulta
  useEffect(() => {
    cargarUsuarios({ parametroBusqueda: '' });
  }, []);

  const { control, handleSubmit, reset } = useForm<SearchFilters>({
    defaultValues: {
      parametroBusqueda: '',
    }
  });

  const filteredUsers = useMemo(() => {
    return [...usuarios];
  }, [usuarios]);

  const onSearch = (data: SearchFilters) => {
    buscarUsuarios(data.parametroBusqueda);
    setPage(0);
    reset({ parametroBusqueda: '' });
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    await actualizarUsuario(editData);
    setEditDialogOpen(false);
    setEditData(null);
  };

  const getEstadoColor = (estado: string) => estado === 'Activo' ? 'success' : 'default';

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1, display: 'flex' }}>
          <PeopleIcon color="primary" />
        </Box>
        <Typography variant="h5" fontWeight={700}>Gestión de Usuarios</Typography>
      </Stack>

      {/* Filtros */}
      <Box component="form" onSubmit={handleSubmit(onSearch)} sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Box sx={{ flex: 1, minWidth: 280, width: '100%' }}>
            <Controller
              name="parametroBusqueda"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Buscar por nombre o usuario..."
                  fullWidth
                  size="small"
                  disabled={loading}
                />
              )}
            />
          </Box>
          <Stack direction="row" spacing={1} sx={{ ml: { md: 2 } }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%) !important',
                backgroundColor: '#10B981 !important',
                color: '#ffffff !important',
                '&:hover': {
                  background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%) !important',
                  backgroundColor: '#34D399 !important',
                },
                '&.Mui-disabled': {
                  background: '#e0e0e0 !important',
                  backgroundColor: '#e0e0e0 !important',
                  color: 'rgba(0, 0, 0, 0.38) !important'
                }
              }}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/usuarios/crear-cuenta')}
              sx={{
                borderColor: '#10B981',
                color: '#10B981',
                '&:hover': {
                  borderColor: '#059669',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                }
              }}
            >
              Nuevo
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Tabla */}
      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>DNI</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rol</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7}><Skeleton height={40} /></TableCell></TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No se encontraron usuarios.</Typography></TableCell></TableRow>
            ) : (
              filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.codUsuario} hover>
                  <TableCell>{user.codUsuario}</TableCell>
                  <TableCell><strong>{user.username}</strong></TableCell>
                  <TableCell>{user.nombrePersona}</TableCell>
                  <TableCell>{user.documento}</TableCell>
                  <TableCell><Chip label={user.estado} color={getEstadoColor(user.estado) as any} size="small" variant="outlined" /></TableCell>
                  <TableCell>{user.rol}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => {
                      setEditData({
                        codUsuario: user.codUsuario,
                        username: user.username,
                        nombrePersona: user.nombrePersona,
                        documento: user.documento,
                        codEstado: user.estado === 'Activo' ? USER_ESTADOS.ACTIVO : USER_ESTADOS.INACTIVO,
                        codRol: user.codRol || 1
                      });
                      setEditDialogOpen(true);
                    }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: theme.palette.warning.main }} onClick={() => navigate('/usuarios/recuperar-password', { state: { codUsuario: user.codUsuario } })}><PasswordIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color={user.estado === 'Activo' ? 'error' : 'success'} onClick={() => navigate('/usuarios/otras-opciones', { state: { codUsuario: user.codUsuario } })}>
                      {user.estado === 'Activo' ? <BajaIcon fontSize="small" /> : <ActivarIcon fontSize="small" />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Editar Usuario</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Username" size="small" value={editData?.username || ''} onChange={(e) => setEditData(p => p ? { ...p, username: e.target.value } : null)} fullWidth />
            <TextField label="Nombre Persona" size="small" value={editData?.nombrePersona || ''} onChange={(e) => setEditData(p => p ? { ...p, nombrePersona: e.target.value } : null)} fullWidth />
            <TextField label="DNI" size="small" value={editData?.documento || ''} onChange={(e) => setEditData(p => p ? { ...p, documento: e.target.value } : null)} fullWidth />
            <TextField label="Rol (Código)" size="small" type="number" value={editData?.codRol || ''} onChange={(e) => setEditData(p => p ? { ...p, codRol: parseInt(e.target.value) || 1 } : null)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} disabled={isUpdating}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={isUpdating}>{isUpdating ? 'Guardando...' : 'Guardar'}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ConsultaUsers;
