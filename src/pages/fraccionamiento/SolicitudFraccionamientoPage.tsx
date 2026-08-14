// src/pages/fraccionamiento/SolicitudFraccionamientoPage.tsx
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import SolicitudFraccionamiento from '../../components/fraccionamiento/SolicitudFraccionamiento';

/**
 * Página de solicitud de fraccionamiento
 */
const SolicitudFraccionamientoPage: React.FC = () => {
  return (
    <MainLayout>
      <SolicitudFraccionamiento />
    </MainLayout>
  );
};

export default SolicitudFraccionamientoPage;
