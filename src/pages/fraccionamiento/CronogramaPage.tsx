// src/pages/fraccionamiento/CronogramaPage.tsx
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import Cronograma from '../../components/fraccionamiento/Cronograma';

/**
 * Página de cronograma de pagos
 */
const CronogramaPage: React.FC = () => {
  return (
    <MainLayout>
      <Cronograma />
    </MainLayout>
  );
};

export default CronogramaPage;
