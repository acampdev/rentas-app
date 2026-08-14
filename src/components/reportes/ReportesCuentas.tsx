// src/components/reportes/ReportesCuentas.tsx
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
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material';
import { generatePdfFromHtml } from '../../utils/htmlToPdfUtils';

// Datos de ejemplo
const datosCuentaCorriente = [
  { fecha: '15/01/2024', concepto: 'Impuesto Predial 2024', tipo: 'Cargo', monto: 1500.00, saldo: 1500.00 },
  { fecha: '20/01/2024', concepto: 'Pago en efectivo', tipo: 'Abono', monto: -500.00, saldo: 1000.00 },
  { fecha: '05/02/2024', concepto: 'Arbitrios Q1 2024', tipo: 'Cargo', monto: 350.00, saldo: 1350.00 },
  { fecha: '15/02/2024', concepto: 'Pago con tarjeta', tipo: 'Abono', monto: -800.00, saldo: 550.00 },
  { fecha: '01/03/2024', concepto: 'Multa - Declaración tardía', tipo: 'Cargo', monto: 200.00, saldo: 750.00 },
  { fecha: '10/03/2024', concepto: 'Pago transferencia', tipo: 'Abono', monto: -750.00, saldo: 0.00 }
];

const ReportesCuentas: React.FC = () => {
  const theme = useTheme();
  const [generandoPdf, setGenerandoPdf] = useState(false);

  const handleGenerarPDF = useCallback(async () => {
    setGenerandoPdf(true);
    try {
      await generatePdfFromHtml('reporte-cuenta-corriente', {
        filename: 'reporte_cuenta_corriente',
        orientation: 'portrait',
        scale: 2,
        quality: 0.95
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor intente nuevamente.');
    } finally {
      setGenerandoPdf(false);
    }
  }, []);

  const totalCargos = datosCuentaCorriente
    .filter(d => d.tipo === 'Cargo')
    .reduce((sum, d) => sum + d.monto, 0);

  const totalAbonos = Math.abs(datosCuentaCorriente
    .filter(d => d.tipo === 'Abono')
    .reduce((sum, d) => sum + d.monto, 0));

  const saldoFinal = datosCuentaCorriente[datosCuentaCorriente.length - 1]?.saldo || 0;

  return (
    <Stack spacing={4}>
      {/* Introduction Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', width: 56, height: 56, borderRadius: 2 }}>
          <ReceiptIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Estado de Cuenta Corriente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Obtenga un desglose cronológico de cargos y abonos del contribuyente.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <Alert 
            severity="success" 
            icon={<VerifiedIcon />}
            sx={{ borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.success.main, 0.2) }}
          >
            Este reporte se genera mediante captura de alta fidelidad (HTML to PDF), 
            asegurando que el diseño impreso sea idéntico al visualizado en pantalla.
          </Alert>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={generandoPdf ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            onClick={handleGenerarPDF}
            disabled={generandoPdf}
            sx={{ 
              height: 52, 
              borderRadius: 3, 
              px: 4,
              fontWeight: 700,
              boxShadow: theme.shadows[4]
            }}
          >
            {generandoPdf ? 'Procesando...' : 'Generar Documento'}
          </Button>
        </Grid>
      </Grid>

      <Divider>
        <Chip label="Vista Previa del Documento" size="small" variant="outlined" sx={{ color: 'text.disabled' }} />
      </Divider>

      {/* Official Report Preview */}
      <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: 'grey.100', py: 4, borderRadius: 4 }}>
        <Paper
          id="reporte-cuenta-corriente"
          elevation={10}
          sx={{
            p: 6,
            backgroundColor: 'white',
            width: '210mm', // A4 Width
            minHeight: '297mm', // A4 Height
            boxSizing: 'border-box'
          }}
        >
          {/* Official Letterhead */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box component="img" src="/escudoMDE.png" alt="Logo" sx={{ height: 60 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={800} lineHeight={1.2}>
                  MUNICIPALIDAD DISTRITAL<br />DE LA ESPERANZA
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Gerencia de Administración Tributaria
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" fontWeight={800} color="primary.main">
                ESTADO DE CUENTA
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                N° 2024-000142
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fecha: {new Date().toLocaleDateString('es-PE')}
              </Typography>
            </Box>
          </Box>

          {/* Contribuyente Info Header */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 4, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 7 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  Datos del Contribuyente
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ mt: 1 }}>Juan Pérez García</Typography>
                <Typography variant="body2" color="text.secondary">DNI: 12345678</Typography>
                <Typography variant="body2" color="text.secondary">Código: 43905</Typography>
              </Grid>
              <Grid size={{ xs: 5 }} sx={{ borderLeft: '1px solid', borderColor: 'divider', pl: 4 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  Resumen Económico
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Deuda:</Typography>
                    <Typography variant="body2" fontWeight={700} color="error.main">S/ {totalCargos.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Pagos:</Typography>
                    <Typography variant="body2" fontWeight={700} color="success.main">S/ {totalAbonos.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" fontWeight={800}>Saldo Pendiente:</Typography>
                    <Typography variant="subtitle2" fontWeight={800} color={saldoFinal > 0 ? 'error.main' : 'success.main'}>
                      S/ {saldoFinal.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Movements Table */}
          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, textTransform: 'uppercase', color: 'primary.dark' }}>
            Detalle Cronológico de Movimientos
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderTop: '2px solid', borderBottom: '2px solid', borderColor: 'primary.main' }}>
                  <TableCell sx={{ fontWeight: 800, py: 1.5 }}>FECHA</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 1.5 }}>CONCEPTO / OPERACIÓN</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 1.5 }} align="center">TIPO</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 1.5 }} align="right">MONTO (S/)</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 1.5 }} align="right">SALDO (S/)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datosCuentaCorriente.map((row, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:last-child td': { borderBottom: 0 },
                      bgcolor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.grey[100], 0.3)
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.fecha}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{row.concepto}</TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" sx={{ 
                        fontWeight: 700, 
                        px: 1, 
                        py: 0.2, 
                        borderRadius: 1,
                        color: row.tipo === 'Cargo' ? 'error.dark' : 'success.dark',
                        bgcolor: row.tipo === 'Cargo' ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1)
                      }}>
                        {row.tipo.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      color: row.tipo === 'Cargo' ? 'error.main' : 'success.main'
                    }}>
                      {row.tipo === 'Abono' ? '-' : ''}{Math.abs(row.monto).toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {row.saldo.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Official Footer with QR Placeholder and Signature */}
          <Box sx={{ mt: 'auto', pt: 8 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 3 }}>
                <Box 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.50'
                  }}
                >
                  <Typography variant="caption" color="text.disabled">CÓDIGO QR</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 5 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Box sx={{ width: 200, borderBottom: '1px solid black', mb: 1 }} />
                <Typography variant="caption" fontWeight={700}>FIRMA AUTORIZADA</Typography>
                <Typography variant="caption" color="text.secondary">GAT - Municipalidad La Esperanza</Typography>
              </Grid>
              <Grid size={{ xs: 4 }} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  Validado por: <strong>admin_user</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1.1}>
                  Este documento es una liquidación informativa.<br />
                  Los pagos deben realizarse únicamente<br />
                  en ventanillas autorizadas.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Stack>
  );
};

export default ReportesCuentas;
