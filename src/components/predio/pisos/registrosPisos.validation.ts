export interface PisoFormValues {
  descripcion: string;
  fechaConstruccion: Date | null;
  estadoConservacion: string;
  areaConstruida: string;
  materialPredominante: string;
}

export const parseFechaConstruccion = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const cleanValue = String(value).trim();
  const [yearText, monthText, dayText] = cleanValue.split('T')[0].split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
    return new Date(year, month - 1, day);
  }
  const fallback = new Date(cleanValue);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

export const extraerAnioYCodigoBase = (value: string | null | undefined) => {
  const currentYear = new Date().getFullYear();
  const code = String(value ?? '').trim();
  const year = Number(code.slice(0, 4));
  return code.length >= 5 && year >= 1900 && year <= currentYear + 1
    ? { anio: year, codigoBase: code.slice(4) }
    : { anio: currentYear, codigoBase: code };
};

export const validatePisoForm = (form: PisoFormValues, hasPredio: boolean): Record<string, string> => {
  const errors: Record<string, string> = {};
  const floorNumber = Number(form.descripcion);
  if (!hasPredio) errors.predio = 'Debe seleccionar un predio';
  if (!form.descripcion.trim()) errors.descripcion = 'El número de piso es requerido';
  else if (!Number.isInteger(floorNumber) || floorNumber < 0) errors.descripcion = 'El número de piso debe ser válido y mayor o igual a 0';
  if (!form.fechaConstruccion) errors.fechaConstruccion = 'La fecha es requerida';
  if (!form.estadoConservacion) errors.estadoConservacion = 'Seleccione el estado';
  if (!form.areaConstruida || Number(form.areaConstruida) <= 0) errors.areaConstruida = 'El área debe ser mayor a 0';
  if (!form.materialPredominante) errors.materialPredominante = 'Seleccione el material';
  return errors;
};

export const determinarNumeroPiso = (description: string): number => {
  const direct = Number.parseInt(description, 10);
  if (!Number.isNaN(direct)) return direct;
  const descriptions: Record<string, number> = {
    'Primer piso': 1, 'Segundo piso': 2, 'Tercer piso': 3, 'Sótano': -1, 'Azotea': 99,
  };
  return descriptions[description] ?? 1;
};

export const normalizarValorAreasComunes = (value: string | number | null | undefined): string => {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) return '0';

  const numericValue = Number(normalized);
  return Number.isFinite(numericValue) && numericValue >= 0 ? normalized : '0';
};
