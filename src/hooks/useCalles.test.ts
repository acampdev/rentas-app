import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCalles } from './useCalles';

const serviceMocks = vi.hoisted(() => ({
  callesGetAll: vi.fn(),
  sectoresGetAll: vi.fn(),
  barriosGetAll: vi.fn(),
  tiposViaGetAll: vi.fn(),
}));

vi.mock('../services/calleApiService', () => ({
  default: {
    getAll: serviceMocks.callesGetAll,
    create: vi.fn(),
    update: vi.fn(),
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
});
