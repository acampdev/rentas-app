import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface SolicitudConfirmationDialogProps {
  open: boolean;
  onNew: () => void;
  onClose: () => void;
}

export const SolicitudConfirmationDialog = ({ open, onNew, onClose }: SolicitudConfirmationDialogProps) => (
  <Dialog open={open} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600 }}>Solicitud Registrada</DialogTitle>
    <DialogContent sx={{ mt: 3 }}>
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>¡Solicitud Creada Correctamente!</Typography>
        <Typography variant="body2" color="text.secondary">La solicitud de fraccionamiento se ha enviado con éxito al servidor.</Typography>
      </Box>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onNew} variant="contained" sx={{ bgcolor: '#10b981 !important', color: 'white !important', fontWeight: 'bold' }}>Nueva Solicitud</Button>
      <Button onClick={onClose} variant="outlined" sx={{ color: 'text.primary !important', fontWeight: 'bold' }}>Cerrar</Button>
    </DialogActions>
  </Dialog>
);
