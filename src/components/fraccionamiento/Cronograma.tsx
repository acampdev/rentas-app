// src/components/fraccionamiento/Cronograma.tsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Print as PrintIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useFraccionamiento } from '../../hooks/useFraccionamiento';
import { fraccionamientoService } from '../../services/fraccionamientoService';
import type { CuotaFraccionamiento } from '../../types/fraccionamiento.types';

const Cronograma: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const stateFraccionamiento = location.state as any;

  // Filtros de búsqueda
  const [anio, setAnio] = useState<string>(
    stateFraccionamiento?.anio?.toString() || new Date().getFullYear().toString()
  );
  const [codResolucion, setCodResolucion] = useState<string>(
    stateFraccionamiento?.codResolucion?.toString() || 
    stateFraccionamiento?.id?.toString() || 
    id || 
    ''
  );

  const [cronograma, setCronograma] = useState<CuotaFraccionamiento[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar cronograma
  const handleBuscar = useCallback(async () => {
    const parsedAnio = parseInt(anio);
    const parsedRes = parseInt(codResolucion);
    
    if (isNaN(parsedAnio) || isNaN(parsedRes)) {
      setError('Año y Código de Resolución deben ser números válidos.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      console.log(`🔍 [Cronograma] Buscando cronograma para año=${parsedAnio}, resolución=${parsedRes}`);
      const data = await fraccionamientoService.obtenerCronograma(parsedAnio, parsedRes);
      setCronograma(data || []);
      if (!data || data.length === 0) {
        console.warn('⚠️ [Cronograma] La API retornó un cronograma vacío.');
      }
    } catch (err: any) {
      console.error('❌ [Cronograma] Error al obtener cronograma:', err);
      setError(err.message || 'Error al conectar con el servidor.');
      setCronograma([]);
    } finally {
      setLoading(false);
    }
  }, [anio, codResolucion]);

  // Búsqueda automática al cargar la página si existen los filtros
  useEffect(() => {
    if (anio && codResolucion) {
      handleBuscar();
    }
  }, [handleBuscar]);

  // Calcular totales del cronograma
  const totales = useMemo(() => {
    return cronograma.reduce(
      (acc, item: any) => {
        acc.amortizacion += parseFloat(item.amortizacion || '0');
        acc.interes += parseFloat(item.interes || '0');
        acc.montoCuota += parseFloat(item.montoCuota || '0');
        return acc;
      },
      { amortizacion: 0, interes: 0, montoCuota: 0 }
    );
  }, [cronograma]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }} className="notranslate" translate="no">
      {/* Título de la página */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Cronograma de Pagos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Consulte las cuotas, intereses, amortizaciones y estado de pagos de un fraccionamiento específico.
        </Typography>
      </Box>

      {/* Panel de Filtros */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
          Filtros de Búsqueda
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Año"
              type="number"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Código de Resolución"
              type="number"
              value={codResolucion}
              onChange={(e) => setCodResolucion(e.target.value)}
              variant="outlined"
              placeholder="Ej. 1"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
              disabled={!anio || !codResolucion || loading}
              sx={{
                height: 56,
                bgcolor: '#3b82f6 !important',
                color: 'white !important',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#2563eb !important'
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(0, 0, 0, 0.12) !important',
                  color: 'rgba(0, 0, 0, 0.26) !important'
                }
              }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Resultados de Búsqueda */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      ) : hasSearched && cronograma.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No se encontraron cuotas registradas para el año <strong>{anio}</strong> y código de resolución <strong>{codResolucion}</strong>.
        </Alert>
      ) : !hasSearched ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Ingrese el Año y el Código de Resolución del Fraccionamiento para listar el cronograma correspondiente.
        </Alert>
      ) : (
        <Stack spacing={4}>
          {/* Resumen del Cronograma */}
          <Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined" sx={{ borderLeft: '4px solid #3b82f6' }}>
                  <CardContent sx={{ p: '16px !important' }}>
                    <Typography variant="caption" color="text.secondary">Total Amortización</Typography>
                    <Typography variant="h6" fontWeight={700}>S/ {totales.amortizacion.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined" sx={{ borderLeft: '4px solid #f59e0b' }}>
                  <CardContent sx={{ p: '16px !important' }}>
                    <Typography variant="caption" color="text.secondary">Total Interés</Typography>
                    <Typography variant="h6" fontWeight={700}>S/ {totales.interes.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined" sx={{ borderLeft: '4px solid #10b981' }}>
                  <CardContent sx={{ p: '16px !important' }}>
                    <Typography variant="caption" color="text.secondary">Total Fraccionado</Typography>
                    <Typography variant="h6" fontWeight={700}>S/ {totales.montoCuota.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Tabla de Cronograma de Pagos */}
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="primary" />
                Cuotas del Cronograma
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                size="small"
                onClick={() => window.print()}
                sx={{
                  borderColor: '#3b82f6 !important',
                  color: '#3b82f6 !important',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.08) !important',
                    borderColor: '#2563eb !important'
                  }
                }}
              >
                Imprimir Cronograma
              </Button>
            </Box>
            <Divider />
            <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
              <Table stickyHeader sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Año</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Cód. Res.</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Nº Cuota</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Saldo Inicio</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Interés</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Amortización</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Monto Cuota</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Vencimiento</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Estado</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Fecha Pago</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Monto Pagado</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Nº Pago</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cronograma.map((item: any, index) => (
                    <TableRow key={index} hover>
                      <TableCell align="center">{item.anio}</TableCell>
                      <TableCell align="center">{item.codResolucion}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{item.numeroCuota}</TableCell>
                      <TableCell align="right">S/ {parseFloat(item.saldoInicio || '0').toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: 'warning.dark' }}>S/ {parseFloat(item.interes || '0').toFixed(2)}</TableCell>
                      <TableCell align="right">S/ {parseFloat(item.amortizacion || '0').toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>S/ {parseFloat(item.montoCuota || '0').toFixed(2)}</TableCell>
                      <TableCell align="center">
                        {item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.pagado ? 'PAGADO' : 'PENDIENTE'}
                          size="small"
                          color={item.pagado ? 'success' : 'warning'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {item.fechaPago ? new Date(item.fechaPago).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {item.montoPagado ? `S/ ${parseFloat(item.montoPagado).toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell align="center">{item.numeroPago || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      )}
    </Container>
  );
};

export default Cronograma;
