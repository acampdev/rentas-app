import { useMemo } from 'react';
import type { EstadoCuentaDetalle } from '../../services/cuentaCorrienteService';

export type DetalleConcepto = {
  anio: number;
  grupoTributo: string;
  tributo: string;
  concepto: 'Cargo' | 'Pagado' | 'F. Venc';
  totalCargos: number;
  totalPagado: number;
  saldoNeto: number;
} & Record<`col${number}`, number | string>;

const MONTH_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const;

const mapRow = (item: EstadoCuentaDetalle, concept: DetalleConcepto['concepto']): DetalleConcepto => {
  const columns = Object.fromEntries(MONTH_NAMES.map((month, index) => {
    const period = index + 1;
    if (concept === 'F. Venc') return [`col${period}`, item[`venc_${month}`] || '-'];
    const prefix = concept === 'Cargo' ? 'cargo' : 'abono';
    return [`col${period}`, item[`${prefix}${period}` as keyof EstadoCuentaDetalle] || 0];
  })) as Record<`col${number}`, number | string>;

  return {
    anio: item.anio,
    grupoTributo: item.grupoTributo,
    tributo: item.tributo,
    concepto: concept,
    totalCargos: item.totalCargos,
    totalPagado: item.totalPagado,
    saldoNeto: item.saldoNeto,
    ...columns,
  };
};

export const useCuentaDetalle = (details: EstadoCuentaDetalle[], selectedYear: number | null) => useMemo(() => {
  const rows = details.flatMap(item => [mapRow(item, 'Cargo'), mapRow(item, 'Pagado'), mapRow(item, 'F. Venc')]);
  const filteredRows = selectedYear ? rows.filter(row => row.anio === selectedYear) : [];
  const groupedRows = new Map<string, DetalleConcepto[]>();
  filteredRows.forEach(row => groupedRows.set(row.tributo, [...(groupedRows.get(row.tributo) ?? []), row]));
  return { detalleConceptos: rows, detallesFiltrados: filteredRows, tributosUnicos: groupedRows };
}, [details, selectedYear]);

export const formatearNumero = (value: number | null | undefined): string => (value ?? 0).toFixed(2);
