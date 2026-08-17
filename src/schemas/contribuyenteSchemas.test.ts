import { describe, expect, it } from 'vitest';
import { TipoContribuyente } from '../types/formTypes';
import { contribuyenteSchema, conyugeRepresentanteSchema } from './contribuyenteSchemas';

const direccion = { id: 10, descripcion: 'AA.HH. Indoamérica Mz. 11 LT 49', lado: 'D', loteInicial: 49, loteFinal: 49 };

describe('Contribuyente form validation', () => {
  it('accepts a complete natural-person registration', () => {
    const result = contribuyenteSchema.safeParse({
      tipoContribuyente: TipoContribuyente.PERSONA_NATURAL,
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      nombreRazonSocial: 'María Pérez',
      sexo: 'FEMENINO',
      estadoCivil: 'SOLTERO',
      direccion
    });

    expect(result.success).toBe(true);
  });

  it('requires natural-person fields and a selected address', () => {
    const result = contribuyenteSchema.safeParse({
      tipoContribuyente: TipoContribuyente.PERSONA_NATURAL,
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      nombreRazonSocial: 'María Pérez',
      direccion: null
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(['sexo', 'estadoCivil', 'direccion'])
      );
    }
  });

  it('rejects malformed documents for a contributor or legal representative', () => {
    const contributor = contribuyenteSchema.safeParse({
      tipoContribuyente: TipoContribuyente.PERSONA_JURIDICA,
      tipoDocumento: 'RUC',
      numeroDocumento: 'ABC',
      nombreRazonSocial: 'Empresa Municipal',
      direccion
    });
    const representative = conyugeRepresentanteSchema.safeParse({
      tipoDocumento: 'DNI',
      numeroDocumento: '12A',
      apellidosNombres: 'Representante Legal'
    });

    expect(contributor.success).toBe(false);
    expect(representative.success).toBe(false);
  });
});
