// src/pages/sistema/AuditoriaPage.tsx
import React from 'react';
import { Container } from '@mui/material';
import MainLayout from '../../layout/MainLayout';
import ConsultaAuditoria from '../../components/auditoria/ConsultaAuditoria';

/** Página de Auditoría: muestra los registros obtenidos desde la API. */
const AuditoriaPage: React.FC = () => (
  <MainLayout title="Auditoría del Sistema">
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <ConsultaAuditoria />
    </Container>
  </MainLayout>
);

export default AuditoriaPage;
