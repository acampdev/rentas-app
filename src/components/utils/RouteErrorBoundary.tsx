import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalErrorBoundary from './GlobalErrorBoundary';

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

const RouteErrorBoundary = ({ children }: RouteErrorBoundaryProps) => {
  const location = useLocation();

  return (
    <GlobalErrorBoundary resetKeys={[location.key, location.pathname]}>
      {children}
    </GlobalErrorBoundary>
  );
};

export default RouteErrorBoundary;
