import { describe, expect, it } from 'vitest';
import { validateIPMForm, type IPMFormState } from './ipmForm.validation';

const validForm = (overrides: Partial<IPMFormState> = {}): IPMFormState => ({
  anio: '2026',
  mes: '2401',
  indice: '126.084356',
  variacionMensual: '0.07',
  variacionAcumulada: '0.07',
  ...overrides,
});

describe('validateIPMForm', () => {
  it.each([
    [{ anio: '1800' }, 'Ingrese un año válido'],
    [{ mes: '' }, 'Seleccione un mes'],
    [{ indice: '0' }, 'El índice debe ser mayor a cero'],
    [{ variacionMensual: 'texto' }, 'Las variaciones deben contener valores numéricos válidos'],
  ])('rechaza valores inválidos sin renderizar React', (overrides, error) => {
    expect(validateIPMForm(validForm(overrides), 2026)).toEqual({ valid: false, error });
  });

  it('convierte el formulario válido al DTO del API', () => {
    expect(validateIPMForm(validForm(), 2026)).toEqual({
      valid: true,
      data: {
        anio: 2026,
        mes: '2401',
        indice: 126.084356,
        variacionMensual: 0.07,
        variacionAcumulada: 0.07,
        usuario: null,
      },
    });
  });
});
