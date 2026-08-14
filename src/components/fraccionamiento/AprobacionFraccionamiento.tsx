// src/components/fraccionamiento/AprobacionFraccionamiento.tsx
import React, { useState, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useFraccionamiento } from '../../hooks/useFraccionamiento';
import type { Fraccionamiento } from '../../types/fraccionamiento.types';

const solicitudesPendientes: Fraccionamiento[] = [
  {
    id: 2,
    codigoFraccionamiento: 'FRAC-2024-002',
    codigoContribuyente: 'CONT-002',
    nombreContribuyente: 'María López Sánchez',
    fechaSolicitud: '2024-10-20',
    montoTotal: 3280.00,
    montoCuotaInicial: 500.00,
    numeroCuotas: 18,
    montoCuota: 162.22,
    tasaInteres: 1.5,
    estado: 'PENDIENTE'
  }
];

const AprobacionFraccionamiento: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Fraccionamiento[]>(solicitudesPendientes);
  const [seleccionada, setSeleccionada] = useState<Fraccionamiento | null>(null);
  const [modalAprobar, setModalAprobar] = useState(false);
  const [modalRechazar, setModalRechazar] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const { aprobarSolicitud, rechazarSolicitud, cargando } = useFraccionamiento({}, { enabledList: false, enabledStats: false });

  const handleAprobar = useCallback(async () => {
    if (seleccionada?.id) {
      const exito = await aprobarSolicitud({
        id: seleccionada.id,
        datos: {
          id: seleccionada.id,
          aprobado: true,
          observaciones
        }
      });
      if (exito) {
        setModalAprobar(false);
        setSolicitudes(prev => prev.filter(s => s.id !== seleccionada.id));
        setObservaciones('');
      }
    }
  }, [seleccionada, observaciones, aprobarSolicitud]);

  const handleRechazar = useCallback(async () => {
    if (seleccionada?.id) {
      const exito = await rechazarSolicitud(seleccionada.id, motivoRechazo);
      if (exito) {
        setModalRechazar(false);
        setSolicitudes(prev => prev.filter(s => s.id !== seleccionada.id));
        setMotivoRechazo('');
      }
    }
  }, [seleccionada, motivoRechazo, rechazarSolicitud]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Aprobación de Fraccionamientos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Revise y apruebe o rechace las solicitudes de fraccionamiento pendientes
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>CÓDIGO</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CONTRIBUYENTE</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>FECHA</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">MONTO TOTAL</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">CUOTAS</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">ESTADO</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes.map((sol) => (
                <TableRow key={sol.id} hover>
                  <TableCell>{sol.codigoFraccionamiento}</TableCell>
                  <TableCell>{sol.nombreContribuyente}</TableCell>
                  <TableCell>{new Date(sol.fechaSolicitud).toLocaleDateString()}</TableCell>
                  <TableCell align="right">S/ {sol.montoTotal.toFixed(2)}</TableCell>
                  <TableCell align="center">{sol.numeroCuotas}</TableCell>
                  <TableCell align="center">
                    <Chip label={sol.estado} color="warning" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => {}}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<ApproveIcon />}
                        onClick={() => { setSeleccionada(sol); setModalAprobar(true); }}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<RejectIcon />}
                        onClick={() => { setSeleccionada(sol); setModalRechazar(true); }}
                      >
                        Rechazar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {solicitudes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No hay solicitudes pendientes de aprobación
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal Aprobar */}
      <Dialog open={modalAprobar} onClose={() => setModalAprobar(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
          Aprobar Solicitud: {seleccionada?.codigoFraccionamiento}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Card variant="outlined" sx={{ mb: 3, mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Contribuyente</Typography>
                  <Typography variant="body2" fontWeight={600}>{seleccionada?.nombreContribuyente}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Monto Total</Typography>
                  <Typography variant="body2" fontWeight={600}>S/ {seleccionada?.montoTotal.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <TextField
            fullWidth
            label="Observaciones (Opcional)"
            multiline
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalAprobar(false)} disabled={cargando}>Cancelar</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAprobar}
            disabled={cargando}
            startIcon={cargando && <CircularProgress size={20} color="inherit" />}
          >
            Confirmar Aprobación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Rechazar */}
      <Dialog open={modalRechazar} onClose={() => setModalRechazar(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Rechazar Solicitud: {seleccionada?.codigoFraccionamiento}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
            ¿Está seguro que desea rechazar esta solicitud? Esta acción no se puede deshacer.
          </Alert>
          <TextField
            fullWidth
            label="Motivo del Rechazo"
            multiline
            rows={3}
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            required
            error={!motivoRechazo}
            helperText={!motivoRechazo ? 'El motivo es obligatorio para el rechazo' : ''}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalRechazar(false)} disabled={cargando}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRechazar}
            disabled={cargando || !motivoRechazo}
            startIcon={cargando && <CircularProgress size={20} color="inherit" />}
          >
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AprobacionFraccionamiento;
