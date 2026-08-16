// src/components/predio/asignacion/AsignacionPredio.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  alpha,
  Autocomplete,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Home as HomeIcon, Assignment as AssignmentIcon, Person as PersonIcon } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { SelectorContribuyente } from '../../';
import SelectorPredio from '../../modal/SelectorPredio';
import { NotificationService } from '../../utils/Notification';
import { useModoDeclaracionOptions } from '../../../hooks/useConstantesOptions';
import type { CreateAsignacionAPIDTO, PrevalidacionBeneficio } from '../../../services/asignacionService';
import { Predio } from '../../../models/Predio';
import type { ContribuyenteListItem } from '../../../hooks/useContribuyentes';

interface AsignacionContribuyente {
  codigo: number | string;
  nombreCompleto: string;
}

interface AsignacionData {
  año: number;
  contribuyente: AsignacionContribuyente | null;
  predio: Predio | null;
  modoDeclaracion: string;
  fechaVenta: Date | null;
  fechaDeclaracion: Date | null;
  porcentajeCondomino: number;
  esPensionista: boolean;
  estado: string;
}

interface DatosEdicionAsignacion {
  anio?: number;
  codPredio?: string;
  codPredioBase?: number | null;
  codContribuyente?: number | string;
  codAsignacion?: number | string | null;
  nombreContribuyente?: string;
  codPredioContribuyente?: number | null;
  direccionCompleta?: string;
  autoavaluo?: number;
  baseImponible?: number;
  impuestoAnual?: number;
  porcentajeCondomino?: number | null;
  porcentajeCondominoDesc?: string;
  fechaDeclaracion?: string;
  fechaVenta?: string;
  fechaDeclaracionStr?: string;
  fechaVentaStr?: string;
  codModoDeclaracion?: string;
  modoDeclaracion?: string;
  pensionista?: number;
  pensionistaDesc?: string;
  codEstado?: string;
  estado?: string;
  codUsuario?: number | null;
}

interface AsignacionPredioProps {
  onCrearAsignacion?: (datos: CreateAsignacionAPIDTO) => Promise<unknown>;
  onActualizarAsignacion?: (datos: CreateAsignacionAPIDTO) => Promise<unknown>;
  onDesasignar?: (datos: CreateAsignacionAPIDTO) => Promise<unknown>;
  onPrevalidarPensionista?: (codContribuyente: number | string) => Promise<PrevalidacionBeneficio>;
  onPrevalidarAdultoMayor?: (codContribuyente: number | string) => Promise<PrevalidacionBeneficio>;
  loading?: boolean;
  error?: string | null;
  isEditMode?: boolean;
  isDesasignarMode?: boolean;
  datosEdicion?: DatosEdicionAsignacion | null;
}

const estadoOptions = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' }
];

const AsignacionPredio: React.FC<AsignacionPredioProps> = ({
  onCrearAsignacion,
  onActualizarAsignacion,
  onDesasignar,
  onPrevalidarPensionista,
  onPrevalidarAdultoMayor,
  loading: externalLoading = false,
  isEditMode = false,
  isDesasignarMode = false,
  datosEdicion = null
}) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Hooks para opciones
  const { options: modoDeclaracionOptions, loading: loadingModoDeclaracion } = useModoDeclaracionOptions();

  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;
  const [validandoBeneficio, setValidandoBeneficio] = useState(false);
  const [resultadoBeneficio, setResultadoBeneficio] = useState<PrevalidacionBeneficio | null>(null);
  const [confirmarDesasignacion, setConfirmarDesasignacion] = useState(false);
  const [datosDesasignacion, setDatosDesasignacion] = useState<CreateAsignacionAPIDTO | null>(null);

  const [datosEdicionCargados, setDatosEdicionCargados] = useState(false);

  const parseFecha = (fechaStr: string | undefined | null): Date | null => {
    if (!fechaStr) return null;
    try {
      const fechaLimpia = String(fechaStr).trim().split('T')[0];
      const partes = fechaLimpia.split('-');
      if (partes.length === 3) {
        const anio = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const dia = parseInt(partes[2], 10);
        if (!isNaN(anio) && !isNaN(mes) && !isNaN(dia)) {
          return new Date(anio, mes, dia);
        }
      }
    } catch (e) {
      console.error('Error parseando fecha:', e);
    }
    return null;
  };

  const formatFechaAPI = (fecha: Date): string => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  };

  const [asignacionData, setAsignacionData] = useState<AsignacionData>({
    año: currentYear,
    contribuyente: null,
    predio: null,
    modoDeclaracion: '',
    fechaVenta: null,
    fechaDeclaracion: null,
    porcentajeCondomino: 100,
    esPensionista: false,
    estado: 'Activo'
  });

  const [showContribuyenteModal, setShowContribuyenteModal] = useState(false);
  const [showPredioModal, setShowPredioModal] = useState(false);

  useEffect(() => {
    if ((isEditMode || isDesasignarMode) && datosEdicion && !datosEdicionCargados && !loadingModoDeclaracion) {
      const fechaDeclaracionParsed = parseFecha(datosEdicion.fechaDeclaracionStr || datosEdicion.fechaDeclaracion);
      const fechaVentaParsed = parseFecha(datosEdicion.fechaVentaStr || datosEdicion.fechaVenta);

      let modoDeclaracionValue = datosEdicion.codModoDeclaracion || '';
      if (datosEdicion.modoDeclaracion && modoDeclaracionOptions.length > 0) {
        const modoEncontrado = modoDeclaracionOptions.find((opt) => opt.label?.toUpperCase() === datosEdicion.modoDeclaracion?.toUpperCase());
        if (modoEncontrado) {
          modoDeclaracionValue = modoEncontrado.value?.toString() || datosEdicion.codModoDeclaracion || '';
        }
      }

      const contribuyenteFromData: AsignacionContribuyente = {
        codigo: Number(datosEdicion.codContribuyente),
        nombreCompleto: datosEdicion.nombreContribuyente || ''
      };

      const predioFromData: Partial<Predio> = {
        codPredio: datosEdicion.codPredio,
        codigoPredio: datosEdicion.codPredio || '',
        codPredioBase: String(datosEdicion.codPredioBase || ''),
        direccion: datosEdicion.direccionCompleta,
        autoavaluo: datosEdicion.autoavaluo
      };

      let porcentajeValue = 0;
      if (datosEdicion.porcentajeCondomino !== null && datosEdicion.porcentajeCondomino !== undefined) {
        porcentajeValue = Number(datosEdicion.porcentajeCondomino);
      } else if (datosEdicion.porcentajeCondominoDesc) {
        const porcentajeStr = datosEdicion.porcentajeCondominoDesc.replace('%', '').replace(/\s/g, '').replace(',', '.').trim();
        const parsed = parseFloat(porcentajeStr);
        if (!isNaN(parsed)) porcentajeValue = parsed;
      }

      let estadoValue = 'Activo';
      if (datosEdicion.estado) {
        const u = String(datosEdicion.estado).toUpperCase();
        if (u === 'INACTIVO' || u === '0202') {
          estadoValue = 'Inactivo';
        }
      } else if (datosEdicion.codEstado === '0202') {
        estadoValue = 'Inactivo';
      }

      setAsignacionData({
        año: datosEdicion.anio || currentYear,
        contribuyente: contribuyenteFromData,
        predio: predioFromData as Predio,
        modoDeclaracion: modoDeclaracionValue,
        fechaDeclaracion: fechaDeclaracionParsed,
        fechaVenta: fechaVentaParsed,
        porcentajeCondomino: porcentajeValue,
        esPensionista: datosEdicion.pensionista === 1,
        estado: estadoValue
      });

      setDatosEdicionCargados(true);
    }
  }, [isEditMode, isDesasignarMode, datosEdicion, datosEdicionCargados, loadingModoDeclaracion, modoDeclaracionOptions, currentYear]);

  const handleSelectContribuyente = (contribuyente: ContribuyenteListItem) => {
    const contribuyenteAdaptado = {
      ...contribuyente,
      nombreCompleto: contribuyente.contribuyente || ''
    };
    setAsignacionData({
      ...asignacionData,
      contribuyente: contribuyenteAdaptado
    });
    setResultadoBeneficio(null);
    setShowContribuyenteModal(false);
  };

  const handleSelectPredio = (predio: Predio) => {
    setAsignacionData({ ...asignacionData, predio });
    setShowPredioModal(false);
  };

  const validarBeneficio = async (tipo: 'pensionista' | 'adultoMayor'): Promise<PrevalidacionBeneficio | null> => {
    const codigo = asignacionData.contribuyente?.codigo;
    if (!codigo) {
      NotificationService.error('Debe seleccionar un contribuyente');
      return null;
    }

    const prevalidar = tipo === 'pensionista' ? onPrevalidarPensionista : onPrevalidarAdultoMayor;
    if (!prevalidar) return null;

    try {
      setValidandoBeneficio(true);
      const resultado = await prevalidar(codigo);
      setResultadoBeneficio(resultado);
      if (resultado.success) {
        NotificationService.success(resultado.data || 'El contribuyente cumple con la prevalidación');
      } else {
        NotificationService.warning(resultado.data || resultado.message || 'El contribuyente no cumple con la prevalidación');
      }
      return resultado;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al prevalidar el beneficio';
      setResultadoBeneficio({ success: false, message, data: message });
      NotificationService.error(message);
      return null;
    } finally {
      setValidandoBeneficio(false);
    }
  };

  const handlePensionistaChange = async (value: string) => {
    if (value === 'no') {
      setAsignacionData({ ...asignacionData, esPensionista: false });
      setResultadoBeneficio(null);
      return;
    }

    const resultado = await validarBeneficio('pensionista');
    setAsignacionData((actual) => ({
      ...actual,
      esPensionista: resultado?.success === true
    }));
  };

  const ejecutarOperacion = async (datosAPI: CreateAsignacionAPIDTO) => {
    try {
      setInternalLoading(true);
      if (isDesasignarMode) {
        if (!onDesasignar) return;
        await onDesasignar(datosAPI);
      } else if (isEditMode) {
        if (!onActualizarAsignacion) return;
        await onActualizarAsignacion(datosAPI);
      } else {
        if (!onCrearAsignacion) return;
        await onCrearAsignacion(datosAPI);
      }

      navigate('/predio/asignacion/consulta', {
        state: {
          searchParams: {
            anio: datosAPI.anio,
            codContribuyente: String(datosAPI.codContribuyente)
          },
          nombreContribuyente: asignacionData.contribuyente?.nombreCompleto || ''
        }
      });
    } catch (error: unknown) {
      NotificationService.error(error instanceof Error ? error.message : 'Error al procesar la asignación');
    } finally {
      setInternalLoading(false);
    }
  };

  const handleRegistrar = async () => {
    if (!asignacionData.contribuyente || !asignacionData.predio) {
      NotificationService.error('Debe seleccionar un contribuyente y un predio');
      return;
    }

    if (!asignacionData.fechaDeclaracion) {
      NotificationService.error('Debe seleccionar la fecha de declaracion');
      return;
    }

    if (!asignacionData.modoDeclaracion) {
      NotificationService.error('Debe seleccionar un modo de declaración');
      return;
    }

    if (asignacionData.porcentajeCondomino < 0 || asignacionData.porcentajeCondomino > 100) {
      NotificationService.error('El porcentaje condómino debe estar entre 0 y 100');
      return;
    }

    const predioBaseCodigo = String(asignacionData.predio.codPredioBase || asignacionData.predio.codigoPredio || asignacionData.predio.codPredio || '').trim();
    const anioPredio = Number(asignacionData.año || asignacionData.predio.anio);
    const codigoPredioFinal = predioBaseCodigo.startsWith(String(anioPredio)) ? predioBaseCodigo : `${anioPredio}${predioBaseCodigo}`;
    const codigoContribuyente = Number(asignacionData.contribuyente.codigo);

    if (!predioBaseCodigo || !Number.isFinite(codigoContribuyente)) {
      NotificationService.error('Los códigos de predio o contribuyente no son válidos');
      return;
    }

    const datosAPI: CreateAsignacionAPIDTO = {
      anio: anioPredio,
      codPredio: codigoPredioFinal.trim(),
      codContribuyente: codigoContribuyente,
      codAsignacion: datosEdicion?.codAsignacion ?? null,
      porcentajeCondomino: asignacionData.porcentajeCondomino >= 100 ? null : asignacionData.porcentajeCondomino,
      fechaDeclaracion: formatFechaAPI(asignacionData.fechaDeclaracion),
      fechaVenta: formatFechaAPI(asignacionData.fechaVenta || asignacionData.fechaDeclaracion),
      codModoDeclaracion: String(asignacionData.modoDeclaracion).trim(),
      pensionista: asignacionData.esPensionista ? 1 : 0,
      codEstado: isDesasignarMode ? datosEdicion?.codEstado || '0201' : asignacionData.estado === 'Activo' ? '0201' : '0202'
    };

    if (isDesasignarMode) {
      setDatosDesasignacion(datosAPI);
      setConfirmarDesasignacion(true);
      return;
    }

    await ejecutarOperacion(datosAPI);
  };

  const handleConfirmarDesasignacion = async () => {
    if (!datosDesasignacion) return;
    setConfirmarDesasignacion(false);
    await ejecutarOperacion(datosDesasignacion);
    setDatosDesasignacion(null);
  };

  const handleNuevo = () => {
    setAsignacionData({
      año: currentYear,
      contribuyente: null,
      predio: null,
      modoDeclaracion: '',
      fechaVenta: null,
      fechaDeclaracion: null,
      porcentajeCondomino: 100,
      esPensionista: false,
      estado: 'Activo'
    });
    setDatosEdicionCargados(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Seleccionar contribuyente y predio
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {/* Contribuyente */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setShowContribuyenteModal(true)}
                  disabled={isDesasignarMode}
                  startIcon={<PersonIcon />}
                  sx={{ height: 33, width: 160 }}
                >
                  Contribuyente
                </Button>
                {/* Código Contribuyente */}
                <TextField label="Código" value={asignacionData.contribuyente?.codigo || ''} size="small" disabled sx={{ width: 100 }} />
                {/* Nombre */}
                <TextField fullWidth label="Nombre" value={asignacionData.contribuyente?.nombreCompleto || ''} size="small" disabled sx={{ flex: 1 }} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                {/* Predio */}
                <Button
                  variant="outlined"
                  onClick={() => setShowPredioModal(true)}
                  disabled={isDesasignarMode || !asignacionData.contribuyente}
                  startIcon={<HomeIcon />}
                  sx={{ height: 33, width: 160 }}
                >
                  Predio
                </Button>
                {/* Código Predio */}
                <TextField label="Código" value={asignacionData.predio?.codigoPredio || ''} size="small" disabled sx={{ width: 100 }} />
                {/* Dirección */}
                <TextField
                  fullWidth
                  label="Dirección"
                  value={typeof asignacionData.predio?.direccion === 'string' ? asignacionData.predio.direccion : ''}
                  size="small"
                  disabled
                  sx={{ flex: 1 }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <AssignmentIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Datos de la asignación
              </Typography>
            </Stack>

            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Año"
                  type="number"
                  size="small"
                  disabled={isDesasignarMode}
                  value={asignacionData.año}
                  onChange={(event) =>
                    setAsignacionData({
                      ...asignacionData,
                      año: Number(event.target.value)
                    })
                  }
                  inputProps={{ min: 1900, max: currentYear + 10 }}
                  sx={{ width: 110 }}
                />
                {/* Modo Declaración */}
                <Autocomplete
                  sx={{ width: 280 }}
                  disabled={isDesasignarMode}
                  options={modoDeclaracionOptions}
                  getOptionLabel={(o) => o?.label || ''}
                  value={modoDeclaracionOptions.find((opt) => String(opt.value) === String(asignacionData.modoDeclaracion)) || null}
                  onChange={(_, v) =>
                    setAsignacionData({
                      ...asignacionData,
                      modoDeclaracion: v?.value?.toString() || ''
                    })
                  }
                  renderInput={(p) => <TextField {...p} label="Modo Declaración" size="small" required />}
                />
                {/* Fecha Declaración */}
                <DatePicker
                  label="Fecha declaración"
                  disabled={isDesasignarMode}
                  value={asignacionData.fechaDeclaracion}
                  onChange={(v: Date | null) =>
                    setAsignacionData({
                      ...asignacionData,
                      fechaDeclaracion: v
                    })
                  }
                  slotProps={{
                    textField: { size: 'small', sx: { width: 160 } }
                  }}
                />
                {/* Fecha Venta */}
                <DatePicker
                  label="Fecha venta"
                  disabled={isDesasignarMode}
                  value={asignacionData.fechaVenta}
                  onChange={(v: Date | null) => setAsignacionData({ ...asignacionData, fechaVenta: v })}
                  slotProps={{
                    textField: { size: 'small', sx: { width: 160 } }
                  }}
                />
              </Box>

              {/* Fila para Estado y Es Pensionista */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <TextField
                  label="Porcentaje condómino"
                  type="number"
                  size="small"
                  disabled={isDesasignarMode}
                  value={asignacionData.porcentajeCondomino}
                  onChange={(event) =>
                    setAsignacionData({
                      ...asignacionData,
                      porcentajeCondomino: Number(event.target.value)
                    })
                  }
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  sx={{ width: 190 }}
                />
                {/* Autocomplete de Estado */}
                <Autocomplete
                  sx={{ width: 200 }}
                  disabled={isDesasignarMode}
                  options={estadoOptions}
                  getOptionLabel={(o) => o?.label || ''}
                  value={estadoOptions.find((opt) => opt.value === asignacionData.estado) || estadoOptions[0]}
                  onChange={(_, v) =>
                    setAsignacionData({
                      ...asignacionData,
                      estado: v?.value || 'Activo'
                    })
                  }
                  renderInput={(p) => <TextField {...p} label="Estado" size="small" />}
                />

                {/* Es Pensionista */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Es Pensionista:
                  </Typography>
                  <RadioGroup
                    row
                    value={asignacionData.esPensionista ? 'si' : 'no'}
                    onChange={(event) => {
                      void handlePensionistaChange(event.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="si"
                      disabled={isDesasignarMode || validandoBeneficio}
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Sí</Typography>}
                    />
                    <FormControlLabel
                      value="no"
                      disabled={isDesasignarMode || validandoBeneficio}
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">No</Typography>}
                    />
                  </RadioGroup>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={isDesasignarMode || validandoBeneficio || !asignacionData.contribuyente}
                  onClick={() => {
                    void validarBeneficio('adultoMayor');
                  }}
                >
                  Validar adulto mayor
                </Button>
              </Box>
              {resultadoBeneficio && (
                <Alert severity={resultadoBeneficio.success ? 'success' : 'warning'}>{resultadoBeneficio.data || resultadoBeneficio.message}</Alert>
              )}
            </Stack>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              {/* Botón para registrar asignación */}
              <Button
                variant="contained"
                onClick={handleRegistrar}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AssignmentIcon />}
                sx={{
                  bgcolor: isDesasignarMode ? '#ef4444 !important' : '#10b981 !important',
                  color: 'white !important',
                  fontSize: '0.813rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  height: 40,
                  '&.Mui-disabled': {
                    bgcolor: `${alpha(isDesasignarMode ? '#ef4444' : '#10b981', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important'
                  }
                }}
              >
                {isDesasignarMode ? 'Desasignar' : isEditMode ? 'Actualizar' : 'Registrar'}
              </Button>
              {/* Botón para limpiar */}
              {!isDesasignarMode && (
                <Button
                  variant="outlined"
                  onClick={handleNuevo}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    px: 3,
                    py: 1,
                    fontSize: '0.813rem',
                    height: 40
                  }}
                >
                  Limpiar
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <SelectorContribuyente
        isOpen={showContribuyenteModal}
        onClose={() => setShowContribuyenteModal(false)}
        onSelectContribuyente={handleSelectContribuyente}
        title="Seleccionar Contribuyente"
      />
      <SelectorPredio isOpen={showPredioModal} onClose={() => setShowPredioModal(false)} onSelectPredio={handleSelectPredio} title="Seleccionar Predio" />
      <Dialog open={confirmarDesasignacion} onClose={() => setConfirmarDesasignacion(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar desasignación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Desea desasignar el predio <strong>{datosDesasignacion?.codPredio.trim()}</strong> del contribuyente{' '}
            <strong>{datosDesasignacion?.codContribuyente}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta operación cambiará la relación activa entre el contribuyente y el predio.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmarDesasignacion(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              void handleConfirmarDesasignacion();
            }}
            variant="contained"
            color="error"
            disabled={loading}
          >
            Confirmar desasignación
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AsignacionPredio;
