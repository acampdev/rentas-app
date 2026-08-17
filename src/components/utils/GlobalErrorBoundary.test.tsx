import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import GlobalErrorBoundary from './GlobalErrorBoundary';

const BrokenView = () => {
  throw new Error('fallo de prueba');
};

describe('GlobalErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks());

  it('evita una pantalla en blanco y notifica el incidente', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const onError = vi.fn();

    render(
      <GlobalErrorBoundary onError={onError}>
        <BrokenView />
      </GlobalErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo mostrar esta pantalla');
    expect(screen.getByText(/Código de referencia:/)).toBeInTheDocument();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('permite reintentar el renderizado', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let shouldFail = true;
    const RecoverableView = () => {
      if (shouldFail) throw new Error('fallo temporal');
      return <div>Pantalla recuperada</div>;
    };

    render(
      <GlobalErrorBoundary>
        <RecoverableView />
      </GlobalErrorBoundary>
    );

    shouldFail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(screen.getByText('Pantalla recuperada')).toBeInTheDocument();
  });
});

