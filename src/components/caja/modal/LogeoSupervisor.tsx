// components/caja/modal/LogeoSupervisor.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import { usuarioService } from '../../../services/usuarioService';
import { NotificationService } from '../../utils/Notification';

interface LogeoSupervisorProps {
  open: boolean;
  onAuthenticated: (codigoSupervisor: string) => void;
  onCancel: () => void;
}

const LogeoSupervisor: React.FC<LogeoSupervisorProps> = ({
  open,
  onAuthenticated,
  onCancel
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      NotificationService.warning('Ingrese el usuario y la contraseña del supervisor');
      return;
    }

    try {
      setLoading(true);
      const codigoSupervisor = await usuarioService.verificarSupervisorCajero(
        username.trim(),
        password
      );

      setPassword('');
      NotificationService.success('Supervisor autorizado correctamente');
      onAuthenticated(codigoSupervisor);
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'No se pudo verificar al supervisor';
      NotificationService.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setUsername('');
    setPassword('');
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleCancel();
        }
      }}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
      aria-labelledby="logeo-supervisor-title"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle
          id="logeo-supervisor-title"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}
        >
          <SecurityIcon color="primary" />
          <Typography component="span" variant="h6" fontWeight={700}>
            Autorización de supervisor
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Ingrese las credenciales del supervisor para acceder a Asignación de Caja.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={loading}
              autoComplete="username"
              autoFocus
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCancel} disabled={loading} variant="outlined">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !username.trim() || !password}
            variant="contained"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SecurityIcon />}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default LogeoSupervisor;
