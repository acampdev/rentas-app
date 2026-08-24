import { Box, Button, CircularProgress } from '@mui/material';
import { Payment as PaymentIcon, RestartAlt as ResetIcon } from '@mui/icons-material';

interface SolicitudActionsProps {
  loading: boolean;
  valid: boolean;
  onClear: () => void;
  onSubmit: () => void;
}

export const SolicitudActions = ({ loading, valid, onClear, onSubmit }: SolicitudActionsProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
    <Button
      variant="outlined"
      startIcon={<ResetIcon />}
      onClick={onClear}
      sx={{ borderColor: '#ef4444 !important', color: '#ef4444 !important', fontWeight: 'bold', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08) !important' } }}
    >
      Limpiar Formulario
    </Button>
    <Button
      variant="contained"
      disabled={!valid || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
      onClick={onSubmit}
      sx={{ bgcolor: '#10b981 !important', color: 'white !important', fontWeight: 'bold', '&:hover': { bgcolor: '#059669 !important' } }}
    >
      {loading ? 'Procesando...' : 'Enviar Solicitud'}
    </Button>
  </Box>
);
