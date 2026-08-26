import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Predio } from '../../../models/Predio';
import { useSelectorPredio } from './useSelectorPredio';

const mocks = vi.hoisted(() => ({ buscarPrediosConFiltros: vi.fn() }));

vi.mock('../../../hooks/usePredioAPI', () => ({
  usePredios: () => ({
    predios: [],
    loading: false,
    error: null,
    buscarPrediosConFiltros: mocks.buscarPrediosConFiltros,
  }),
}));

describe('useSelectorPredio', () => {
  beforeEach(() => {
    mocks.buscarPrediosConFiltros.mockReset().mockResolvedValue([]);
  });

  it('loads current properties and returns the visible property code when confirming', async () => {
    const onClose = vi.fn();
    const onSelectPredio = vi.fn();
    const { result } = renderHook(() => useSelectorPredio({ isOpen: true, onClose, onSelectPredio }));

    expect(mocks.buscarPrediosConFiltros).toHaveBeenCalled();

    const predio = {
      codPredioBase: '8', codigoPredio: '20268', codPredio: '20268',
      condicionPropiedad: '', conductor: '', areaTerreno: 0,
    } as Predio;
    act(() => result.current.setSelectedPredio(predio));
    act(() => result.current.handleConfirm());

    expect(onSelectPredio).toHaveBeenCalledWith(expect.objectContaining({
      codPredioBase: '8', codigoPredio: '8', codPredio: '8',
    }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
