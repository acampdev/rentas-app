import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTiposMesesOptions } from '../../hooks/useConstantesOptions';
import IPMForm from './IPMForm';

vi.mock('../../hooks/useConstantesOptions', () => ({
  useTiposMesesOptions: vi.fn()
}));

vi.mock('@mui/icons-material', () => ({
  RestartAlt: () => null,
  Save: () => null
}));

vi.mock('@mui/material', () => ({
  Alert: ({ children }: { children: React.ReactNode }) => <div role="alert">{children}</div>,
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, type = 'button', startIcon: _startIcon, sx: _sx, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    startIcon?: React.ReactNode;
    sx?: unknown;
  }) => (
    <button type={type} {...props}>{children}</button>
  ),
  CircularProgress: () => null,
  MenuItem: ({ children, value }: { children: React.ReactNode; value: string }) => <option value={value}>{children}</option>,
  Paper: ({ children, component, sx: _sx, variant: _variant, ...props }: {
    children: React.ReactNode;
    component?: string;
    sx?: unknown;
    variant?: string;
  }) => {
    const Component = component ?? 'div';
    return <Component {...props}>{children}</Component>;
  },
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TextField: ({ label, select, children, inputProps, sx: _sx, ...props }: {
    label: string;
    select?: boolean;
    children?: React.ReactNode;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    sx?: unknown;
  } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <label>
      {label}
      {select
        ? <select aria-label={label} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>{children}</select>
        : <input aria-label={label} {...inputProps} {...props} />}
    </label>
  ),
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('IPMForm', () => {
  it('impide guardar un año fuera del rango permitido', () => {
    vi.mocked(useTiposMesesOptions).mockReturnValue({
      options: [{ value: '2401', label: 'Enero' }],
      loading: false,
      error: null
    } as ReturnType<typeof useTiposMesesOptions>);
    const onGuardar = vi.fn();

    render(<IPMForm onGuardar={onGuardar} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /Año/i }), { target: { value: '1800' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Guardar' }).closest('form')!);

    expect(screen.getByText('Ingrese un año válido')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });
});
