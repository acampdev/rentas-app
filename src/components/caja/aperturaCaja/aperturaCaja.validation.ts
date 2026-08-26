import type {
  AperturaCajaErrors,
  AperturaCajaFormData,
} from './aperturaCaja.types';

export const validateAperturaCaja = (
  form: AperturaCajaFormData,
  confirmed: boolean,
  hasSelectedUser: boolean,
): AperturaCajaErrors => {
  const errors: AperturaCajaErrors = {};

  if (
    form.montoInicial === '' ||
    !Number.isFinite(form.montoInicial) ||
    form.montoInicial < 0
  ) {
    errors.montoInicial = 'Ingrese un monto inicial mayor o igual a 0';
  }
  if (!confirmed) {
    errors.montoConfirmado = 'Debe confirmar expresamente el monto inicial';
  }
  if (
    !hasSelectedUser ||
    !Number.isInteger(form.codUsuario) ||
    form.codUsuario <= 0
  ) {
    errors.codUsuario = 'Debe seleccionar un cajero válido';
  }

  return errors;
};
