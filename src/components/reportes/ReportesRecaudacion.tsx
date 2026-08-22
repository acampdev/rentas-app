import type { FC } from 'react';
import { Assessment as RecaudacionIcon } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Paper, Stack, Typography } from '@mui/material';

const ReportesRecaudacion: FC = () => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
        <RecaudacionIcon color="primary" />
        Recaudación y Métricas
      </Typography>
    </Box>

    <Paper variant="outlined" sx={{ p: 3 }}>
      <Alert severity="warning" variant="outlined">
        <AlertTitle>Módulo no disponible</AlertTitle>
        El reporte de recaudación todavía no está conectado a una API municipal.
        No se muestran totales, tendencias ni gráficos con datos simulados.
      </Alert>
    </Paper>
  </Stack>
);

export default ReportesRecaudacion;
