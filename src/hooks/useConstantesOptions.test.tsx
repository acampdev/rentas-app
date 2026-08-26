import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import * as catalog from './useConstantesOptions';

vi.mock('@tanstack/react-query', () => ({ useQuery: vi.fn() }));

vi.mock('../services/constanteService', () => ({
  constanteService: new Proxy({}, { get: () => vi.fn() }),
}));

const queryResult = (overrides: Record<string, unknown> = {}) => ({
  data: [],
  isLoading: false,
  error: null,
  ...overrides,
});

describe('useConstantesOptions', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue(queryResult() as ReturnType<typeof useQuery>);
  });

  it('transforma constantes, conserva opciones predeterminadas y expone errores', () => {
    vi.mocked(useQuery).mockReturnValueOnce(queryResult({
      data: [{ codConstante: ' 4101 ', nombreCategoria: 'DNI' }],
    }) as ReturnType<typeof useQuery>);
    const mapped = renderHook(() => catalog.useConstantesOptions('documentos', vi.fn())).result.current;
    expect(mapped.options).toEqual([{ value: '4101', label: 'DNI', id: ' 4101 ' }]);

    const defaults = [{ value: '0', label: 'Sin datos' }];
    vi.mocked(useQuery).mockReturnValueOnce(queryResult() as ReturnType<typeof useQuery>);
    expect(renderHook(() => catalog.useConstantesOptions('vacío', vi.fn(), defaults)).result.current.options).toBe(defaults);

    vi.mocked(useQuery).mockReturnValueOnce(queryResult({ error: new Error('API no disponible') }) as ReturnType<typeof useQuery>);
    expect(renderHook(() => catalog.useConstantesOptions('error', vi.fn())).result.current.error).toBe('API no disponible');
  });

  it('mantiene ejecutable todo el catálogo declarativo de hooks', () => {
    const hooks = Object.entries(catalog)
      .filter(([name, value]) => name !== 'useConstantesOptions' && name.startsWith('use') && typeof value === 'function')
      .map(([, hook]) => hook as () => unknown);

    const { result } = renderHook(() => hooks.map((hook) => hook()));
    expect(result.current).toHaveLength(hooks.length);
    expect(hooks.length).toBeGreaterThan(40);
  });
});
