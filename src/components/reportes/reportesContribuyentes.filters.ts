import type { ContribuyenteListItem } from '../../hooks/useContribuyentes';
import type { OptionFormat } from '../../hooks/useConstantesOptions';

export interface ReporteContribuyentesFiltros {
  tipoPersona: string;
  tipoDocumento: string;
}

const normalizeFilterValue = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

export const filtrarContribuyentesReporte = (
  contribuyentes: ContribuyenteListItem[],
  filtros: ReporteContribuyentesFiltros,
  tiposDocumento: OptionFormat[]
): ContribuyenteListItem[] => {
  const documentoSeleccionado = tiposDocumento.find(
    (option) => String(option.value) === filtros.tipoDocumento
  );
  const valoresDocumentoAceptados = new Set([
    normalizeFilterValue(filtros.tipoDocumento),
    normalizeFilterValue(documentoSeleccionado?.label)
  ].filter(Boolean));

  return contribuyentes.filter((contribuyente) => {
    if (
      filtros.tipoPersona !== 'todos' &&
      contribuyente.tipoPersona !== filtros.tipoPersona
    ) {
      return false;
    }

    if (filtros.tipoDocumento === 'todos') return true;

    return valoresDocumentoAceptados.has(
      normalizeFilterValue(contribuyente.tipoDocumento)
    );
  });
};
