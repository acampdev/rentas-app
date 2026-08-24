import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAuthenticatedUserCode } from '../../../config/api.unified.config';
import { useFraccionamiento } from '../../../hooks/useFraccionamiento';
import {
  useTipoDocumentoOptions,
  useTiposFraccionamientoOptions,
} from '../../../hooks/useConstantesOptions';
import {
  cuentaCorrienteService,
  type EstadoCuentaAnual,
} from '../../../services/cuentaCorrienteService';
import { logger } from '../../../utils/logger';
import { NotificationService } from '../../utils/Notification';
import {
  buildSolicitudDTO,
  calculateOutstandingDebt,
  createInitialSolicitudValues,
  filterPreviousYearDebts,
  findDocumentType,
  getDefaultOption,
  isSolicitudValid,
} from './solicitudFraccionamiento.adapters';
import type {
  ContribuyenteSeleccionado,
  SelectorContribuyenteValue,
  SolicitudFieldChange,
} from './solicitudFraccionamiento.types';

const EMPTY_CONTRIBUYENTE: ContribuyenteSeleccionado = { codigo: '', nombre: '' };

export const useSolicitudFraccionamiento = () => {
  const [modalContribuyente, setModalContribuyente] = useState(false);
  const [confirmacionDialogo, setConfirmacionDialogo] = useState(false);
  const [contribuyente, setContribuyente] = useState(EMPTY_CONTRIBUYENTE);
  const [detallesCuentaCorriente, setDetallesCuentaCorriente] = useState<EstadoCuentaAnual[]>([]);
  const [cargandoCuentaCorriente, setCargandoCuentaCorriente] = useState(false);
  const [values, setValues] = useState(createInitialSolicitudValues);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const {
    options: tipoFraccionamientoOptions,
    loading: loadingTiposFraccionamiento,
  } = useTiposFraccionamientoOptions();
  const { options: tipoDocumentoOptions } = useTipoDocumentoOptions();
  const { crearSolicitud, cargando, error } = useFraccionamiento(
    {},
    { enabledList: false, enabledStats: false },
  );

  useEffect(() => {
    const defaultValue = getDefaultOption(tipoFraccionamientoOptions);
    if (defaultValue) setValues((current) => current.tipoResolucion ? current : { ...current, tipoResolucion: defaultValue });
  }, [tipoFraccionamientoOptions]);

  useEffect(() => {
    const defaultValue = getDefaultOption(tipoDocumentoOptions);
    if (defaultValue) setValues((current) => current.tipoDocumento ? current : { ...current, tipoDocumento: defaultValue });
  }, [tipoDocumentoOptions]);

  const setField: SolicitudFieldChange = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const deudasFiltradasPorAnio = useMemo(
    () => filterPreviousYearDebts(detallesCuentaCorriente, currentYear),
    [currentYear, detallesCuentaCorriente],
  );
  const sumaDeudaInsoluta = useMemo(
    () => calculateOutstandingDebt(deudasFiltradasPorAnio),
    [deudasFiltradasPorAnio],
  );

  useEffect(() => {
    if (contribuyente.codigo) setField('deudaInsoluta', sumaDeudaInsoluta.toFixed(2));
  }, [contribuyente.codigo, setField, sumaDeudaInsoluta]);

  const handleSeleccionarContribuyente = useCallback(async (selected: SelectorContribuyenteValue) => {
    const codigo = selected.codigo ? String(selected.codigo) : '';
    const documentNumber = selected.numDocumento || selected.dni || selected.documento || codigo;
    const documentType = findDocumentType(selected.tipoDocumento, tipoDocumentoOptions);

    setContribuyente({
      codigo,
      nombre: selected.contribuyente || selected.nombreCompleto || '',
    });
    setValues((current) => ({
      ...current,
      tipoDocumento: documentType || current.tipoDocumento,
      numDocumento: documentNumber || '',
    }));
    setModalContribuyente(false);

    if (!codigo) return;
    setCargandoCuentaCorriente(true);
    try {
      const cuentaCorriente = await cuentaCorrienteService.listarEstadoCuenta(codigo);
      setDetallesCuentaCorriente(cuentaCorriente || []);
      const years = (cuentaCorriente || [])
        .map((item) => item.anio)
        .filter((year) => year > 0 && year < currentYear);
      if (years.length > 0) {
        setValues((current) => ({
          ...current,
          anioDeudaInicio: String(Math.min(...years)),
          anioDeudaFin: String(Math.max(...years)),
        }));
      }
    } catch (requestError) {
      logger.error('[SolicitudFraccionamiento] Error al cargar cuenta corriente:', requestError);
      setDetallesCuentaCorriente([]);
    } finally {
      setCargandoCuentaCorriente(false);
    }
  }, [currentYear, tipoDocumentoOptions]);

  const handleEnviar = useCallback(async () => {
    if (!contribuyente.codigo) {
      NotificationService.error('Debe seleccionar un contribuyente antes de enviar la solicitud.');
      return;
    }
    const solicitud = buildSolicitudDTO({
      contribuyente,
      values,
      tipoFraccionamientoOptions,
      tipoDocumentoOptions,
      codUsuario: getAuthenticatedUserCode(),
      currentYear,
    });
    try {
      await crearSolicitud(solicitud);
      setConfirmacionDialogo(true);
    } catch (requestError: unknown) {
      logger.error('[SolicitudFraccionamiento] Error al registrar:', requestError);
      NotificationService.error(
        requestError instanceof Error ? requestError.message : 'Error al procesar la solicitud de fraccionamiento.',
      );
    }
  }, [contribuyente, crearSolicitud, currentYear, tipoDocumentoOptions, tipoFraccionamientoOptions, values]);

  const handleLimpiar = useCallback(() => {
    setContribuyente(EMPTY_CONTRIBUYENTE);
    setDetallesCuentaCorriente([]);
    setValues(createInitialSolicitudValues(
      getDefaultOption(tipoFraccionamientoOptions),
      getDefaultOption(tipoDocumentoOptions),
    ));
  }, [tipoDocumentoOptions, tipoFraccionamientoOptions]);

  return {
    modalContribuyente,
    confirmacionDialogo,
    contribuyente,
    values,
    detallesCuentaCorriente: deudasFiltradasPorAnio,
    cargandoCuentaCorriente,
    currentYear,
    options: {
      tipoFraccionamiento: tipoFraccionamientoOptions,
      tipoDocumento: tipoDocumentoOptions,
      loadingTiposFraccionamiento,
    },
    cargando,
    error,
    formularioValido: isSolicitudValid(contribuyente, values),
    setField,
    setModalContribuyente,
    setConfirmacionDialogo,
    handleSeleccionarContribuyente,
    handleEnviar,
    handleLimpiar,
  };
};
