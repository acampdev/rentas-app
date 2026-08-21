// hooks/usePagos.ts
import { useState, useCallback } from 'react';
import { useModuleHotkeys } from './useModuleHotkeys';
import { Pago, ContribuyenteOption } from '../models';
import { pagoService, SaldoDeudaItem } from '../services/pagoService';
import { NotificationService } from '../components/utils/Notification';
import { aperturaCajaService } from '../services/aperturaCajaService';

const mapTributoNameToCode = (name: string): number => {
  const lower = name.toLowerCase();
  if (lower.includes('predial')) return 1;
  if (lower.includes('limpieza')) return 2;
  if (lower.includes('serenazgo')) return 3;
  if (lower.includes('parques') || lower.includes('jardines')) return 4;
  return 1; // Fallback por defecto
};

export interface PagoFeedback {
  severity: 'success' | 'error' | 'info';
  message: string;
}

export const usePagos = (onPagoExitoso?: () => void) => {
  const [pagoData, setPagoData] = useState<Pago>({
    codigo: '',
    rucDni: '',
    contribuyente: null,
    direccion: '',
    fechaRecibo: new Date(),
    descripcion: '',
    conceptos: [],
    formaPago: 'CONTADO',
    total: 0
  });

  const [busquedaContribuyente, setBusquedaContribuyente] = useState('');
  const [modalBusquedaOpen, setModalBusquedaOpen] = useState(false);
  const [modalDeudaOpen, setModalDeudaOpen] = useState(false);
  const [contribuyenteSeleccionado, setContribuyenteSeleccionado] = useState<ContribuyenteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagoFeedback, setPagoFeedback] = useState<PagoFeedback | null>(null);

  const handleNuevo = useCallback(() => {
    setPagoData({
      codigo: '', rucDni: '', contribuyente: null, direccion: '',
      fechaRecibo: new Date(), descripcion: '', conceptos: [],
      formaPago: 'CONTADO', total: 0
    });
    setBusquedaContribuyente('');
    setContribuyenteSeleccionado(null);
    setPagoFeedback(null);
  }, []);

  const handleGrabar = useCallback(async () => {
    if (pagoData.conceptos.length === 0 || !contribuyenteSeleccionado) return;

    setPagoFeedback(null);
    setLoading(true);
    try {
      const mensajesApi: string[] = [];
      // 1. Obtener la caja activa de localStorage
      const savedEstado = localStorage.getItem('estado_caja');
      console.log('[usePagos] savedEstado de localStorage:', savedEstado);
      const estadoCaja = savedEstado ? JSON.parse(savedEstado) : null;
      let codAperturaCaja = estadoCaja?.codAperturaCaja;
      console.log('[usePagos] codAperturaCaja extraído de localStorage:', codAperturaCaja);
      
      // Fallback: Si no está en local storage, consultar directamente al servidor
      if (!codAperturaCaja) {
        console.log('[usePagos] codAperturaCaja no encontrado en localStorage, consultando servidor...');
        const userStr = sessionStorage.getItem('auth_user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const currentCodUsuario = userObj ? Number(userObj.id) : null;
        
        if (currentCodUsuario) {
          const aperturaServer = await aperturaCajaService.obtenerPorUsuario(currentCodUsuario);
          console.log('[usePagos] Apertura recuperada del servidor como fallback:', aperturaServer);
          if (aperturaServer && aperturaServer.codAperturaCaja) {
            codAperturaCaja = aperturaServer.codAperturaCaja;
            // Sincronizar en localStorage para futuras operaciones
            const newEstado = {
              ...(estadoCaja || {}),
              numeroCaja: aperturaServer.caja || '00013',
              fechaApertura: aperturaServer.fechaApertura || '',
              montoInicial: aperturaServer.montoApertura || 0,
              montoActual: aperturaServer.montoCierre || aperturaServer.montoApertura || 0,
              abierta: true,
              codAperturaCaja: aperturaServer.codAperturaCaja,
              codAsignacionCaja: aperturaServer.codAsignacionCaja,
              codUsuarioOperando: currentCodUsuario
            };
            localStorage.setItem('estado_caja', JSON.stringify(newEstado));
          }
        }
      }

      if (!codAperturaCaja) {
        throw new Error('No existe una apertura de caja activa. Primero debe abrir la caja.');
      }

      console.log('[usePagos] Registrando pago de conceptos...');
      
      // Mapeo del medio de pago
      let codMedioPago = '123';
      if (pagoData.formaPago === 'CONTADO') codMedioPago = '1';
      else if (pagoData.formaPago === 'TARJETA') codMedioPago = '2';
      else if (pagoData.formaPago === 'TRANSFERENCIA') codMedioPago = '3';

      // 2. Agrupar todos los saldos de deudas ordinarias
      const saldosDeuda: SaldoDeudaItem[] = [];
      const ordinarioConceptos = pagoData.conceptos.filter(c => ((c as any).tipoPago || 'ordinario') === 'ordinario');
      
      for (const c of ordinarioConceptos) {
        const años = (c as any).añosAfectados || [new Date().getFullYear()];
        const meses = (c as any).mesesAfectados || [1];
        const detalleMeses = (c as any).detalleMeses || {};
        const tributoNombre = (c as any).tributoNombre || c.descripcion.split(' - ')[0] || '';
        const codTributo = mapTributoNameToCode(tributoNombre);
        console.log(`[usePagos] Mapeando concepto: "${c.descripcion}", tributoNombre: "${tributoNombre}" -> codTributo: ${codTributo}`);

        for (const anio of años) {
          for (const mes of meses) {
            const montoMes = detalleMeses[mes] !== undefined 
              ? (detalleMeses[mes] / (años.length || 1)) 
              : (c.total / ((años.length * meses.length) || 1));
            
            saldosDeuda.push({
              codTributo,
              anio: Number(anio),
              periodo: Number(mes),
              abono: Number(montoMes.toFixed(4))
            });
          }
        }
      }

      // Enviar deudas ordinarias en un solo API request
      if (saldosDeuda.length > 0) {
        console.log('[usePagos] Enviando PagoOrdinario unificado:', saldosDeuda);
        const totalOrdinario = ordinarioConceptos.reduce((sum, c) => sum + c.total, 0);

        const resultadoOrdinario = await pagoService.registrarPagoOrdinario({
          codAperturaCaja,
          codContribuyente: Number(contribuyenteSeleccionado.id || contribuyenteSeleccionado.codigo),
          montoPagoTotal: Number(totalOrdinario.toFixed(2)),
          codMedioPago,
          codTipoAbono: '12',
          saldosDeuda
        });
        mensajesApi.push(resultadoOrdinario.message);
      }

      // 3. Procesar cuotas de fraccionamiento unificadamente (si existen)
      const fraccConceptos = pagoData.conceptos.filter(c => ((c as any).tipoPago || 'ordinario') === 'fraccionamiento');
      const saldosDeudaFracc: any[] = [];
      let totalFracc = 0;

      for (const c of fraccConceptos) {
        totalFracc += c.total;
        const items = (c as any).saldosDeuda || [];
        saldosDeudaFracc.push(...items);
      }

      if (saldosDeudaFracc.length > 0) {
        console.log('[usePagos] Enviando PagoCuotaFraccionamiento unificado:', saldosDeudaFracc);
        const resultadoFraccionamiento = await pagoService.registrarPagoCuotaFraccionamiento({
          codAperturaCaja,
          codContribuyente: Number(contribuyenteSeleccionado.id || contribuyenteSeleccionado.codigo),
          montoPagoTotal: Number(totalFracc.toFixed(2)),
          codMedioPago,
          codTipoAbono: '12',
          saldosDeuda: saldosDeudaFracc
        });
        mensajesApi.push(resultadoFraccionamiento.message);
      }

      const mensajeResultado = [...new Set(mensajesApi.filter(Boolean))].join(' ')
        || 'El pago se ha registrado exitosamente en el servidor.';
      NotificationService.success(mensajeResultado);
      handleNuevo(); // Limpiar formulario
      setPagoFeedback({ severity: 'success', message: mensajeResultado });
      if (onPagoExitoso) {
        onPagoExitoso();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Intente de nuevo.';
      console.error('[usePagos] Error al registrar pago:', error);
      NotificationService.error(`Error al registrar pago: ${message}`);
      setPagoFeedback({ severity: 'error', message });
    } finally {
      setLoading(false);
    }
  }, [pagoData, contribuyenteSeleccionado, handleNuevo, onPagoExitoso]);

  const handleImprimirRecibo = useCallback(() => {
    if (pagoData.conceptos.length === 0) return;
  }, [pagoData.conceptos.length]);

  const handleLimpiarConceptos = useCallback(() => {
    setPagoData(prev => ({ ...prev, conceptos: [], total: 0 }));
  }, []);

  const handleSeleccionarContribuyente = useCallback((contribuyente: ContribuyenteOption) => {
    setPagoData(prev => ({
      ...prev,
      codigo: String(contribuyente.codigoPredio || contribuyente.codigo || ''),
      rucDni: String(contribuyente.dniRuc || contribuyente.documento || ''),
      direccion: String(contribuyente.direccionPredio || contribuyente.direccion || '')
    }));
    setBusquedaContribuyente(contribuyente.contribuyente || contribuyente.nombreCompleto || '');
    setContribuyenteSeleccionado(contribuyente);
    setModalBusquedaOpen(false);
  }, []);

  const handlePagoGenerado = useCallback((datosPago: { conceptos?: any[], montoTotal: number | string }) => {
    const nuevosConceptos = (datosPago.conceptos || []).map((c: any) => ({
      id: String(c.id || Math.random()),
      descripcion: c.descripcion,
      total: Number(c.total || 0),
      tipoPago: c.tipoPago,
      tributoNombre: c.tributoNombre,
      añosAfectados: c.añosAfectados,
      mesesAfectados: c.mesesAfectados,
      detalleMeses: c.detalleMeses,
      nCuota: c.nCuota,
      resolucion: c.resolucion,
      anioResolucion: c.anioResolucion,
      saldosDeuda: c.saldosDeuda
    }));
    setPagoData(prev => ({
      ...prev,
      conceptos: [...prev.conceptos, ...nuevosConceptos],
      total: prev.total + (Number(datosPago.montoTotal) || 0)
    }));
    setModalDeudaOpen(false);
  }, []);

  const handleEliminarConcepto = useCallback((id: string) => {
    setPagoData(prev => ({
      ...prev,
      conceptos: prev.conceptos.filter(c => c.id !== id)
    }));
  }, []);

  const calcularTotal = useCallback(() => {
    return pagoData.conceptos.reduce((sum, c) => sum + c.total, 0);
  }, [pagoData.conceptos]);

  useModuleHotkeys('Pagos - Ingresos', [
    { id: 'buscar', name: 'Buscar', description: 'Buscar contribuyente', hotkey: { key: 'F2', preventDefault: true }, action: () => setModalBusquedaOpen(true) },
    { id: 'deuda', name: 'Ver Deuda', description: 'Ver deuda', hotkey: { key: 'F3', preventDefault: true }, action: () => setModalDeudaOpen(true), enabled: !!contribuyenteSeleccionado },
    { id: 'grabar', name: 'Grabar', description: 'Grabar pago', hotkey: { key: 'F4', preventDefault: true }, action: handleGrabar, enabled: pagoData.conceptos.length > 0 && !!contribuyenteSeleccionado },
    { id: 'nuevo', name: 'Nuevo', description: 'Nuevo pago', hotkey: { key: 'F5', preventDefault: true }, action: handleNuevo },
    { id: 'imprimir', name: 'Imprimir', description: 'Imprimir recibo', hotkey: { key: 'F6', preventDefault: true }, action: handleImprimirRecibo, enabled: pagoData.conceptos.length > 0 }
  ]);

  return {
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
  };
};
