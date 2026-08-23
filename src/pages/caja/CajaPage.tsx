// src/pages/caja/CajaPage.tsx
/**
 * Página principal de Gestión de Caja, que coordina la apertura/cierre
 * y delega las operaciones de cobro al componente Pagos.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  Alert,
  Chip
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Componentes
import MainLayout from '../../layout/MainLayout';
import AperturaCaja, { AperturaCajaData } from '../../components/caja/AperturaCaja';
import Pagos from '../../components/caja/Pagos';
import Movimientos from '../../components/caja/modal/Movimientos';
import ListarAperturaCaja from '../../components/caja/ListarAperturaCaja';
import { NotificationService } from '../../components/utils/Notification';

// Servicios
import { aperturaCajaService } from '../../services/aperturaCajaService';
import { asignacionCajaService } from '../../services/asignacionCajaService';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

// Styled Components
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
}));

const _StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  border: '1px solid #e0e0e0',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const createClosedCajaState = (): EstadoCaja => ({
  numeroCaja: '',
  fechaApertura: '',
  montoInicial: 0,
  montoActual: 0,
  totalIngresos: 0,
  totalEgresos: 0,
  abierta: false,
  ultimaTransaccion: undefined
});

// Interface para el estado de la caja
interface EstadoCaja {
  numeroCaja: string;
  fechaApertura: string;
  montoInicial: number;
  montoActual: number;
  totalIngresos: number;
  totalEgresos: number;
  abierta: boolean;
  ultimaTransaccion?: string;
  codAperturaCaja?: number;
  codAsignacionCaja?: number | null;
  codUsuarioOperando?: number;
}

const CajaPage: React.FC = () => {
  // El estado local es únicamente visual. La apertura operativa siempre se
  // vuelve a obtener y verificar contra el backend antes de pagar o cerrar.
  const [estadoCaja, setEstadoCaja] = useState<EstadoCaja>(createClosedCajaState);

  // Estados de modales
  const [aperturaModalOpen, setAperturaModalOpen] = useState(false);
  const [movimientosModalOpen, setMovimientosModalOpen] = useState(false);
  const [listarAperturaModalOpen, setListarAperturaModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const aperturaSyncVersionRef = useRef(0);

  // Sincronizar apertura de caja activa con el servidor
  const syncActiveApertura = useCallback(async (codUsuarioOverride?: number) => {
    const syncVersion = ++aperturaSyncVersionRef.current;

    try {
      const currentCodUsuario = codUsuarioOverride ?? getAuthenticatedUserCode();

      console.log('[CajaPage] currentCodUsuario resuelto para buscar apertura:', currentCodUsuario);
      if (!currentCodUsuario) {
        if (syncVersion === aperturaSyncVersionRef.current) {
          setEstadoCaja(createClosedCajaState());
        }
        return;
      }

      console.log('[CajaPage] Sincronizando apertura activa con servidor para usuario:', currentCodUsuario);
      const apertura = await aperturaCajaService.obtenerPorUsuario(currentCodUsuario);
      console.log('[CajaPage] Apertura obtenida del servidor:', apertura);

      if (syncVersion !== aperturaSyncVersionRef.current) return;

      if (apertura) {
        console.log('[CajaPage] Apertura activa encontrada en servidor:', apertura);
        
        let numCaja = apertura.caja?.trim() ?? '';
        if (!apertura.caja && apertura.codAsignacionCaja) {
          try {
            const asignaciones = await asignacionCajaService.listar({ codUsuario: currentCodUsuario });
            const match = asignaciones.find(a => a.codAsignacionCaja === apertura.codAsignacionCaja);
            if (match) numCaja = match.numCaja;
          } catch (e) {
            console.warn('Error loading assignment name for sync:', e);
          }
        }

        if (syncVersion !== aperturaSyncVersionRef.current) return;

        setEstadoCaja({
          numeroCaja: numCaja,
          fechaApertura: apertura.fechaApertura || '',
          montoInicial: apertura.montoApertura,
          montoActual: apertura.montoCierre ?? apertura.montoApertura,
          totalIngresos: 0,
          totalEgresos: 0,
          abierta: apertura.estado === 'ABIERTO' || apertura.estado === 'ABIERTA',
          ultimaTransaccion: new Date().toLocaleTimeString('es-PE'),
          codAperturaCaja: apertura.codAperturaCaja,
          codAsignacionCaja: apertura.codAsignacionCaja,
          codUsuarioOperando: currentCodUsuario
        });
      } else {
        console.log('[CajaPage] No se encontró apertura activa en el servidor.');
        setEstadoCaja(createClosedCajaState());
      }
    } catch (err) {
      console.error('[CajaPage] Error al sincronizar apertura con servidor:', err);
      if (syncVersion !== aperturaSyncVersionRef.current) return;
      setEstadoCaja(createClosedCajaState());
      const message = err instanceof Error ? err.message : 'No se pudo verificar la apertura activa.';
      NotificationService.error(message);
    }
  }, []);

  // Sincronizar apertura de caja activa con el servidor al cargar
  useEffect(() => {
    syncActiveApertura();
  }, [syncActiveApertura]);

  // Manejar apertura de caja
  const handleAperturaCaja = async (data: AperturaCajaData) => {
    setLoading(true);
    
    try {
      console.log('[CajaPage] Iniciando apertura de caja con datos:', data);
      
      const currentCodUsuario = getAuthenticatedUserCode();
      
      const codAsignacionCaja = data.codAsignacionCaja;
      const selectedCajeroId = data.codUsuario || currentCodUsuario;

      if (!Number.isInteger(selectedCajeroId) || selectedCajeroId <= 0) {
        throw new Error('Debe seleccionar un cajero válido para abrir la caja.');
      }
      
      // Registrar la apertura en la base de datos
      console.log('[CajaPage] Registrando apertura en la base de datos');
      const resultadoApertura = await aperturaCajaService.apertura({
        observacion: data.observacion || 'Aperturar caja',
        montoApertura: data.montoInicial,
        codUsuario: selectedCajeroId
      });
      
      console.log('[CajaPage] Apertura de caja registrada con éxito:', resultadoApertura);

      // Una sincronización anterior no debe sobrescribir esta nueva apertura.
      aperturaSyncVersionRef.current += 1;

      // Actualizar estado de la caja
      const nombreCaja = resultadoApertura.caja?.trim() || data.numeroCaja?.trim() || '';
      setEstadoCaja({
        numeroCaja: nombreCaja,
        fechaApertura: data.fechaApertura,
        montoInicial: data.montoInicial,
        montoActual: data.montoInicial,
        totalIngresos: 0,
        totalEgresos: 0,
        abierta: true,
        ultimaTransaccion: new Date().toLocaleTimeString('es-PE'),
        codAperturaCaja: resultadoApertura.codAperturaCaja,
        codAsignacionCaja: codAsignacionCaja,
        codUsuarioOperando: selectedCajeroId
      });

      // Cerrar modal
      setAperturaModalOpen(false);
      
      // Mostrar notificación
      NotificationService.success(
        `¡Caja abierta exitosamente!${nombreCaja ? ` ${nombreCaja}` : ''} iniciada con S/. ${data.montoInicial.toFixed(2)}`
      );
      
    } catch (error: any) {
      console.error('[CajaPage] Error al abrir caja:', error);
      NotificationService.error(
        `Error al abrir caja: ${error.message || 'No se pudo procesar la apertura. Intente nuevamente.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Manejar operación de caja (para administrador)
  const handleOperarCaja = useCallback(async (codAperturaCaja: number, codUsuario: number, caja: string, _montoApertura: number, _fechaApertura: string) => {
    setLoading(true);
    try {
      const apertura = await aperturaCajaService.verificarAperturaActiva(codUsuario, codAperturaCaja);
      const montoActual = apertura.montoCierre ?? apertura.montoApertura;
      if (!Number.isFinite(montoActual) || montoActual < 0) {
        throw new Error('El servidor no informó un monto válido para la apertura seleccionada.');
      }

      setEstadoCaja({
        numeroCaja: apertura.caja?.trim() || caja.trim(),
        fechaApertura: apertura.fechaApertura || '',
        montoInicial: apertura.montoApertura,
        montoActual,
        totalIngresos: 0,
        totalEgresos: 0,
        abierta: true,
        ultimaTransaccion: new Date().toLocaleTimeString('es-PE'),
        codAperturaCaja: apertura.codAperturaCaja,
        codAsignacionCaja: apertura.codAsignacionCaja,
        codUsuarioOperando: codUsuario
      });
      // Una consulta iniciada antes de seleccionar esta apertura ya no es vigente.
      aperturaSyncVersionRef.current += 1;
      setListarAperturaModalOpen(false);
      NotificationService.success('Operando la apertura activa verificada del cajero seleccionado.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo verificar la caja seleccionada.';
      NotificationService.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Manejar cierre de caja
  const handleCierreCaja = async () => {
    if (window.confirm('¿Está seguro que desea cerrar la caja?')) {
      setLoading(true);
      try {
        const currentCodUsuario = estadoCaja.codUsuarioOperando ?? getAuthenticatedUserCode();
        const aperturaActiva = await aperturaCajaService.verificarAperturaActiva(
          currentCodUsuario,
          estadoCaja.codAperturaCaja
        );
        const codAperturaCaja = aperturaActiva.codAperturaCaja;
        const codAsignacionCaja = aperturaActiva.codAsignacionCaja ?? null;
        const montoCierre = aperturaActiva.montoCierre ?? aperturaActiva.montoApertura;

        if (!codAperturaCaja) {
          throw new Error('El servidor no informó el código de la apertura activa.');
        }
        if (!Number.isFinite(montoCierre) || montoCierre < 0) {
          throw new Error('El servidor no informó un monto válido para cerrar la caja.');
        }
        
        console.log('[CajaPage] Registrando cierre de caja en la base de datos (PUT /api/aperturaCaja/cierre):', {
          codAperturaCaja,
          observacion: 'Cerrar caja',
          montoCierre,
          codUsuario: currentCodUsuario
        });

        await aperturaCajaService.cierre({
          codAperturaCaja,
          codAsignacionCaja,
          observacion: 'Cerrar caja',
          montoCierre,
          codUsuario: currentCodUsuario
        });

        // Invalida verificaciones pendientes que todavía pudieran devolver la
        // apertura como activa y volver a mostrar la sección de cobros.
        aperturaSyncVersionRef.current += 1;
        setEstadoCaja(createClosedCajaState());
        
        NotificationService.info(
          `Caja cerrada: Caja N° ${estadoCaja.numeroCaja} cerrada exitosamente en la base de datos`
        );
      } catch (error: any) {
        console.error('[CajaPage] Error al cerrar caja:', error);
        NotificationService.error(
          `Error al cerrar caja: ${error.message || 'Intente nuevamente.'}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Manejar apertura del modal de movimientos
  const handleVerMovimientos = () => {
    setMovimientosModalOpen(true);
  };

  const puedeOperarCaja =
    estadoCaja.abierta === true &&
    Number.isInteger(estadoCaja.codAperturaCaja) &&
    Number(estadoCaja.codAperturaCaja) > 0 &&
    Number.isInteger(estadoCaja.codUsuarioOperando) &&
    Number(estadoCaja.codUsuarioOperando) > 0;

  return (
    <MainLayout title="Gestión de Caja">
      <PageContainer maxWidth="xl">
      {/* Header */}
      <HeaderBox>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CreditCardIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Gestión de Caja
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Sistema de control de ingresos y egresos
              </Typography>
            </Box>
          </Box>
          <Box>
            <Chip
              label={estadoCaja.abierta ? 'CAJA ABIERTA' : 'CAJA CERRADA'}
              sx={{
                fontWeight: 'bold',
                fontSize: '0.9rem',
                px: 2,
                py: 1,
                color: 'white',
                background: estadoCaja.abierta 
                  ? 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)' 
                  : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                '&:hover': {
                  background: estadoCaja.abierta 
                    ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)' 
                    : 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                }
              }}
            />
          </Box>
        </Box>
      </HeaderBox>

   

      {/* Botones de Control */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Controles de Caja
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {/* Abrir Caja */}
          <ActionButton
            variant="contained"
            startIcon={<CreditCardIcon />}
            onClick={() => setAperturaModalOpen(true)}
            disabled={estadoCaja.abierta}
            sx={{
              background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%) !important',
              backgroundColor: '#4caf50 !important',
              color: '#ffffff !important',
              '&:hover': {
                background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%) !important',
                backgroundColor: '#388e3c !important',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0 !important',
                backgroundColor: '#e0e0e0 !important',
                color: '#a0a0a0 !important',
              }
            }}
          >
            Abrir Caja
          </ActionButton>
          {/* Cerrar Caja */}
          <ActionButton
            variant="contained"
            startIcon={<ScheduleIcon />}
            onClick={handleCierreCaja}
            disabled={!estadoCaja.abierta}
            sx={{
              background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%) !important',
              backgroundColor: '#f44336 !important',
              color: '#ffffff !important',
              '&:hover': {
                background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%) !important',
                backgroundColor: '#d32f2f !important',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0 !important',
                backgroundColor: '#e0e0e0 !important',
                color: '#a0a0a0 !important',
              }
            }}
          >
            Cerrar Caja
          </ActionButton>
          
          <ActionButton
            variant="outlined"
            startIcon={<ReceiptIcon />}
            onClick={handleVerMovimientos}
            disabled={!estadoCaja.abierta}
            sx={{
              borderColor: '#10b981 !important',
              color: '#10b981 !important',
              '&:hover': {
                borderColor: '#059669 !important',
                backgroundColor: 'rgba(16, 185, 129, 0.08) !important',
              },
              '&.Mui-disabled': {
                borderColor: '#e0e0e0 !important',
                color: '#a0a0a0 !important',
              }
            }}
          >
            Ver Movimientos
          </ActionButton>

          <ActionButton
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setListarAperturaModalOpen(true)}
            sx={{
              borderColor: '#1976d2 !important',
              color: '#1976d2 !important',
              '&:hover': {
                borderColor: '#115293 !important',
                backgroundColor: 'rgba(25, 118, 210, 0.08) !important',
              }
            }}
          >
            Historial Aperturas
          </ActionButton>
        </Box>
      </Paper>

      {/* Sección de Pagos/Ingresos */}
      {puedeOperarCaja ? (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Pagos
            codAperturaCaja={Number(estadoCaja.codAperturaCaja)}
            codUsuarioOperando={Number(estadoCaja.codUsuarioOperando)}
            onPagoExitoso={() => void syncActiveApertura(Number(estadoCaja.codUsuarioOperando))}
          />
        </Paper>
      ) : (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          <Typography variant="body1">
            <strong>Caja cerrada:</strong> Para realizar operaciones, primero debe abrir la caja.
          </Typography>
        </Alert>
      )}

      {/* Modal de Apertura de Caja */}
      <AperturaCaja
        open={aperturaModalOpen}
        onClose={() => setAperturaModalOpen(false)}
        onSave={handleAperturaCaja}
        loading={loading}
      />

      {/* Modal de Movimientos */}
      <Movimientos
        open={movimientosModalOpen}
        onClose={() => setMovimientosModalOpen(false)}
      />

      {/* Modal de Historial de Aperturas */}
      <ListarAperturaCaja
        open={listarAperturaModalOpen}
        onClose={() => setListarAperturaModalOpen(false)}
        onOperarCaja={handleOperarCaja}
      />
      </PageContainer>
    </MainLayout>
  );
};

export default CajaPage;
