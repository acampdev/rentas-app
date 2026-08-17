import type { FC } from 'react';
import { Close as CloseIcon, SearchOff as SearchOffIcon } from '@mui/icons-material';
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
import type { ContribuyenteOption } from '../../../models/Caja';

export interface ContribuyenteData {
  codigoPredio: string;
  dniRuc: string;
  contribuyente: string;
  direccionPredio: string;
}

export interface FiltrosBusqueda {
  codigoContribuyente: string;
  nombreContribuyente: string;
}

interface BuscarContribuyentePredioProps {
  open: boolean;
  onClose: () => void;
  onSelect: (contribuyente: ContribuyenteOption) => void;
  loading?: boolean;
}

const BuscarContribuyentePredio: FC<BuscarContribuyentePredioProps> = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <SearchOffIcon color="warning" />
          <Typography variant="h6" component="span" fontWeight={700}>
            Buscar Contribuyente / Predio
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
        Este selector todavía no está conectado a una API municipal. No se muestran contribuyentes ni predios de demostración.
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined">Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default BuscarContribuyentePredio;
