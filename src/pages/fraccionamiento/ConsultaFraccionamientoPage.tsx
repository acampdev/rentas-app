// src/pages/fraccionamiento/ConsultaFraccionamientoPage.tsx
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import ConsultaFraccionamiento from '../../components/fraccionamiento/ConsultaFraccionamiento';

/**
 * Página de consulta de fraccionamientos
 */
const ConsultaFraccionamientoPage: React.FC = () => {
  return (
    <MainLayout>
      <ConsultaFraccionamiento />
    </MainLayout>
  );
};

export default ConsultaFraccionamientoPage;
