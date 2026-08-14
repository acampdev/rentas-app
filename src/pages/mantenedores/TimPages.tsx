// src/pages/mantenedores/TimPages.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import MainLayout from '../../layout/MainLayout';
import { ConsultaTim } from '../../components/tim/ConsultaTim';

const TimPages: React.FC = () => {
  return (
    <MainLayout title="Escalas TIM">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Escalas de TIM (Tasa de Interés Moratorio)
        </Typography>
        <ConsultaTim />
      </Box>
    </MainLayout>
  );
};

export default TimPages;