// src/pages/fraccionamiento/AprobacionFraccionamientoPage.tsx
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import AprobacionFraccionamiento from '../../components/fraccionamiento/AprobacionFraccionamiento';

/**
 * Página de aprobación de fraccionamientos
 */
const AprobacionFraccionamientoPage: React.FC = () => {
  return (
    <MainLayout>
      <AprobacionFraccionamiento />
    </MainLayout>
  );
};

export default AprobacionFraccionamientoPage;
