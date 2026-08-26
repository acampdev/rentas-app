import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usuarioService } from '../../../services/usuarioService';
import LogeoSupervisor from './LogeoSupervisor';

const notifications = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn()
}));

vi.mock('../../utils/Notification', () => ({
  NotificationService: notifications
}));

describe('LogeoSupervisor', () => {
  beforeEach(() => vi.clearAllMocks());

  it('entrega el código retornado por la verificación al módulo', async () => {
    const onAuthenticated = vi.fn();
    vi.spyOn(usuarioService, 'verificarSupervisorCajero').mockResolvedValue('26');

    render(
      <LogeoSupervisor
        open
        onAuthenticated={onAuthenticated}
        onCancel={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/Usuario/), { target: { value: ' davila ' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: '13579' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    });

    expect(onAuthenticated).toHaveBeenCalledWith('26');
    expect(usuarioService.verificarSupervisorCajero).toHaveBeenCalledWith('davila', '13579');
  });
});
