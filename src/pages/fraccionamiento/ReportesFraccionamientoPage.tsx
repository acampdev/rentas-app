// src/pages/fraccionamiento/ReportesFraccionamientoPage.tsx
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import ReportesFraccionamiento from '../../components/fraccionamiento/ReportesFraccionamiento';

/**
 * Página de reportes de fraccionamiento
 */
const ReportesFraccionamientoPage: React.FC = () => {
  return (
    <MainLayout>
      <ReportesFraccionamiento />
    </MainLayout>
  );
};

export default ReportesFraccionamientoPage;
