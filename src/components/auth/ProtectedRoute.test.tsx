import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthContext } from '../../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../../context/AuthContext', () => ({
  useAuthContext: vi.fn()
}));

const mockedUseAuthContext = vi.mocked(useAuthContext);

const renderRoute = () => render(
  <MemoryRouter initialEntries={['/ruta-prueba']}>
    <Routes>
      <Route path="/login" element={<div>Página de acceso</div>} />
      <Route
        path="/ruta-prueba"
        element={(
          <ProtectedRoute allowedRoles={['SUPERVISOR']}>
            <div>Contenido protegido</div>
          </ProtectedRoute>
        )}
      />
    </Routes>
  </MemoryRouter>
);

describe('ProtectedRoute', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redirige al login cuando no existe una sesión autenticada', () => {
    mockedUseAuthContext.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null
    } as ReturnType<typeof useAuthContext>);

    renderRoute();

    expect(screen.getByText('Página de acceso')).toBeInTheDocument();
  });

  it('muestra acceso denegado cuando el rol no está autorizado', () => {
    mockedUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'cajero', nombreCompleto: 'Caja', roles: ['CAJERO'] }
    } as ReturnType<typeof useAuthContext>);

    renderRoute();

    expect(screen.getByText('Acceso no autorizado')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('renderiza la ruta cuando el usuario tiene un rol permitido', () => {
    mockedUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'supervisor', nombreCompleto: 'Supervisor', roles: ['SUPERVISOR'] }
    } as ReturnType<typeof useAuthContext>);

    renderRoute();

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});

