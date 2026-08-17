// src/pages/mantenedores/escalas/InteresPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import MainLayout from '../../../layout/MainLayout';
import Interes from '../../../components/escalas/Interes';

const InteresPage: React.FC = () => {
  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Gestión de Intereses
        </Typography>
        <Interes />
      </Box>
    </MainLayout>
  );
};

export default InteresPage;
