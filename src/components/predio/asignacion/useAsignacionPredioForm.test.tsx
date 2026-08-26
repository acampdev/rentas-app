import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Predio } from '../../../models/Predio';
import { useAsignacionPredioForm } from './useAsignacionPredioForm';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  notifyError: vi.fn(),
}));

vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));
vi.mock('../../../hooks/useConstantesOptions', () => ({
  useTipoInscripcionPredio: () => ({ options: [], loading: false }),
}));
vi.mock('../../utils/Notification', () => ({
  NotificationService: { error: mocks.notifyError },
}));

const completeForm = (result: { current: ReturnType<typeof useAsignacionPredioForm> }) => {
  act(() => {
    result.current.selectContributor({
      codigo: 20,
      contribuyente: 'Contribuyente de prueba',
    } as never);
    result.current.selectProperty({ codigoPredio: '202628', anio: 2026 } as Predio);
    result.current.update('modoDeclaracion', '0402');
    result.current.update('fechaDeclaracion', new Date(2026, 1, 26));
    result.current.update('porcentajeCondomino', '100');
  });
};

describe('useAsignacionPredioForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra en el formulario el detalle real cuando el registro falla', async () => {
    const apiMessage = "Error en sp_asignacionPredio (Tipo 1)\r\nMensaje: conflicto con FK_predio_pu";
    const onCrearAsignacion = vi.fn().mockRejectedValue(new Error(apiMessage));
    const { result } = renderHook(() => useAsignacionPredioForm({ onCrearAsignacion }));
    completeForm(result);

    await act(async () => result.current.submit());

    expect(result.current.feedback).toEqual({ severity: 'error', message: apiMessage });
    expect(mocks.notifyError).toHaveBeenCalledWith(apiMessage);
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('muestra el mensaje de éxito del API sin abandonar el formulario de registro', async () => {
    const onCrearAsignacion = vi.fn().mockResolvedValue({
      operationMessage: 'Asignación registrada por el servidor',
    });
    const { result } = renderHook(() => useAsignacionPredioForm({ onCrearAsignacion }));
    completeForm(result);

    await act(async () => result.current.submit());

    expect(result.current.feedback).toEqual({
      severity: 'success',
      message: 'Asignación registrada por el servidor',
    });
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
