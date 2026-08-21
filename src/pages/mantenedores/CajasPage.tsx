// src/pages/mantenedores/CajaPage.tsx
import React from 'react';
import { Container, Box } from '@mui/material';
import MainLayout from '../../layout/MainLayout';
import Cajas from '../../components/caja/mantenedores/Cajas';

const CajaPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ width: '100%', minWidth: 0, py: { xs: 1.5, sm: 2, md: 3 } }}>
          <Cajas />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default CajaPage;
