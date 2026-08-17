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

describe('IPMForm', () => {
  it('impide guardar un año fuera del rango permitido', async () => {
    vi.mocked(useTiposMesesOptions).mockReturnValue({
      options: [{ value: '2401', label: 'Enero' }],
      loading: false,
      error: null
    } as ReturnType<typeof useTiposMesesOptions>);
    const onGuardar = vi.fn();

    render(<IPMForm onGuardar={onGuardar} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /Año/i }), { target: { value: '1800' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Guardar' }).closest('form')!);

    expect(await screen.findByText('Ingrese un año válido')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });
});
