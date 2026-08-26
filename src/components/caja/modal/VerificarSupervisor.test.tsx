import { act, fireEvent, render, screen } from '@testing-library/react';
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

vi.mock('@mui/icons-material', () => ({
  Close: () => null,
  Security: () => null
}));

vi.mock('@mui/material', () => ({
  Box: ({ children, component: Component = 'div', ...props }: {
    children: React.ReactNode;
    component?: React.ElementType;
  }) => <Component {...props}>{children}</Component>,
  Button: ({ children, startIcon: _startIcon, fullWidth: _fullWidth, sx: _sx, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    startIcon?: React.ReactNode;
    fullWidth?: boolean;
    sx?: unknown;
  }) => <button {...props}>{children}</button>,
  CircularProgress: () => null,
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => open ? <div>{children}</div> : null,
  DialogActions: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  IconButton: ({ children, sx: _sx, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { sx?: unknown }) => <button {...props}>{children}</button>,
  TextField: ({ label, fullWidth: _fullWidth, sx: _sx, ...props }: {
    label: string;
    fullWidth?: boolean;
    sx?: unknown;
  } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <label>{label}<input aria-label={label} {...props} /></label>
  ),
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('VerificarSupervisor', () => {
  beforeEach(() => vi.clearAllMocks());

  it('verifies credentials, obtains a scoped token and authorizes the operation', async () => {
    const onVerified = vi.fn();
    const onClose = vi.fn();
    mocks.verificarSupervisor.mockResolvedValue(true);
    vi.spyOn(apiClient, 'request').mockResolvedValue({ token: 'token-supervisor' });

    render(<VerificarSupervisor open onClose={onClose} onVerified={onVerified} />);
    fireEvent.change(screen.getByLabelText(/Usuario/), { target: { value: '  supervisora  ' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: 'clave' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    });

    expect(onVerified).toHaveBeenCalledWith('supervisora', 'token-supervisor');
    expect(mocks.verificarSupervisor).toHaveBeenCalledWith('supervisora', 'clave');
    expect(apiClient.request).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.objectContaining({
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
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    });

    expect(mocks.notifyError).toHaveBeenCalled();
    expect(onVerified).not.toHaveBeenCalled();
  });

  it('does not call the API when required credentials are empty', () => {
    render(<VerificarSupervisor open onClose={vi.fn()} onVerified={vi.fn()} />);
    fireEvent.submit(screen.getByRole('button', { name: 'Ingresar' }).closest('form')!);

    expect(mocks.verificarSupervisor).not.toHaveBeenCalled();
    expect(mocks.notifyWarning).toHaveBeenCalled();
  });
});
