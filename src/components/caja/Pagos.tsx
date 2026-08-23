// components/caja/Pagos.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Visibility as VisibilityIcon,
  DeleteSweep as DeleteSweepIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

import SelectorContribuyente from '../modal/SelectorContribuyente';
import DeudaContribuyente from './modal/DeudaContribuyente';
import { usePagos } from '../../hooks/usePagos';
import HotkeyHelper from '../common/HotkeyHelper';

const formasPago = [
  { value: 'CONTADO', label: 'CONTADO' },
  { value: 'TARJETA', label: 'TARJETA' },
  { value: 'TRANSFERENCIA', label: 'TRANSFERENCIA' }
];

interface PagosProps {
  codUsuarioOperando: number;
  codAperturaCaja: number;
  onPagoExitoso?: () => void;
}

const Pagos: React.FC<PagosProps> = ({ codUsuarioOperando, codAperturaCaja, onPagoExitoso }) => {
  const {
    pagoData,
    setPagoData,
    busquedaContribuyente,
    modalBusquedaOpen,
    setModalBusquedaOpen,
    modalDeudaOpen,
    setModalDeudaOpen,
    contribuyenteSeleccionado,
    handleGrabar,
    handleImprimirRecibo,
    handleLimpiarConceptos,
    handleNuevo,
    handleSeleccionarContribuyente,
    handlePagoGenerado,
    handleEliminarConcepto,
    calcularTotal,
    loading,
    pagoFeedback
  } = usePagos(
    { codUsuario: codUsuarioOperando, codAperturaCaja },
    onPagoExitoso
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white', mb: 2, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon />
          <Typography variant="h6" fontWeight="bold">Ingresos</Typography>
        </Paper>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button 
                  variant="contained" 
                  startIcon={<SearchIcon />} 
                  onClick={() => setModalBusquedaOpen(true)} 
                  size="small" 
                  sx={{ 
                    height: 40,
                    backgroundColor: '#0288d1 !important',
                    color: '#ffffff !important',
                    '&:hover': {
                      backgroundColor: '#01579b !important',
                    }
                  }}
                >
                  Buscar Contribuyente
                </Button>
                <TextField label="Código" value={pagoData.codigo} size="small" disabled sx={{ width: 120 }} />
                <TextField label="RUC/DNI" value={pagoData.rucDni} size="small" disabled sx={{ width: 130 }} />
                <TextField label="Contribuyente" value={busquedaContribuyente} size="small" disabled fullWidth sx={{ flex: 1 }} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField label="Dirección" value={pagoData.direccion} size="small" disabled fullWidth sx={{ flex: 1 }} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon /></InputAdornment> }} />
                <DatePicker label="Fecha Recibo" value={pagoData.fechaRecibo} onChange={(v: any) => setPagoData({ ...pagoData, fechaRecibo: v })} slotProps={{ textField: { size: 'small', sx: { width: 160 } } }} />
                <Button 
                  variant="contained" 
                  startIcon={<VisibilityIcon />} 
                  onClick={() => setModalDeudaOpen(true)} 
                  disabled={!contribuyenteSeleccionado} 
                  sx={{ 
                    height: 40,
                    backgroundColor: '#2e7d32 !important',
                    color: '#ffffff !important',
                    '&:hover': {
                      backgroundColor: '#1b5e20 !important',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#e0e0e0 !important',
                      color: '#a0a0a0 !important',
                    }
                  }}
                >
                  Ver Deuda
                </Button>
                <IconButton color="error" onClick={handleLimpiarConceptos} disabled={pagoData.conceptos.length === 0}><DeleteSweepIcon /></IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, mb: 2 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell align="right" sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="center" width={80} sx={{ bgcolor: 'grey.100', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagoData.conceptos.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 2 }}>No hay conceptos agregados</TableCell></TableRow>
              ) : (
                pagoData.conceptos.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.descripcion}</TableCell>
                    <TableCell align="right">S/. {c.total.toFixed(2)}</TableCell>
                    <TableCell align="center"><IconButton size="small" color="error" onClick={() => handleEliminarConcepto(c.id)}><DeleteIcon /></IconButton></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Autocomplete options={formasPago} value={formasPago.find(f => f.value === pagoData.formaPago)} onChange={(_, v) => setPagoData({ ...pagoData, formaPago: v?.value || 'CONTADO' })} sx={{ width: 250 }} renderInput={(params) => <TextField {...params} label="Pasarela de Pago" size="small" />} />
            <Box sx={{ p: 2, bgcolor: '#fff3cd', border: '2px solid #ffeaa7', borderRadius: 2, display: 'flex', gap: 2 }}>
              <Typography variant="h6">Total a Pagar:</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">S/. {calcularTotal().toFixed(2)}</Typography>
            </Box>
          </CardContent>
        </Card>

        {pagoFeedback && (
          <Alert
            severity={pagoFeedback.severity}
            variant="outlined"
            role="status"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            {pagoFeedback.message}
          </Alert>
        )}
        
        <Box display="flex" gap={2} justifyContent="center">
          <Button 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />} 
            size="large" 
            onClick={handleGrabar} 
            disabled={loading || pagoData.conceptos.length === 0 || !contribuyenteSeleccionado}
            sx={{
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
            {loading ? 'Grabando...' : 'Grabar'}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            size="large" 
            onClick={handleNuevo}
            sx={{
              backgroundColor: '#ffffff !important',
              borderColor: '#1976d2 !important',
              color: '#1976d2 !important',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04) !important',
                borderColor: '#115293 !important',
              }
            }}
          >
            Nuevo
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PrintIcon />} 
            size="large" 
            onClick={handleImprimirRecibo} 
            disabled={pagoData.conceptos.length === 0}
            sx={{
              backgroundColor: '#2e7d32 !important',
              color: '#ffffff !important',
              '&:hover': {
                backgroundColor: '#1b5e20 !important',
              },
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0 !important',
                color: '#a0a0a0 !important',
              }
            }}
          >
            Imprimir
          </Button>
        </Box>

        <SelectorContribuyente isOpen={modalBusquedaOpen} onClose={() => setModalBusquedaOpen(false)} onSelectContribuyente={handleSeleccionarContribuyente} />
        <DeudaContribuyente open={modalDeudaOpen} onClose={() => setModalDeudaOpen(false)} contribuyenteData={contribuyenteSeleccionado} onPagoGenerado={handlePagoGenerado} />
        <HotkeyHelper showButton />
      </Box>
    </LocalizationProvider>
  );
};

export default Pagos;
