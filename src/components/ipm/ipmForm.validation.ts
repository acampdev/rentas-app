import type { IPMWriteDTO } from '../../services/ipmService';

export interface IPMFormState {
  anio: string;
  mes: string;
  indice: string;
  variacionMensual: string;
  variacionAcumulada: string;
}

export type IPMValidationResult =
  | { valid: true; data: IPMWriteDTO }
  | { valid: false; error: string };

export const validateIPMForm = (
  form: IPMFormState,
  currentYear = new Date().getFullYear(),
): IPMValidationResult => {
  const anio = Number(form.anio);
  const indice = Number(form.indice);
  const variacionMensual = Number(form.variacionMensual);
  const variacionAcumulada = Number(form.variacionAcumulada);

  if (!Number.isInteger(anio) || anio < 1900 || anio > currentYear + 10) {
    return { valid: false, error: 'Ingrese un año válido' };
  }
  if (!form.mes) return { valid: false, error: 'Seleccione un mes' };
  if (!Number.isFinite(indice) || indice <= 0) {
    return { valid: false, error: 'El índice debe ser mayor a cero' };
  }
  if (!Number.isFinite(variacionMensual) || !Number.isFinite(variacionAcumulada)) {
    return { valid: false, error: 'Las variaciones deben contener valores numéricos válidos' };
  }

  return {
    valid: true,
    data: {
      anio,
      mes: form.mes,
      indice,
      variacionMensual,
      variacionAcumulada,
      usuario: null,
    },
  };
};
