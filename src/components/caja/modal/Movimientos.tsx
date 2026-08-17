import type { FC } from 'react';
import { Close as CloseIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';

interface MovimientosProps {
  open: boolean;
  onClose: () => void;
}

const Movimientos: FC<MovimientosProps> = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <ReceiptIcon color="primary" />
          <Typography variant="h6" component="span" fontWeight={700}>
            Movimientos de Caja
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Alert severity="warning" variant="outlined">
        <AlertTitle>Módulo no disponible</AlertTitle>
        La consulta de movimientos de caja todavía no está conectada a una API municipal. No se muestran movimientos ni totales simulados.
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined">Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default Movimientos;
