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

const getPredioCode = (predio: Predio) => predio.codPredioBase || predio.codigoPredio || predio.codPredio || '';

export const sortPrediosByCode = (predios: Predio[], order: 'asc' | 'desc'): Predio[] => {
  const direction = order === 'asc' ? 1 : -1;
  return [...predios].sort((a, b) => String(getPredioCode(a)).localeCompare(
    String(getPredioCode(b)), undefined, { numeric: true, sensitivity: 'base' },
  ) * direction);
};
