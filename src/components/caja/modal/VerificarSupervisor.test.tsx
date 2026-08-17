import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from '../../../services/apiClient';
import VerificarSupervisor from './VerificarSupervisor';

const mocks = vi.hoisted(() => ({
  verificarSupervisor: vi.fn(),
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
  notifyWarning: vi.fn()
}));

vi.mock('../../../hooks/useUsuarios', () => ({
  useUsuarios: () => ({
    verificarSupervisor: mocks.verificarSupervisor,
    verificandoSupervisor: false
  })
}));

vi.mock('../../utils/Notification', () => ({
  NotificationService: {
    success: mocks.notifySuccess,
    error: mocks.notifyError,
    warning: mocks.notifyWarning
  }
}));

describe('VerificarSupervisor', () => {
  beforeEach(() => vi.clearAllMocks());

  it('verifies credentials, obtains a scoped token and authorizes the operation', async () => {
    const onVerified = vi.fn();
    const onClose = vi.fn();
    mocks.verificarSupervisor.mockResolvedValue(true);
    vi.spyOn(apiClient, 'fetch').mockResolvedValue(Response.json({ token: 'token-supervisor' }));

    render(<VerificarSupervisor open onClose={onClose} onVerified={onVerified} />);
    fireEvent.change(screen.getByLabelText(/Usuario/), { target: { value: '  supervisora  ' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: 'clave' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(onVerified).toHaveBeenCalledWith('supervisora', 'token-supervisor'));
    expect(mocks.verificarSupervisor).toHaveBeenCalledWith('supervisora', 'clave');
    expect(apiClient.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.objectContaining({
      method: 'POST',
      auth: false
    }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('blocks the operation when credentials are invalid', async () => {
    const onVerified = vi.fn();
    mocks.verificarSupervisor.mockResolvedValue(false);

    render(<VerificarSupervisor open onClose={vi.fn()} onVerified={onVerified} />);
    fireEvent.change(screen.getByLabelText(/Usuario/), { target: { value: 'operador' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(mocks.notifyError).toHaveBeenCalled());
    expect(onVerified).not.toHaveBeenCalled();
  });

  it('does not call the API when required credentials are empty', () => {
    render(<VerificarSupervisor open onClose={vi.fn()} onVerified={vi.fn()} />);
    fireEvent.submit(screen.getByRole('button', { name: 'Ingresar' }).closest('form')!);

    expect(mocks.verificarSupervisor).not.toHaveBeenCalled();
    expect(mocks.notifyWarning).toHaveBeenCalled();
  });
});
