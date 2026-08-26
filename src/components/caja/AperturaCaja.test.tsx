import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useUsuarios } from '../../hooks/useUsuarios';
import AperturaCaja from './AperturaCaja';

vi.mock('../../hooks/useUsuarios', () => ({
  useUsuarios: vi.fn()
}));

vi.mock('../../config/api.unified.config', () => ({
  getAuthenticatedUserCode: () => 17
}));

vi.mock('./aperturaCaja/AperturaCajaHeader', () => ({
  AperturaCajaHeader: () => null
}));

vi.mock('./aperturaCaja/aperturaCaja.styles', () => ({
  StyledAperturaDialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div>{children}</div> : null
}));

vi.mock('./aperturaCaja/AperturaCajaForm', () => ({
  AperturaCajaForm: ({ form, confirmed, onAmountChange, onConfirm }: {
    form: { montoInicial: string };
    confirmed: boolean;
    onAmountChange: (value: string) => void;
    onConfirm: (value: boolean) => void;
  }) => (
    <>
      <label>
        Monto Inicio de Caja
        <input
          aria-label="Monto Inicio de Caja"
          type="number"
          value={form.montoInicial}
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </label>
      <label>
        <input
          aria-label="Confirmo que el monto inicial ingresado es correcto"
          type="checkbox"
          checked={confirmed}
          disabled={form.montoInicial === ''}
          onChange={(event) => onConfirm(event.target.checked)}
        />
        Confirmo que el monto inicial ingresado es correcto
      </label>
    </>
  )
}));

vi.mock('./aperturaCaja/AperturaCajaActions', () => ({
  AperturaCajaActions: ({ canSubmit, onSubmit }: { canSubmit: boolean; onSubmit: () => void }) => (
    <button type="button" disabled={!canSubmit} onClick={onSubmit}>Grabar</button>
  )
}));

describe('AperturaCaja', () => {
  it('exige ingresar y confirmar explícitamente el monto inicial', () => {
    vi.mocked(useUsuarios).mockReturnValue({
      usuarios: [{
        codUsuario: 17,
        nombrePersona: 'Cajero de prueba',
        documento: '12345678',
        username: 'cajero',
        password: null,
        codRol: 1,
        parametroBusqueda: null,
        rol: 'Cajero',
        estado: 'ACTIVO',
        usuario: null
      }],
      loading: false
    } as ReturnType<typeof useUsuarios>);

    const onSave = vi.fn();
    render(<AperturaCaja open onClose={vi.fn()} onSave={onSave} />);

    const monto = screen.getByRole('spinbutton', { name: /Monto Inicio de Caja/i });
    const confirmar = screen.getByRole('checkbox', {
      name: /Confirmo que el monto inicial ingresado es correcto/i
    });
    const grabar = screen.getByRole('button', { name: /Grabar/i });

    expect(monto).toHaveValue(null);
    expect(confirmar).toBeDisabled();
    expect(grabar).toBeDisabled();

    fireEvent.change(monto, { target: { value: '0' } });
    expect(confirmar).toBeEnabled();
    expect(grabar).toBeDisabled();

    fireEvent.click(confirmar);
    expect(grabar).toBeEnabled();
    fireEvent.click(grabar);

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      montoInicial: 0,
      codUsuario: 17
    }));
  });
});
