import type { Direccion } from '../../models/Direcciones';
import type { Predio } from '../../models/Predio';

export const formatPredioDireccion = (direccion: string | Direccion | null | undefined): string => {
  if (!direccion) return 'Sin dirección';
  if (typeof direccion === 'string') return direccion;

  const parts: string[] = [];
  if (direccion.nombreVia) parts.push([direccion.nombreTipoVia, direccion.nombreVia].filter(Boolean).join(' '));
  if (direccion.cuadra) parts.push(`Cuadra ${direccion.cuadra}`);
  if (direccion.loteInicial) {
    parts.push(direccion.loteFinal && direccion.loteFinal !== direccion.loteInicial
      ? `Lotes ${direccion.loteInicial}-${direccion.loteFinal}`
      : `Lote ${direccion.loteInicial}`);
  }
  if (direccion.nombreBarrio) parts.push(direccion.nombreBarrio);
  if (direccion.nombreSector) parts.push(`Sector ${direccion.nombreSector}`);
  return parts.join(', ') || direccion.descripcion || 'Sin dirección';
};

export const getPredioCode = (predio: Predio): string | number =>
  predio.codPredioBase || predio.codigoPredio || predio.codPredio || predio.id || '';

export const getPredioAddress = (predio: Predio): string => {
  const direccion = predio.direccion as string | Direccion | null | undefined;
  if (direccion) return formatPredioDireccion(direccion);
  return predio.direccionCompleta || `Dirección del predio ${getPredioCode(predio)}`;
};

export const getPredioKey = (predio: Predio | null): string | null => {
  if (!predio) return null;
  const direccion = predio.direccion as string | Direccion | null | undefined;
  const direccionId = typeof direccion === 'object' && direccion !== null
    ? direccion.id || predio.direccionId
    : predio.direccionId;

  return `${getPredioCode(predio)}-${getPredioAddress(predio)}-${direccionId || ''}-${predio.anio || ''}`.trim();
};

export const prepareSelectedPredio = (predio: Predio): Predio => {
  const code = String(getPredioCode(predio)).trim();
  return {
    ...predio,
    codigoPredio: code,
    codPredio: code,
    codPredioBase: predio.codPredioBase,
  };
};

export const sortPrediosByCode = (predios: Predio[], order: 'asc' | 'desc'): Predio[] => {
  const direction = order === 'asc' ? 1 : -1;
  return [...predios].sort((a, b) => String(getPredioCode(a)).localeCompare(
    String(getPredioCode(b)), undefined, { numeric: true, sensitivity: 'base' },
  ) * direction);
};
