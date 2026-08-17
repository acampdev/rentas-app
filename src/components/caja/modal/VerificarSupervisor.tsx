// src/components/caja/modal/VerificarSupervisor.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useUsuarios } from '../../../hooks/useUsuarios';
import { NotificationService } from '../../utils/Notification';
import { buildApiUrl } from '../../../config/api.unified.config';
import apiClient from '../../../services/apiClient';

interface VerificarSupervisorProps {
  open: boolean;
  onClose: () => void;
  onVerified: (supervisorUsername: string, token: string | null) => void;
}

const VerificarSupervisor: React.FC<VerificarSupervisorProps> = ({
  open,
  onClose,
  onVerified
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { verificarSupervisor, verificandoSupervisor } = useUsuarios();

  const handleIngresar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      NotificationService.warning('Por favor ingrese el usuario y la contraseña');
      return;
    }

    try {
      const esValido = await verificarSupervisor(username.trim(), password.trim());
      console.log('[VerificarSupervisor] verificarSupervisorCajero esValido:', esValido);
      if (esValido) {
        // Realizar login en segundo plano para obtener el token del supervisor
        let supervisorToken: string | null = null;
        try {
          const loginUrl = buildApiUrl('/auth/login');
          console.log('[VerificarSupervisor] Intentando login en:', loginUrl);
          const loginRes = await apiClient.fetch(loginUrl, {
            method: 'POST',
            auth: false,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.trim(), password: password.trim() })
          });
          console.log('[VerificarSupervisor] Respuesta login status:', loginRes.status);
          if (loginRes.ok) {
            const loginData = await loginRes.json();
            supervisorToken = loginData.token || loginData.access_token || loginData.accessToken || null;
            console.log('[VerificarSupervisor] Token obtenido con éxito:', supervisorToken ? `${supervisorToken.substring(0, 15)}...` : 'null');
          } else {
            const errText = await loginRes.text();
            console.error('[VerificarSupervisor] Error en respuesta de login:', errText);
          }
        } catch (loginErr) {
          console.error('[VerificarSupervisor] Excepción al obtener token de supervisor:', loginErr);
        }

        NotificationService.success('¡Supervisor verificado exitosamente!');
        onVerified(username.trim(), supervisorToken);
        // Limpiar campos y cerrar modal
        setUsername('');
        setPassword('');
        onClose();
      } else {
        NotificationService.error('Credenciales de supervisor incorrectas o no es un supervisor autorizado');
      }
    } catch (error: any) {
      NotificationService.error(error.message || 'Error durante la verificación del supervisor');
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SecurityIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" component="div" sx={{ flexGrow: 1 }}>
          Verificar Supervisor
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleIngresar}>
        <DialogContent sx={{ p: 2, pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Ingrese las credenciales del supervisor para autorizar y desbloquear la asignación de cajas.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Usuario"
              variant="outlined"
              size="small"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={verificandoSupervisor}
              autoFocus
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              size="small"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={verificandoSupervisor}
              required
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1.5, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            disabled={verificandoSupervisor}
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: '#1976d2 !important',
              color: '#1976d2 !important',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04) !important',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={verificandoSupervisor}
            sx={{
              borderRadius: 2,
              px: 3,
              backgroundColor: '#1976d2 !important',
              color: '#ffffff !important',
              '&:hover': {
                backgroundColor: '#115293 !important',
              },
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0 !important',
                color: '#a0a0a0 !important',
              }
            }}
          >
            {verificandoSupervisor ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                <span>Ingresando...</span>
              </Box>
            ) : (
              'Ingresar'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VerificarSupervisor;
