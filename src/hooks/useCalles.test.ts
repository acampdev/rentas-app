import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCalles } from './useCalles';

const serviceMocks = vi.hoisted(() => ({
  callesGetAll: vi.fn(),
  callesCreate: vi.fn(),
  callesUpdate: vi.fn(),
  sectoresGetAll: vi.fn(),
  barriosGetAll: vi.fn(),
  tiposViaGetAll: vi.fn(),
}));

vi.mock('../services/calleApiService', () => ({
  default: {
    getAll: serviceMocks.callesGetAll,
    create: serviceMocks.callesCreate,
    update: serviceMocks.callesUpdate,
    delete: vi.fn(),
  },
}));

vi.mock('../services/SectorService', () => ({
  default: { getAll: serviceMocks.sectoresGetAll },
}));

vi.mock('../services/barrioService', () => ({
  default: { getAll: serviceMocks.barriosGetAll },
}));

vi.mock('../services/viaService', () => ({
  default: { getAll: serviceMocks.tiposViaGetAll },
}));

describe('useCalles', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    serviceMocks.callesGetAll.mockResolvedValue([]);
    serviceMocks.callesCreate.mockResolvedValue(null);
    serviceMocks.callesUpdate.mockResolvedValue(null);
    serviceMocks.sectoresGetAll.mockResolvedValue([]);
    serviceMocks.barriosGetAll.mockResolvedValue([]);
    serviceMocks.tiposViaGetAll.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('carga la lista una sola vez aunque el estado loading provoque renders', async () => {
    renderHook(() => useCalles());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(serviceMocks.callesGetAll).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(serviceMocks.callesGetAll).toHaveBeenCalledTimes(1);
  });

  it('usa update y conserva el código de la vía cuando se activa el modo edición', async () => {
    const via = {
      codVia: 25,
      codigo: 25,
      codTipoVia: '0101',
      codBarrio: 0,
      codSector: 3,
      nombreVia: 'Los Laureles',
      descTipoVia: 'CALLE',
      nombreBarrio: 'CENTRO'
    };
    serviceMocks.callesUpdate.mockResolvedValue(via);

    const { result } = renderHook(() => useCalles());
    await act(async () => vi.advanceTimersByTimeAsync(500));

    act(() => {
      result.current.seleccionarCalle(via);
      result.current.setModoEdicion(true);
    });

    await act(async () => {
      await result.current.guardarCalle({
        nombreVia: 'Los Laureles Actualizada',
        codTipoVia: '0101',
        codBarrio: 0,
        codSector: 3
      });
    });

    expect(serviceMocks.callesUpdate).toHaveBeenCalledWith(25, expect.objectContaining({
      nombreVia: 'Los Laureles Actualizada'
    }));
    expect(serviceMocks.callesCreate).not.toHaveBeenCalled();
  });
});
