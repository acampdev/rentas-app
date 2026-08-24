import type { OptionFormat } from '../../../hooks/useConstantesOptions';
import type { EstadoCuentaAnual } from '../../../services/cuentaCorrienteService';
import type { CreateFraccionamientoDTO } from '../../../types/fraccionamiento.types';
import type {
  ContribuyenteSeleccionado,
  SolicitudFraccionamientoValues,
} from './solicitudFraccionamiento.types';

export const createInitialSolicitudValues = (
  tipoResolucion = '',
  tipoDocumento = '',
): SolicitudFraccionamientoValues => ({
  tipoResolucion,
  deudaInsoluta: '0.00',
  cuotaInicial: '1000',
  numeroCuotas: '12',
  anioDeudaInicio: '2024',
  periodoInicio: '1',
  anioDeudaFin: '2025',
  periodoFin: '12',
  solicitante: '1',
  tipoDocumento,
  numDocumento: '',
  cargo: 'Titular',
  anioResoAnterior: '',
  codResoAnterior: '',
});

export const getDefaultOption = (options: OptionFormat[], fallback = ''): string =>
  options.length > 0 ? String(options[0].value) : fallback;

export const findDocumentType = (
  value: string | number | undefined,
  options: OptionFormat[],
): string => {
  if (value === undefined) return getDefaultOption(options);
  const normalized = String(value).toUpperCase();
  const match = options.find((option) =>
    String(option.value) === String(value) || option.label.toUpperCase().includes(normalized));
  return match ? String(match.value) : getDefaultOption(options);
};

export const filterPreviousYearDebts = (
  details: EstadoCuentaAnual[],
  currentYear: number,
): EstadoCuentaAnual[] => details.filter((item) => (item.anio || 0) < currentYear);

export const calculateOutstandingDebt = (details: EstadoCuentaAnual[]): number =>
  details.reduce((sum, item) => sum + (Number(item.saldoNeto) || 0), 0);

export const isSolicitudValid = (
  contribuyente: ContribuyenteSeleccionado,
  values: SolicitudFraccionamientoValues,
): boolean => contribuyente.codigo !== ''
  && Number.parseFloat(values.deudaInsoluta) >= 0
  && Number.parseFloat(values.cuotaInicial || '0') >= 0
  && Number.parseInt(values.numeroCuotas || '0', 10) >= 1
  && Number.parseInt(values.numeroCuotas || '0', 10) <= 60;

interface BuildSolicitudDTOParams {
  contribuyente: ContribuyenteSeleccionado;
  values: SolicitudFraccionamientoValues;
  tipoFraccionamientoOptions: OptionFormat[];
  tipoDocumentoOptions: OptionFormat[];
  codUsuario: number;
  currentYear: number;
}

export const buildSolicitudDTO = ({
  contribuyente,
  values,
  tipoFraccionamientoOptions,
  tipoDocumentoOptions,
  codUsuario,
  currentYear,
}: BuildSolicitudDTOParams): CreateFraccionamientoDTO => ({
  codContribuyente: Number(contribuyente.codigo),
  tipoResolucion: values.tipoResolucion || getDefaultOption(tipoFraccionamientoOptions, '8501'),
  deudaInsoluta: Number.parseFloat(values.deudaInsoluta) || 0,
  cuotaInicial: Number.parseFloat(values.cuotaInicial || '0'),
  numeroCuotas: Number.parseInt(values.numeroCuotas || '0', 10),
  anioDeudaInicio: Number.parseInt(values.anioDeudaInicio, 10) || 2024,
  periodoInicio: Number.parseInt(values.periodoInicio, 10) || 1,
  anioDeudaFin: Number.parseInt(values.anioDeudaFin, 10) || 2024,
  periodoFin: Number.parseInt(values.periodoFin, 10) || 12,
  solicitante: values.solicitante || '1',
  tipoDocumento: values.tipoDocumento || getDefaultOption(tipoDocumentoOptions, '123'),
  numDocumento: values.numDocumento || contribuyente.codigo,
  cargo: values.cargo || 'Titular',
  codUsuario,
  anioResoAnterior: values.anioResoAnterior ? Number.parseInt(values.anioResoAnterior, 10) : null,
  codResoAnterior: values.codResoAnterior ? Number.parseInt(values.codResoAnterior, 10) : null,
  anio: currentYear,
});
