import { describe, expect, it } from 'vitest';
import type { ContribuyenteListItem } from '../../hooks/useContribuyentes';
import { filtrarContribuyentesReporte } from './reportesContribuyentes.filters';

const contribuyentes: ContribuyenteListItem[] = [
  {
    codigo: 1,
    contribuyente: 'Persona con código de documento',
    documento: '12345678',
    tipoDocumento: '4101',
    tipoPersona: 'natural',
    direccion: ''
  },
  {
    codigo: 2,
    contribuyente: 'Empresa con descripción de documento',
    documento: '20123456789',
    tipoDocumento: 'RUC',
    tipoPersona: 'juridica',
    direccion: ''
  }
];

const tiposDocumento = [
  { value: '4101', label: 'DNI' },
  { value: '4102', label: 'RUC' }
];

describe('filtrarContribuyentesReporte', () => {
  it('aplica el tipo de documento cuando el API devuelve su código', () => {
    expect(filtrarContribuyentesReporte(
      contribuyentes,
      { tipoPersona: 'todos', tipoDocumento: '4101' },
      tiposDocumento
    ).map((item) => item.codigo)).toEqual([1]);
  });

  it('aplica el tipo de documento cuando el API devuelve su descripción', () => {
    expect(filtrarContribuyentesReporte(
      contribuyentes,
      { tipoPersona: 'todos', tipoDocumento: '4102' },
      tiposDocumento
    ).map((item) => item.codigo)).toEqual([2]);
  });

  it('combina los filtros de persona y documento', () => {
    expect(filtrarContribuyentesReporte(
      contribuyentes,
      { tipoPersona: 'natural', tipoDocumento: '4102' },
      tiposDocumento
    )).toEqual([]);
  });
});
