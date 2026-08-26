import { describe, expect, it } from 'vitest';
import type { AperturaCajaFormData } from './aperturaCaja.types';
import { validateAperturaCaja } from './aperturaCaja.validation';

const validForm = (montoInicial: number | '' = 100): AperturaCajaFormData => ({
  numeroCaja: 'CAJA01',
  fechaApertura: '25/08/2026',
  montoInicial,
  observacion: 'Aperturar caja',
  codUsuario: 17,
  codAsignacionCaja: 1,
});

describe('validateAperturaCaja', () => {
  it('acepta monto cero cuando fue confirmado y existe un cajero válido', () => {
    expect(validateAperturaCaja(validForm(0), true, true)).toEqual({});
  });

  it('informa todas las reglas incumplidas en una sola validación', () => {
    expect(validateAperturaCaja({ ...validForm(''), codUsuario: 0 }, false, false)).toEqual({
      montoInicial: 'Ingrese un monto inicial mayor o igual a 0',
      montoConfirmado: 'Debe confirmar expresamente el monto inicial',
      codUsuario: 'Debe seleccionar un cajero válido',
    });
  });
});
