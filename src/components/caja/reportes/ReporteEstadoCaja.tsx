import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Download as DownloadIcon,
  AccountBalance as CajaIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { generatePdfFromHtml } from '../../../utils/htmlToPdfUtils';

const datosEstadoCaja = { cajero: 'María García', fecha: '18/10/2024', horaApertura: '08:00 AM', horaActual: '04:45 PM', montoInicial: 500.00, montoActual: 8250.00, totalRecaudado: 7750.00, estado: 'Abierto' };
const detalleMovimientos = [
  { hora: '09:15 AM', tipo: 'Pago', concepto: 'Impuesto Predial', monto: 1500.00, formaPago: 'Efectivo' },
  { hora: '03:00 PM', tipo: 'Retiro', concepto: 'Depósito Banco', monto: -5000.00, formaPago: 'Efectivo' }
];

const ReporteEstadoCaja: React.FC = () => {
  const [generandoPdf, setGenerandoPdf] = useState(false);

  const handleGenerarPDF = useCallback(async () => {
    setGenerandoPdf(true);
    try {
      await generatePdfFromHtml('reporte-estado-caja', { filename: 'estado_caja', orientation: 'portrait', scale: 2, quality: 0.95 });
    } catch (error) {
      console.error(error);
    } finally {
      setGenerandoPdf(false);
    }
  }, []);

  const totalEfectivo = 4500; // Mock

  return (
    <Stack spacing={3}>
      <Box><Typography variant="h6" display="flex" alignItems="center" gap={1}><AssessmentIcon color="primary" /> Estado de Caja Detallado</Typography></Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" startIcon={generandoPdf ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />} onClick={handleGenerarPDF} disabled={generandoPdf}>
          {generandoPdf ? 'Generando PDF...' : 'Generar PDF'}
        </Button>
      </Box>

      <Paper id="reporte-estado-caja" elevation={3} sx={{ p: 4, backgroundColor: 'white', minHeight: 900 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}><CajaIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} /><Typography variant="h4" fontWeight={700} color="primary.main">SISTEMA TRIBUTARIO</Typography></Box>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined"><CardContent><Typography variant="subtitle2">INFORMACIÓN DE CAJA</Typography><Typography variant="body2">Cajero: {datosEstadoCaja.cajero}</Typography></CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'white' }}><CardContent><Typography variant="subtitle2">RESUMEN FINANCIERO</Typography><Typography variant="h6">S/ {datosEstadoCaja.montoActual.toFixed(2)}</Typography></CardContent></Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}><Card variant="outlined"><CardContent sx={{ textAlign: 'center' }}><Typography variant="caption">Efectivo</Typography><Typography variant="h6">S/ {totalEfectivo.toFixed(2)}</Typography></CardContent></Card></Grid>
        </Grid>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow sx={{ bgcolor: 'primary.main' }}><TableCell sx={{ color: 'white' }}>Hora</TableCell><TableCell sx={{ color: 'white' }}>Concepto</TableCell><TableCell sx={{ color: 'white' }} align="right">Monto</TableCell></TableRow></TableHead>
            <TableBody>
              {detalleMovimientos.map((m, i) => (<TableRow key={i}><TableCell>{m.hora}</TableCell><TableCell>{m.concepto}</TableCell><TableCell align="right">S/ {m.monto.toFixed(2)}</TableCell></TableRow>))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
};

export default ReporteEstadoCaja;
