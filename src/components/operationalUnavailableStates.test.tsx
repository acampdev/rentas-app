import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Movimientos from './caja/modal/Movimientos';
import ReportesCuentas from './reportes/ReportesCuentas';
import DeduccionBeneficio from './contribuyentes/DeduccionBeneficio';

describe('Operational modules without a real API', () => {
  it('marks account reports as unavailable instead of rendering simulated amounts', () => {
    render(<ReportesCuentas />);

    expect(screen.getByText('Módulo no disponible')).toBeVisible();
    expect(screen.getByText(/No se muestran movimientos, contribuyentes ni importes de demostración/i)).toBeVisible();
  });

  it('marks cash movements as unavailable and keeps the dialog closable', () => {
    const onClose = vi.fn();
    render(<Movimientos open onClose={onClose} />);

    expect(screen.getByText('Módulo no disponible')).toBeVisible();
    fireEvent.click(screen.getAllByRole('button', { name: 'Cerrar' })[0]);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('marks deductions and benefits as unavailable without rendering fictional people', () => {
    render(<DeduccionBeneficio />);

    expect(screen.getByText('Módulo no disponible')).toBeVisible();
    expect(screen.getByText(/No se muestran contribuyentes, predios ni estados de beneficio simulados/i)).toBeVisible();
    expect(screen.queryByText('Juan Pérez García')).not.toBeInTheDocument();
    expect(screen.queryByText('P-001')).not.toBeInTheDocument();
  });
});
